import type ChaosOptions from '@config/interfaces/chaosOptions';
import type Console from '@logger/interfaces/console';
import Seed from '@seed/seed';

import Network from './patch/network';
import Patch from './patch/patch';
import Timers from './patch/timers';

class Monkey {
  #monkeys: Array<Patch> = [];

  constructor(opt: Required<ChaosOptions>, console: Console) {
    const seed: Seed = new Seed(opt.seed);
    this.#monkeys.push(new Timers(seed, opt, console), new Network(seed, opt, console));
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
