type TimerChaosEvent = {
  kind: 'setTimeout' | 'setInterval' | 'requestAnimationFrame';
  type: 'throttle';
  scaled: number;
  requested: number;
};

export default TimerChaosEvent;
