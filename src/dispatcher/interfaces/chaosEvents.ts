import ChaosEvent from '../enum/chaosEvent';

import HttpChaosEvent from './httpChaosEvent';
import PlaybackChaosEvent from './playbackChaosEvent';
import TimerThrottleEvent from './timerThrottleEvent';

interface ChaosEvents {
  [ChaosEvent.timerThrottle]: TimerThrottleEvent;
  [ChaosEvent.httpChaos]: HttpChaosEvent;
  [ChaosEvent.playbackChaos]: PlaybackChaosEvent;
}

export default ChaosEvents;
