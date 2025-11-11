interface Player {
  load(manifestUrl: string): void;
  stop(): void;
}

export default Player;
