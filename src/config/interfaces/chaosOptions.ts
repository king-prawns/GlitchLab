import PlaybackChaosOptions from './PlaybackChaosOptions';

interface ChaosOptions {
  timerThrottle?: number;
  httpChaos?: number;
  playbackChaos?: PlaybackChaosOptions;
  seed?: number | null;
  quiet?: boolean;
}

export default ChaosOptions;
