interface TimerThrottleEvent {
  type: 'setTimeout' | 'setInterval' | 'requestAnimationFrame';
  scaled: number;
  requested: number;
}

export default TimerThrottleEvent;
