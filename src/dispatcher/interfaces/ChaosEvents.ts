import ChaosEvent from '../enum/ChaosEvent';

import HttpChaosEvent from './HttpChaosEvent';

interface ChaosEvents {
  [ChaosEvent.httpChaos]: HttpChaosEvent;
}

export default ChaosEvents;
