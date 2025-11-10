import ChaosOptions from './interfaces/chaosOptions';

class Config {
  #options: Required<ChaosOptions> = {
    timerThrottle: 1.0,
    httpChaos: 0,
    seed: null,
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
        throw new Error('"timerThrottle" must be greater than 0 and less than or equal to 1');
      }
      sanitizedOpt.timerThrottle = opt.timerThrottle;
    }

    if (opt.httpChaos !== undefined) {
      if (opt.httpChaos < 0 || opt.httpChaos > 1) {
        throw new Error('"httpChaos" must be between 0 and 1');
      }
      sanitizedOpt.httpChaos = opt.httpChaos;
    }

    if (opt.seed !== undefined) {
      const s: number | null = opt.seed;
      if (s === null) {
        sanitizedOpt.seed = null;
      } else if (typeof s === 'number' && Number.isFinite(s)) {
        sanitizedOpt.seed = s;
      } else {
        throw new Error('"seed" must be a finite number or null');
      }
    }

    if (opt.quiet !== undefined) {
      sanitizedOpt.quiet = opt.quiet;
    }

    return sanitizedOpt;
  }
}

export default Config;
