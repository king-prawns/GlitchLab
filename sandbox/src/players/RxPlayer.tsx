import Rx from 'rx-player';

import type Player from '../interfaces/Player';

class RxPlayer implements Player {
  #player: Rx | null = null;

  #videoElement: HTMLVideoElement;

  constructor(videoElementWrapper: HTMLDivElement) {
    this.#videoElement = document.createElement('video');
    this.#player = new Rx({videoElement: this.#videoElement});
    videoElementWrapper.appendChild(this.#videoElement);
  }

  public load(manifestUrl: string): void {
    this.#player?.loadVideo({
      url: manifestUrl,
      transport: 'dash',
      autoPlay: true
    });
  }

  public stop(): void {
    this.#player?.stop();
    this.#player = null;
  }
}

export default RxPlayer;
