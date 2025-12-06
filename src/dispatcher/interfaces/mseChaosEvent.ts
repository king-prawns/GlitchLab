type MseChaosEvent = {
  kind: 'SourceBuffer';
  type: 'decode';
  currentTime: number;
};

export default MseChaosEvent;
