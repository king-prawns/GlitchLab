import ChaosEvent from '../enum/chaosEvent';

import EmeChaosEvent from './emeChaosEvent';
import HttpChaosEvent from './httpChaosEvent';
import MseChaosEvent from './mseChaosEvent';
import PlaybackChaosEvent from './playbackChaosEvent';
import TimerChaosEvent from './timerChaosEvent';

interface ChaosEvents {
  [ChaosEvent.emeChaos]: EmeChaosEvent;
  [ChaosEvent.httpChaos]: HttpChaosEvent;
  [ChaosEvent.mseChaos]: MseChaosEvent;
  [ChaosEvent.playbackChaos]: PlaybackChaosEvent;
  [ChaosEvent.timerChaos]: TimerChaosEvent;
}

export default ChaosEvents;
