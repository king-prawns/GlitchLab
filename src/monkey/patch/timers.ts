import type ChaosOptions from '@config/interfaces/chaosOptions';
import type Console from '@logger/interfaces/console';

import Patch from '../interfaces/patch';

class Timers implements Patch {
  #opt: Required<ChaosOptions>;
  #console: Console;

  constructor(opt: Required<ChaosOptions>, console: Console) {
    this.#opt = opt;
    this.#console = console;
  }

  patch(): void {
    this.#console.info('Patching timers');
    // TODO: patch set Timeout, setInterval, rAF
    // this.#patchSetTimeout();
    this.#console.debug(`${this.#opt.timerThrottle}`);
  }

  restore(): void {
    this.#console.info('Restoring timers');
    // TODO: restore set Timeout, setInterval, rAF
  }
}

export default Timers;
