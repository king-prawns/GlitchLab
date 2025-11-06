import type ChaosOptions from '@config/interfaces/chaosOptions';
import type Console from '@logger/interfaces/console';

import Patch from './interfaces/patch';
import Timers from './patch/timers';

class Monkey {
  #monkeys: Array<Patch> = [];

  constructor(opt: Required<ChaosOptions>, console: Console) {
    this.#monkeys.push(new Timers(opt, console));
  }

  patch(): void {
    for (const monkey of this.#monkeys) {
      monkey.patch();
    }
  }

  restore(): void {
    for (const monkey of this.#monkeys) {
      monkey.restore();
    }
  }
}

export default Monkey;
