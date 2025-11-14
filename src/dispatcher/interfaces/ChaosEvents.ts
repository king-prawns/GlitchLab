import ChaosEvent from '../enum/ChaosEvent';

import HttpChaosEvent from './HttpChaosEvent';
import TimerThrottleEvent from './TimerThrottleEvent';

interface ChaosEvents {
  [ChaosEvent.timerThrottle]: TimerThrottleEvent;
  [ChaosEvent.httpChaos]: HttpChaosEvent;
}

export default ChaosEvents;
