import ChaosEvent from '../enum/chaosEvent';

import HttpChaosEvent from './httpChaosEvent';
import MseChaosEvent from './mseChaosEvent';
import PlaybackChaosEvent from './playbackChaosEvent';
import TimerChaosEvent from './timerChaosEvent';

interface ChaosEvents {
  [ChaosEvent.timerChaos]: TimerChaosEvent;
  [ChaosEvent.httpChaos]: HttpChaosEvent;
  [ChaosEvent.playbackChaos]: PlaybackChaosEvent;
  [ChaosEvent.mseChaos]: MseChaosEvent;
}

export default ChaosEvents;
