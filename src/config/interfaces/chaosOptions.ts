import HttpChaosOptions from './httpChaosOptions';
import MseChaosOptions from './mseChaosOptions';
import PlaybackChaosOptions from './playbackChaosOptions';
import TimerChaosOptions from './timerChaosOptions';

interface ChaosOptions {
  http?: HttpChaosOptions;
  mse?: MseChaosOptions;
  playback?: PlaybackChaosOptions;
  timer?: TimerChaosOptions;
  seed?: number | null;
  quiet?: boolean;
}

export default ChaosOptions;
