import HttpChaosOptions from './httpChaosOptions';
import PlaybackChaosOptions from './playbackChaosOptions';

interface ChaosOptions {
  timerThrottle?: number;
  httpChaos?: HttpChaosOptions;
  playbackChaos?: PlaybackChaosOptions;
  seed?: number | null;
  quiet?: boolean;
}

export default ChaosOptions;
