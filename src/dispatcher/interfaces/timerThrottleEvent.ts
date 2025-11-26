interface TimerThrottleEvent {
  kind: 'setTimeout' | 'setInterval' | 'requestAnimationFrame';
  scaled: number;
  requested: number;
}

export default TimerThrottleEvent;
