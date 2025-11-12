interface ChaosOptions {
  timerThrottle?: number;
  httpChaos?: number;
  playbackChaos?: number;
  seed?: number | null;
  quiet?: boolean;
}

export default ChaosOptions;
