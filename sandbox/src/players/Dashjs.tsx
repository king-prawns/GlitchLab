import {MediaPlayer, MediaPlayerClass} from 'dashjs';

import Player from '../interfaces/Player';

class DashjsPlayer implements Player {
  private player: MediaPlayerClass;

  constructor() {
    this.player = MediaPlayer().create();
  }

  public load(videoElement: HTMLVideoElement, manifestUrl: string): void {
    this.player.initialize(videoElement, manifestUrl, true);
  }

  public stop(): void {
    this.player.reset();
  }
}

export default DashjsPlayer;
