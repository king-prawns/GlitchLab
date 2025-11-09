import Patch from './patch';

class Network extends Patch {
  #originalFetch: typeof fetch | null = null;

  patch(): void {
    if (this.opt.httpChaos === 0) return;

    this.console.info('Patching network');

    this.#patchFetch();
  }

  restore(): void {
    if (this.opt.httpChaos === 0) return;

    this.console.info('Restoring network');

    this.#restoreFetch();
  }

  #patchFetch(): void {
    if (!this.#originalFetch && typeof window.fetch === 'function') {
      this.#originalFetch = window.fetch;
    }

    const original: typeof fetch = this.#originalFetch!;

    const patched: typeof fetch = (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
      if (Math.random() < this.opt.httpChaos) {
        return Promise.reject(new TypeError('GlitchLab: Failed to fetch'));
      }

      return original.call(window, input, init);
    };

    window.fetch = patched;
  }

  #restoreFetch(): void {
    if (this.#originalFetch) {
      window.fetch = this.#originalFetch;
    }

    this.#originalFetch = null;
  }
}

export default Network;
