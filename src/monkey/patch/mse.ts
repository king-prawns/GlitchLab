import MseChaosOptions from '@config/interfaces/mseChaosOptions';
import Dispatcher from '@dispatcher/dispatcher';
import ChaosEvent from '@dispatcher/enum/chaosEvent';
import Seed from '@seed/seed';

import Patch from './patch';

class Mse extends Patch {
  #originalCreateObjectURL: typeof URL.createObjectURL | null = null;
  #originalMediaSource: typeof MediaSource | null = null;

  patch(): void {
    if (this.opt.mse.decode === 0) return;

    this.console.info('Patching mse');

    this.#patchCreateObjectURL();
    this.#patchMediaSource();
  }

  restore(): void {
    if (this.opt.mse.decode === 0) return;

    this.console.info('Restoring mse');

    this.#restoreCreateObjectURL();
    this.#restoreMediaSource();
  }

  #patchCreateObjectURL(): void {
    if (!this.#originalCreateObjectURL) {
      this.#originalCreateObjectURL = URL.createObjectURL;
    }

    const original: typeof URL.createObjectURL = this.#originalCreateObjectURL;

    URL.createObjectURL = function (object: Blob | MediaSource | unknown): string {
      const maybeReal: MediaSource | undefined = (object as {__glitchLabRealMediaSource?: MediaSource})
        ?.__glitchLabRealMediaSource;

      if (maybeReal) {
        return original.call(URL, maybeReal);
      }

      return original.call(URL, object as Blob | MediaSource);
    };
  }

  #patchMediaSource(): void {
    if (!this.#originalMediaSource) {
      this.#originalMediaSource = window.MediaSource;
    }

    const RealMediaSource: typeof MediaSource = this.#originalMediaSource;
    const dispatcher: Dispatcher = this.dispatcher;
    const mseChaos: Required<MseChaosOptions> = this.opt.mse;
    const seed: Seed = this.seed;

    const PatchedMediaSource: typeof MediaSource = ((): typeof MediaSource => {
      type OnName = 'sourceopen' | 'sourceended' | 'sourceclose';

      class MonkeyMediaSource {
        public __glitchLabRealMediaSource: MediaSource;
        #real: MediaSource;
        #listeners: Map<string, Set<EventListenerOrEventListenerObject>> = new Map();
        #on: Partial<Record<OnName, ((ev: Event) => void) | null>> = {};

        constructor() {
          this.#real = new RealMediaSource();
          this.__glitchLabRealMediaSource = this.#real;
          this.#real.addEventListener('sourceopen', (e: Event) => this.#dispatch('sourceopen', e));
          this.#real.addEventListener('sourceended', (e: Event) => this.#dispatch('sourceended', e));
          this.#real.addEventListener('sourceclose', (e: Event) => this.#dispatch('sourceclose', e));
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
        addSourceBuffer(type: string): SourceBuffer {
          const sb: SourceBuffer = this.#real.addSourceBuffer(type);

          const originalAppendBuffer: (data: BufferSource) => void = sb.appendBuffer;
          sb.appendBuffer = function (data: BufferSource): void {
            if (seed.random() < mseChaos.decode) {
              // manipulate the original data to try to break the decode
              const corruptBytes = (
                buffer: ArrayBuffer,
                byteOffset: number = 0,
                byteLength?: number
              ): void => {
                const view: Uint8Array = new Uint8Array(
                  buffer,
                  byteOffset,
                  byteLength ?? buffer.byteLength - byteOffset
                );

                if (view.length === 0) return;

                // flip a small percentage of bytes so that the segment is likely invalid
                const corruptCount: number = Math.max(1, Math.floor(view.length * 0.01));
                for (let i: number = 0; i < corruptCount; i += 1) {
                  const idx: number = Math.floor(Math.random() * view.length);
                  view[idx] = view[idx] ^ 0xff;
                }
              };

              if (data instanceof ArrayBuffer) {
                corruptBytes(data);
              } else if (ArrayBuffer.isView(data)) {
                corruptBytes(data.buffer, data.byteOffset, data.byteLength);
              }

              dispatcher.emit(ChaosEvent.mseChaos, {
                kind: 'SourceBuffer',
                type: 'decode',
                data
              });
            }

            originalAppendBuffer.call(this, data);
          };

          return sb;
        }
        removeSourceBuffer(buffer: SourceBuffer): void {
          this.#real.removeSourceBuffer(buffer);
        }
        endOfStream(error?: unknown): void {
          // Forward to the real MediaSource; the underlying signature is compatible.
          this.#real.endOfStream(error as never);
        }
        setLiveSeekableRange(start: number, end: number): void {
          this.#real.setLiveSeekableRange(start, end);
        }
        clearLiveSeekableRange(): void {
          this.#real.clearLiveSeekableRange();
        }

        // Properties
        get readyState(): MediaSource['readyState'] {
          return this.#real.readyState;
        }
        get duration(): number {
          return this.#real.duration;
        }
        set duration(value: number) {
          this.#real.duration = value;
        }
        get sourceBuffers(): SourceBufferList {
          return this.#real.sourceBuffers;
        }
        get activeSourceBuffers(): SourceBufferList {
          return this.#real.activeSourceBuffers;
        }

        // on* properties
        get onsourceopen(): ((ev: Event) => void) | null | undefined {
          return this.#on.sourceopen ?? null;
        }
        set onsourceopen(fn: ((ev: Event) => void) | null) {
          this.#on.sourceopen = fn ?? null;
        }
        get onsourceended(): ((ev: Event) => void) | null | undefined {
          return this.#on.sourceended ?? null;
        }
        set onsourceended(fn: ((ev: Event) => void) | null) {
          this.#on.sourceended = fn ?? null;
        }
        get onsourceclose(): ((ev: Event) => void) | null | undefined {
          return this.#on.sourceclose ?? null;
        }
        set onsourceclose(fn: ((ev: Event) => void) | null) {
          this.#on.sourceclose = fn ?? null;
        }

        #dispatch(type: OnName, ev: Event): void {
          const set: Set<EventListenerOrEventListenerObject> | undefined = this.#listeners.get(type);
          if (set) {
            for (const l of set) {
              if (typeof l === 'function') {
                (l as (this: MediaSource, ev: Event) => void).call(this as unknown as MediaSource, ev);
              } else if (l && typeof (l as EventListenerObject).handleEvent === 'function') {
                (l as EventListenerObject).handleEvent.call(l as EventListenerObject, ev);
              }
            }
          }
          const prop: ((ev: Event) => void) | null | undefined = this.#on[type];
          if (prop) prop.call(this as unknown as MediaSource, ev);
        }
      }

      Object.setPrototypeOf(MonkeyMediaSource.prototype, RealMediaSource.prototype);

      for (const key of Object.getOwnPropertyNames(RealMediaSource)) {
        if (key === 'prototype' || key === 'length' || key === 'name') continue;
        const desc: PropertyDescriptor | undefined = Object.getOwnPropertyDescriptor(RealMediaSource, key);
        if (desc) {
          try {
            Object.defineProperty(MonkeyMediaSource, key, desc);
          } catch {
            /* ignore */
          }
        }
      }

      return MonkeyMediaSource as unknown as typeof MediaSource;
    })();

    window.MediaSource = PatchedMediaSource;
  }

  #restoreCreateObjectURL(): void {
    if (this.#originalCreateObjectURL) {
      URL.createObjectURL = this.#originalCreateObjectURL;
    }

    this.#originalCreateObjectURL = null;
  }

  #restoreMediaSource(): void {
    if (this.#originalMediaSource) {
      window.MediaSource = this.#originalMediaSource;
    }

    this.#originalMediaSource = null;
  }
}

export default Mse;
