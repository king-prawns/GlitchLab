import ChaosLevel from './enum/chaosLevel';
import ChaosOptions from './interfaces/chaosOptions';
import HttpChaosOptions from './interfaces/httpChaosOptions';
import PlaybackChaosOptions from './interfaces/playbackChaosOptions';

class Config {
  #chaosPresets: Record<ChaosLevel, ChaosOptions> = {
    [ChaosLevel.light]: {
      timerThrottle: 0.9,
      httpChaos: {fail: 0.1, delay: 0.1},
      playbackChaos: {seek: 0.05, stall: 0.1}
    },
    [ChaosLevel.medium]: {
      timerThrottle: 0.6,
      httpChaos: {fail: 0.3, delay: 0.3},
      playbackChaos: {seek: 0.15, stall: 0.2}
    },
    [ChaosLevel.extreme]: {
      timerThrottle: 0.4,
      httpChaos: {fail: 0.6, delay: 0.6},
      playbackChaos: {seek: 0.3, stall: 0.4}
    }
  };

  #options: DeepRequired<ChaosOptions> = {
    timerThrottle: 1.0,
    httpChaos: {fail: 0, delay: 0},
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

  get opt(): DeepRequired<ChaosOptions> {
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
      const sanitizedHttpChaos: Partial<HttpChaosOptions> = {};

      if (opt.httpChaos.fail !== undefined) {
        if (opt.httpChaos.fail < 0 || opt.httpChaos.fail > 1) {
          throw new Error('"httpChaos.fail" must be between 0 and 1');
        }

        sanitizedHttpChaos.fail = opt.httpChaos.fail;
      }

      if (opt.httpChaos.delay !== undefined) {
        if (opt.httpChaos.delay < 0 || opt.httpChaos.delay > 1) {
          throw new Error('"httpChaos.delay" must be between 0 and 1');
        }

        sanitizedHttpChaos.delay = opt.httpChaos.delay;
      }

      if (Object.keys(sanitizedHttpChaos).length > 0) {
        sanitizedOpt.httpChaos = sanitizedHttpChaos;
      }
    }

    if (opt.playbackChaos !== undefined) {
      const sanitizedPlaybackChaos: Partial<PlaybackChaosOptions> = {};

      if (opt.playbackChaos.seek !== undefined) {
        if (opt.playbackChaos.seek < 0 || opt.playbackChaos.seek > 1) {
          throw new Error('"playbackChaos.seek" must be between 0 and 1');
        }

        sanitizedPlaybackChaos.seek = opt.playbackChaos.seek;
      }

      if (opt.playbackChaos.stall !== undefined) {
        if (opt.playbackChaos.stall < 0 || opt.playbackChaos.stall > 1) {
          throw new Error('"playbackChaos.stall" must be between 0 and 1');
        }

        sanitizedPlaybackChaos.stall = opt.playbackChaos.stall;
      }

      if (Object.keys(sanitizedPlaybackChaos).length > 0) {
        sanitizedOpt.playbackChaos = sanitizedPlaybackChaos;
      }
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
