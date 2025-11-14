import {Tape} from '@king-prawns/tape';

import type Player from '../interfaces/Player';

class TapePlayer implements Player {
  #player: Tape | null = null;

  constructor(videoElementWrapper: HTMLDivElement) {
    this.#player = new Tape(videoElementWrapper, {
      stream: {
        autoplay: true
      }
      // logger: {
      //   enabled: true,
      //   level: 0
      // }
    });
  }

  public load(manifestUrl: string): void {
    this.#player?.load(manifestUrl);
  }

  public stop(): void {
    this.#player?.destroy();
    this.#player = null;
  }
}

export default TapePlayer;
