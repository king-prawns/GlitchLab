import shaka from 'shaka-player';

import type Player from '../interfaces/Player';

class ShakaPlayer implements Player {
  #player: shaka.Player | null = null;

  #videoElement: HTMLVideoElement;

  constructor(videoElementWrapper: HTMLDivElement) {
    this.#player = new shaka.Player();
    this.#videoElement = document.createElement('video');
    this.#videoElement.autoplay = true;
    videoElementWrapper.appendChild(this.#videoElement);
  }

  public load(manifestUrl: string): void {
    this.#player?.attach(this.#videoElement).then(() => {
      this.#player?.load(manifestUrl);
    });
  }

  public stop(): void {
    this.#player?.destroy();
    this.#player = null;
  }
}

export default ShakaPlayer;
