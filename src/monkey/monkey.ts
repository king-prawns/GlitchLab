import type ChaosOptions from '@config/interfaces/chaosOptions';
import Dispatcher from '@dispatcher/dispatcher';
import type Console from '@logger/interfaces/console';

import Eme from './patch/eme';
import Mse from './patch/mse';
import Network from './patch/network';
import Patch from './patch/patch';
import Playback from './patch/playback';
import Timers from './patch/timers';

class Monkey {
  #monkeys: Array<Patch> = [];

  constructor(opt: DeepRequired<ChaosOptions>, dispatcher: Dispatcher, console: Console) {
    this.#monkeys.push(
      new Timers(opt, dispatcher, console),
      new Eme(opt, dispatcher, console),
      new Mse(opt, dispatcher, console),
      new Network(opt, dispatcher, console),
      new Playback(opt, dispatcher, console)
    );
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
