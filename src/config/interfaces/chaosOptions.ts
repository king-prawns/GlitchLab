import HttpChaosOptions from './httpChaosOptions';
import PlaybackChaosOptions from './playbackChaosOptions';
import TimerChaosOptions from './timerChaosOptions';

interface ChaosOptions {
  timer?: TimerChaosOptions;
  http?: HttpChaosOptions;
  playback?: PlaybackChaosOptions;
  seed?: number | null;
  quiet?: boolean;
}

export default ChaosOptions;
