import Dispatcher from '@dispatcher/dispatcher';
import ChaosEvent from '@dispatcher/enum/chaosEvent';
import Seed from '@seed/seed';

import Patch from './patch';

class Network extends Patch {
  #originalFetch: typeof fetch | null = null;
  #originalXHR: typeof XMLHttpRequest | null = null;

  patch(): void {
    if (this.opt.httpChaos === 0) return;

    this.console.info('Patching network');

    this.#patchFetch();
    this.#patchXMLHttpRequest();
  }

  restore(): void {
    if (this.opt.httpChaos === 0) return;

    this.console.info('Restoring network');

    this.#restoreFetch();
    this.#restoreXMLHttpRequest();
  }

  #patchFetch(): void {
    if (!this.#originalFetch) {
      this.#originalFetch = window.fetch;
    }

    const original: typeof fetch = this.#originalFetch!;

    const patched: typeof fetch = (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
      if (this.seed.random() < this.opt.httpChaos) {
        this.dispatcher.emit(ChaosEvent.httpChaos, {type: 'fetch', url: input.toString()});

        return Promise.reject(new TypeError('GlitchLab: Failed to fetch'));
      }

      return original.call(window, input, init);
    };

    window.fetch = patched;
  }

  #patchXMLHttpRequest(): void {
    if (!this.#originalXHR) {
      this.#originalXHR = window.XMLHttpRequest;
    }

    const RealXHR: typeof XMLHttpRequest = this.#originalXHR;
    const dispatcher: Dispatcher = this.dispatcher;
    const httpChaos: number = this.opt.httpChaos;
    const seed: Seed = this.seed;

    const PatchedXHR: typeof XMLHttpRequest = ((): typeof XMLHttpRequest => {
      type OnName =
        | 'readystatechange'
        | 'loadstart'
        | 'progress'
        | 'abort'
        | 'timeout'
        | 'error'
        | 'load'
        | 'loadend';

      class MonkeyXHR {
        #real: XMLHttpRequest;
        #listeners: Map<string, Set<EventListenerOrEventListenerObject>> = new Map();
        #on: Partial<Record<OnName, ((ev: Event) => void) | null>> = {};
        #shouldFail = false;
        #failed = false;

        constructor() {
          this.#real = new RealXHR();
          this.#real.addEventListener('readystatechange', (e: Event) =>
            this.#dispatch('readystatechange', e)
          );
          this.#real.addEventListener('loadstart', (e: Event) => this.#dispatch('loadstart', e));
          this.#real.addEventListener('progress', (e: Event) => this.#dispatch('progress', e));
          this.#real.addEventListener('abort', (e: Event) => {
            this.#failed = true;
            this.#dispatch('abort', e);
            this.#dispatch('loadend', e);
          });
          this.#real.addEventListener('timeout', (e: Event) => {
            this.#failed = true;
            this.#dispatch('timeout', e);
            this.#dispatch('loadend', e);
          });
          this.#real.addEventListener('error', (e: Event) => {
            this.#failed = true;
            this.#dispatch('error', e);
            this.#dispatch('loadend', e);
          });
          this.#real.addEventListener('load', (e: Event) => {
            if (this.#shouldFail) {
              this.#failed = true;
              dispatcher.emit(ChaosEvent.httpChaos, {type: 'xhr', url: this.#real.responseURL});

              this.#dispatch('error', new ProgressEvent('error'));

              return;
            }
            this.#dispatch('load', e);
          });
          this.#real.addEventListener('loadend', (e: Event) => {
            if (this.#shouldFail && !this.#failed) {
              this.#failed = true;
              this.#dispatch('error', new ProgressEvent('error'));
            }
            this.#dispatch('loadend', e);
          });
        }

        // EventTarget API
        addEventListener(
          type: string,
          listener: EventListenerOrEventListenerObject,
          _options?: boolean | AddEventListenerOptions
        ): void {
          const set: Set<EventListenerOrEventListenerObject> = this.#listeners.get(type) ?? new Set();
          set.add(listener);
          this.#listeners.set(type, set);
        }
        removeEventListener(
          type: string,
          listener: EventListenerOrEventListenerObject,
          _options?: boolean | EventListenerOptions
        ): void {
          const set: Set<EventListenerOrEventListenerObject> | undefined = this.#listeners.get(type);
          if (set) {
            set.delete(listener);
            if (set.size === 0) this.#listeners.delete(type);
          }
        }
        dispatchEvent(event: Event): boolean {
          this.#dispatch(event.type as OnName, event);

          return true;
        }

        // Methods
        open(
          method: string,
          url: string,
          async: boolean = true,
          username?: string | null,
          password?: string | null
        ): void {
          this.#real.open(method, url, async, username, password);
        }
        send(body?: Document | XMLHttpRequestBodyInit | null): void {
          this.#shouldFail = seed.random() < httpChaos;
          this.#real.send(body ?? null);
        }
        abort(): void {
          this.#real.abort();
        }
        setRequestHeader(header: string, value: string): void {
          this.#real.setRequestHeader(header, value);
        }
        getResponseHeader(name: string): string | null {
          return this.#failed || this.#shouldFail ? null : this.#real.getResponseHeader(name);
        }
        getAllResponseHeaders(): string {
          return this.#failed || this.#shouldFail ? '' : this.#real.getAllResponseHeaders();
        }
        overrideMimeType(mime: string): void {
          this.#real.overrideMimeType(mime);
        }

        // Properties
        get readyState(): number {
          return this.#real.readyState;
        }
        get response(): unknown {
          return this.#failed || this.#shouldFail ? null : this.#real.response;
        }
        get responseText(): string {
          return this.#failed || this.#shouldFail ? '' : this.#real.responseText;
        }
        get responseXML(): Document | null {
          return this.#failed || this.#shouldFail ? null : this.#real.responseXML;
        }
        get responseURL(): string {
          return this.#failed || this.#shouldFail ? '' : this.#real.responseURL || '';
        }
        get status(): number {
          return this.#failed || this.#shouldFail ? 0 : this.#real.status;
        }
        get statusText(): string {
          return this.#failed || this.#shouldFail ? '' : this.#real.statusText;
        }
        get responseType(): XMLHttpRequestResponseType {
          return this.#real.responseType;
        }
        set responseType(t: XMLHttpRequestResponseType) {
          this.#real.responseType = t;
        }
        get timeout(): number {
          return this.#real.timeout;
        }
        set timeout(v: number) {
          this.#real.timeout = v;
        }
        get withCredentials(): boolean {
          return this.#real.withCredentials;
        }
        set withCredentials(v: boolean) {
          this.#real.withCredentials = v;
        }
        get upload(): XMLHttpRequestUpload {
          return this.#real.upload;
        }

        // on* properties
        get onreadystatechange(): ((ev: Event) => void) | null | undefined {
          return this.#on.readystatechange ?? null;
        }
        set onreadystatechange(fn: ((ev: Event) => void) | null) {
          this.#on.readystatechange = fn ?? null;
        }
        get onloadstart(): ((ev: Event) => void) | null | undefined {
          return this.#on.loadstart ?? null;
        }
        set onloadstart(fn: ((ev: Event) => void) | null) {
          this.#on.loadstart = fn ?? null;
        }
        get onprogress(): ((ev: Event) => void) | null | undefined {
          return this.#on.progress ?? null;
        }
        set onprogress(fn: ((ev: Event) => void) | null) {
          this.#on.progress = fn ?? null;
        }
        get onabort(): ((ev: Event) => void) | null | undefined {
          return this.#on.abort ?? null;
        }
        set onabort(fn: ((ev: Event) => void) | null) {
          this.#on.abort = fn ?? null;
        }
        get ontimeout(): ((ev: Event) => void) | null | undefined {
          return this.#on.timeout ?? null;
        }
        set ontimeout(fn: ((ev: Event) => void) | null) {
          this.#on.timeout = fn ?? null;
        }
        get onerror(): ((ev: Event) => void) | null | undefined {
          return this.#on.error ?? null;
        }
        set onerror(fn: ((ev: Event) => void) | null) {
          this.#on.error = fn ?? null;
        }
        get onload(): ((ev: Event) => void) | null | undefined {
          return this.#on.load ?? null;
        }
        set onload(fn: ((ev: Event) => void) | null) {
          this.#on.load = fn ?? null;
        }
        get onloadend(): ((ev: Event) => void) | null | undefined {
          return this.#on.loadend ?? null;
        }
        set onloadend(fn: ((ev: Event) => void) | null) {
          this.#on.loadend = fn ?? null;
        }

        #dispatch(type: OnName, ev: Event): void {
          const set: Set<EventListenerOrEventListenerObject> | undefined = this.#listeners.get(type);
          if (set) {
            for (const l of set) {
              if (typeof l === 'function') {
                (l as (this: XMLHttpRequest, ev: Event) => void).call(this as unknown as XMLHttpRequest, ev);
              } else if (l && typeof (l as EventListenerObject).handleEvent === 'function') {
                (l as EventListenerObject).handleEvent.call(l as EventListenerObject, ev);
              }
            }
          }
          const prop: ((ev: Event) => void) | null | undefined = this.#on[type];
          if (prop) prop.call(this as unknown as XMLHttpRequest, ev);
        }
      }

      Object.setPrototypeOf(MonkeyXHR.prototype, RealXHR.prototype);

      for (const key of Object.getOwnPropertyNames(RealXHR)) {
        if (key === 'prototype' || key === 'length' || key === 'name') continue;
        const desc: PropertyDescriptor | undefined = Object.getOwnPropertyDescriptor(RealXHR, key);
        if (desc) {
          try {
            Object.defineProperty(MonkeyXHR, key, desc);
          } catch {
            /* ignore */
          }
        }
      }

      return MonkeyXHR as unknown as typeof XMLHttpRequest;
    })();

    window.XMLHttpRequest = PatchedXHR;
  }

  #restoreFetch(): void {
    if (this.#originalFetch) {
      window.fetch = this.#originalFetch;
    }

    this.#originalFetch = null;
  }

  #restoreXMLHttpRequest(): void {
    if (this.#originalXHR) {
      window.XMLHttpRequest = this.#originalXHR;
    }

    this.#originalXHR = null;
  }
}

export default Network;
