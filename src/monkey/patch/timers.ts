import type ChaosOptions from '@config/interfaces/chaosOptions';
import type Console from '@logger/interfaces/console';

import Patch from '../interfaces/patch';

class Timers implements Patch {
  #opt: Required<ChaosOptions>;
  #console: Console;

  #originalSetTimeout: typeof setTimeout | null = null;
  #originalSetInterval: typeof setInterval | null = null;
  #originalRequestAnimationFrame: typeof requestAnimationFrame | null = null;
  #originalRafAnchor: number | null = null;

  constructor(opt: Required<ChaosOptions>, console: Console) {
    this.#opt = opt;
    this.#console = console;
  }

  patch(): void {
    if (this.#opt.timerThrottle === 1.0) return;

    this.#console.info('Patching timers');

    this.#patchSetTimeout();
    this.#patchSetInterval();
    this.#patchRequestAnimationFrame();
  }

  restore(): void {
    this.#console.info('Restoring timers');

    this.#restoreSetTimeout();
    this.#restoreSetInterval();
    this.#restoreRequestAnimationFrame();
  }

  #patchSetTimeout(): void {
    if (!this.#originalSetTimeout) {
      this.#originalSetTimeout = window.setTimeout;
    }

    const original: (handler: TimerHandler, timeout?: number, ...args: Array<unknown>) => number =
      this.#originalSetTimeout!;

    const patched: typeof setTimeout = ((
      handler: TimerHandler,
      timeout?: number,
      ...args: Array<unknown>
    ): number => {
      const t: number = this.#opt.timerThrottle;
      const requested: number = typeof timeout === 'number' && isFinite(timeout) ? timeout : 0;
      const scaled: number = Math.round(requested / t);

      if (typeof handler === 'function') {
        return original.call(
          window,
          function () {
            (handler as (...a: unknown[]) => void).apply(window, args);
          },
          scaled
        );
      }

      return original.call(window, handler, scaled);
    }) as typeof setTimeout;

    window.setTimeout = patched;
  }

  #patchSetInterval(): void {
    if (!this.#originalSetInterval) {
      this.#originalSetInterval = window.setInterval;
    }

    const original: (handler: TimerHandler, timeout?: number, ...args: Array<unknown>) => number =
      this.#originalSetInterval!;

    const patched: typeof setInterval = ((
      handler: TimerHandler,
      timeout?: number,
      ...args: Array<unknown>
    ): number => {
      const t: number = this.#opt.timerThrottle;
      const requested: number = typeof timeout === 'number' && isFinite(timeout) ? timeout : 0;
      const scaled: number = Math.round(requested / t);

      if (typeof handler === 'function') {
        return original.call(
          window,
          function () {
            (handler as (...a: unknown[]) => void).apply(window, args);
          },
          scaled
        );
      }

      return original.call(window, handler, scaled);
    }) as typeof setInterval;

    window.setInterval = patched;
  }

  #patchRequestAnimationFrame(): void {
    if (!this.#originalRequestAnimationFrame) {
      this.#originalRequestAnimationFrame = window.requestAnimationFrame;
    }

    const original: typeof requestAnimationFrame = this.#originalRequestAnimationFrame!;

    const patched: typeof requestAnimationFrame = ((callback: FrameRequestCallback): number => {
      const t: number = this.#opt.timerThrottle;

      return original.call(window, (realTs: DOMHighResTimeStamp) => {
        if (this.#originalRafAnchor === null) {
          this.#originalRafAnchor = realTs;
        }

        const virtualTs: number = this.#originalRafAnchor + (realTs - this.#originalRafAnchor) * t;
        callback(virtualTs);
      });
    }) as typeof requestAnimationFrame;

    window.requestAnimationFrame = patched;
  }

  #restoreSetTimeout(): void {
    if (this.#originalSetTimeout) {
      window.setTimeout = this.#originalSetTimeout;
    }

    this.#originalSetTimeout = null;
  }

  #restoreSetInterval(): void {
    if (this.#originalSetInterval) {
      window.setInterval = this.#originalSetInterval;
    }

    this.#originalSetInterval = null;
  }

  #restoreRequestAnimationFrame(): void {
    if (this.#originalRequestAnimationFrame) {
      window.requestAnimationFrame = this.#originalRequestAnimationFrame;
    }

    this.#originalRequestAnimationFrame = null;
    this.#originalRafAnchor = null;
  }
}

export default Timers;
