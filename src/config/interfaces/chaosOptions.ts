interface ChaosOptions {
  timerThrottle?: number;
  httpChaos?: number;
  seed?: number | null;
  quiet?: boolean;
}

export default ChaosOptions;
