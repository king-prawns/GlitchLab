interface Player {
  load(videoElement: HTMLVideoElement, manifestUrl: string): void;
  stop(): void;
}

export default Player;
