import Config from '@config/config';
import type Console from '@logger/interfaces/console';

import type Chaos from './interfaces/chaos';
import type ChaosOptions from './interfaces/chaosOptions';
import Logger from './logger/logger';

class GlitchLab implements Chaos {
  #config: Config;
  #console: Console;

  constructor(opt?: ChaosOptions) {
    this.#config = new Config(opt);
    this.#console = new Logger(this.#config).registerLogger();

    this.#console.info(`GlitchLab v${this.version}`);
    this.#console.info('GlitchLab config:', this.#config.opt);
  }

  get version(): string {
    return APP_VERSION;
  }

  enable(): void {
    // TODO: implement
  }
  disable(): void {
    // TODO: implement
  }
}

export default GlitchLab;
