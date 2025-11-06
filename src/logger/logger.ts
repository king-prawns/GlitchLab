/* eslint-disable no-console */

import ChaosOptions from '@config/interfaces/chaosOptions';

import Console from './interfaces/console';

class Logger {
  #opt: Required<ChaosOptions>;

  constructor(opt: Required<ChaosOptions>) {
    this.#opt = opt;
  }

  registerLogger = (): Console => {
    return {
      debug: this.#send(console.debug.bind(self.console)),
      log: this.#send(console.log.bind(self.console)),
      info: this.#send(console.info.bind(self.console)),
      warn: this.#send(console.warn.bind(self.console)),
      error: this.#send(console.error.bind(self.console))
    };
  };

  #send<T>(consoleCallback: T): T | (() => undefined) {
    if (this.#shouldLog()) {
      return consoleCallback;
    }

    return () => undefined;
  }

  #shouldLog(): boolean {
    if (this.#opt.quiet) return false;

    return true;
  }
}

export default Logger;
