import ChaosLevel from './enum/chaosLevel';
import ChaosOptions from './interfaces/chaosOptions';

class Config {
  #chaosPresets: Record<ChaosLevel, ChaosOptions> = {
    [ChaosLevel.light]: {
      timerThrottle: 0.9,
      httpChaos: 0.1,
      playbackChaos: {seek: 0.05, stall: 0.1}
    },
    [ChaosLevel.medium]: {
      timerThrottle: 0.6,
      httpChaos: 0.3,
      playbackChaos: {seek: 0.15, stall: 0.2}
    },
    [ChaosLevel.extreme]: {
      timerThrottle: 0.4,
      httpChaos: 0.6,
      playbackChaos: {seek: 0.3, stall: 0.4}
    }
  };

  #options: Required<ChaosOptions> = {
    timerThrottle: 1.0,
    httpChaos: 0,
    playbackChaos: {seek: 0, stall: 0},
    seed: null,
    quiet: false
  };

  constructor(opt: ChaosOptions | ChaosLevel) {
    let resolvedOpt: ChaosOptions = {};

    if (typeof opt === 'string') {
      const chaosPreset: ChaosOptions = this.#chaosPresets[opt];
      if (!chaosPreset) {
        throw new Error(
          `Unknown chaos level "${opt}". Valid chaos levels: ${Object.keys(this.#chaosPresets).join(', ')}`
        );
      }
      resolvedOpt = chaosPreset;
    } else {
      resolvedOpt = opt;
    }
    this.#update(resolvedOpt);
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

    if (opt.playbackChaos !== undefined) {
      if (opt.playbackChaos.seek < 0 || opt.playbackChaos.seek > 1) {
        throw new Error('"playbackChaos.seek" must be between 0 and 1');
      }

      if (opt.playbackChaos.stall < 0 || opt.playbackChaos.stall > 1) {
        throw new Error('"playbackChaos.stall" must be between 0 and 1');
      }

      sanitizedOpt.playbackChaos = {
        seek: opt.playbackChaos.seek,
        stall: opt.playbackChaos.stall
      };
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
