type MseChaosEvent = {
  kind: 'SourceBuffer';
  type: 'decode';
  data: BufferSource;
};

export default MseChaosEvent;
