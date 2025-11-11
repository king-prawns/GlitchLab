import {Tape} from '@king-prawns/tape';

import Player from '../interfaces/Player';

class DashjsPlayer implements Player {
  private player: Tape | null = null;

  constructor(videoElementWrapper: HTMLDivElement) {
    this.player = new Tape(videoElementWrapper, {
      stream: {
        autoplay: true
      }
    });
  }

  public load(manifestUrl: string): void {
    this.player?.load(manifestUrl);
  }

  public stop(): void {
    this.player?.destroy();
    this.player = null;
  }
}

export default DashjsPlayer;
