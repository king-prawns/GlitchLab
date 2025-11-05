import Config from '@config/config';
import type ChaosOptions from '@config/interfaces/chaosOptions';
import type Console from '@logger/interfaces/console';
import Logger from '@logger/logger';
import Monkey from '@monkey/monkey';

class GlitchLab {
  #config: Config;
  #console: Console;
  #monkey: Monkey;

  constructor(opt?: ChaosOptions) {
    this.#config = new Config(opt);
    this.#console = new Logger(this.#config.opt).registerLogger();

    this.#monkey = new Monkey(this.#config.opt, this.#console);

    this.#console.info(`GlitchLab v${this.version}`);
    this.#console.info('GlitchLab config:', this.#config.opt);
  }

  get version(): string {
    return APP_VERSION;
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
