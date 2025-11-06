import ChaosOptions from './interfaces/chaosOptions';

class Config {
  #options: Required<ChaosOptions> = {
    timerThrottle: 1.0,
    quiet: false
  };

  constructor(opt?: ChaosOptions) {
    if (opt) {
      this.#update(opt);
    }
  }

  get opt(): Required<ChaosOptions> {
    return this.#options;
  }

  #update(opt: ChaosOptions): void {
    const sanitizedOpt: Partial<ChaosOptions> = this.#sanitizeOpt(opt);

    this.#options = Object.assign(this.#options, sanitizedOpt);
  }

  #sanitizeOpt(opt: Partial<ChaosOptions>): Partial<ChaosOptions> {
    const sanitizedOpt: Partial<ChaosOptions> = {};

    if (opt.timerThrottle !== undefined) {
      if (opt.timerThrottle <= 0 || opt.timerThrottle > 1) {
        throw new Error('timerThrottle must be greater than 0 and less than or equal to 1');
      }
      sanitizedOpt.timerThrottle = Math.min(opt.timerThrottle, this.#options.timerThrottle);
    }

    if (opt.quiet !== undefined) {
      sanitizedOpt.quiet = opt.quiet;
    }

    return sanitizedOpt;
  }
}

export default Config;
