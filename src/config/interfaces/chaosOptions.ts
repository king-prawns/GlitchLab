interface ChaosOptions {
  timerThrottle?: number;
  httpChaos?: number;
  playbackHiccups?: number;
  seed?: number | null;
  quiet?: boolean;
}

export default ChaosOptions;
