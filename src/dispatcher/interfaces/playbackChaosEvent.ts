interface PlaybackChaosEvent {
  kind: 'HTMLVideoElement';
  type: 'seek' | 'waiting';
  currentTime: number;
}

export default PlaybackChaosEvent;
