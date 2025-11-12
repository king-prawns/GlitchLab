import type ChaosOptions from '@config/interfaces/chaosOptions';
import type Console from '@logger/interfaces/console';

import Network from './patch/network';
import Patch from './patch/patch';
import Playback from './patch/playback';
import Timers from './patch/timers';

class Monkey {
  #monkeys: Array<Patch> = [];

  constructor(opt: Required<ChaosOptions>, console: Console) {
    this.#monkeys.push(new Timers(opt, console), new Network(opt, console), new Playback(opt, console));
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
