import ChaosLevel from './enum/chaosLevel';
import ChaosOptions from './interfaces/chaosOptions';
import HttpChaosOptions from './interfaces/httpChaosOptions';
import PlaybackChaosOptions from './interfaces/playbackChaosOptions';
import TimerChaosOptions from './interfaces/timerChaosOptions';

class Config {
  #chaosPresets: Record<ChaosLevel, ChaosOptions> = {
    [ChaosLevel.light]: {
      timer: {throttle: 0.9},
      http: {fail: 0.1, delay: 0.1},
      playback: {seek: 0.05, stall: 0.1}
    },
    [ChaosLevel.medium]: {
      timer: {throttle: 0.6},
      http: {fail: 0.3, delay: 0.3},
      playback: {seek: 0.15, stall: 0.2}
    },
    [ChaosLevel.extreme]: {
      timer: {throttle: 0.4},
      http: {fail: 0.6, delay: 0.6},
      playback: {seek: 0.3, stall: 0.4}
    }
  };

  #options: DeepRequired<ChaosOptions> = {
    timer: {throttle: 1.0},
    http: {fail: 0, delay: 0},
    playback: {seek: 0, stall: 0},
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

    if (opt.timer !== undefined) {
      const sanitizedTimerChaos: Partial<TimerChaosOptions> = {};

      if (opt.timer.throttle !== undefined) {
        if (opt.timer.throttle <= 0 || opt.timer.throttle > 1) {
          throw new Error('"timer.throttle" must be greater than 0 and less than or equal to 1');
        }

        sanitizedTimerChaos.throttle = opt.timer.throttle;
      }

      if (Object.keys(sanitizedTimerChaos).length > 0) {
        sanitizedOpt.timer = sanitizedTimerChaos;
      }
    }

    if (opt.http !== undefined) {
      const sanitizedHttpChaos: Partial<HttpChaosOptions> = {};

      if (opt.http.fail !== undefined) {
        if (opt.http.fail < 0 || opt.http.fail > 1) {
          throw new Error('"httpChaos.fail" must be between 0 and 1');
        }

        sanitizedHttpChaos.fail = opt.http.fail;
      }

      if (opt.http.delay !== undefined) {
        if (opt.http.delay < 0 || opt.http.delay > 1) {
          throw new Error('"httpChaos.delay" must be between 0 and 1');
        }

        sanitizedHttpChaos.delay = opt.http.delay;
      }

      if (Object.keys(sanitizedHttpChaos).length > 0) {
        sanitizedOpt.http = sanitizedHttpChaos;
      }
    }

    if (opt.playback !== undefined) {
      const sanitizedPlaybackChaos: Partial<PlaybackChaosOptions> = {};

      if (opt.playback.seek !== undefined) {
        if (opt.playback.seek < 0 || opt.playback.seek > 1) {
          throw new Error('"playbackChaos.seek" must be between 0 and 1');
        }

        sanitizedPlaybackChaos.seek = opt.playback.seek;
      }

      if (opt.playback.stall !== undefined) {
        if (opt.playback.stall < 0 || opt.playback.stall > 1) {
          throw new Error('"playbackChaos.stall" must be between 0 and 1');
        }

        sanitizedPlaybackChaos.stall = opt.playback.stall;
      }

      if (Object.keys(sanitizedPlaybackChaos).length > 0) {
        sanitizedOpt.playback = sanitizedPlaybackChaos;
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
