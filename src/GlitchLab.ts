import Config from '@config/config';
import ChaosLevel from '@config/enum/chaosLevel';
import type ChaosOptions from '@config/interfaces/chaosOptions';
import Dispatcher from '@dispatcher/dispatcher';
import ChaosEvents from '@dispatcher/interfaces/ChaosEvents';
import type Console from '@logger/interfaces/console';
import Logger from '@logger/logger';
import Monkey from '@monkey/monkey';

class GlitchLab {
  #config: Config;
  #dispatcher: Dispatcher;
  #console: Console;
  #monkey: Monkey;

  constructor(opt: ChaosOptions | ChaosLevel) {
    this.#config = new Config(opt);
    this.#dispatcher = new Dispatcher();
    this.#console = new Logger(this.#config.opt).registerLogger();

    this.#monkey = new Monkey(this.#config.opt, this.#console);

    this.#console.info(`GlitchLab v${this.version}`);
    this.#console.info('GlitchLab config:', this.#config.opt);
  }

  get version(): string {
    return APP_VERSION;
  }

  on<K extends keyof ChaosEvents>(evtName: K, callback: (evt: ChaosEvents[K]) => void): void {
    this.#dispatcher.on(evtName, callback);
  }

  off<K extends keyof ChaosEvents>(event: K, callback: (evt: ChaosEvents[K]) => void): void {
    this.#dispatcher.off(event, callback);
  }

  enable(): void {
    this.#console.info('GlitchLab enabled');

    this.#monkey.patch();
  }

  disable(): void {
    this.#console.info('GlitchLab disabled');

    this.#monkey.restore();
  }
}

export default GlitchLab;
