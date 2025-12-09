type MseChaosEvent = {
  kind: 'SourceBuffer';
  type: 'append';
  data: BufferSource;
};

export default MseChaosEvent;
