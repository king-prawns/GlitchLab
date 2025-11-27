type PlaybackChaosEvent = {
  kind: 'HTMLVideoElement';
} & (
  | {
      type: 'seek';
      targetTime: number;
    }
  | {
      type: 'waiting';
      currentTime: number;
    }
);

export default PlaybackChaosEvent;
