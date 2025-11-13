import {MediaPlayer, MediaPlayerClass} from 'dashjs';

import Player from '../interfaces/Player';

class DashjsPlayer implements Player {
  #player: MediaPlayerClass | null = null;

  #videoElement: HTMLVideoElement;

  constructor(videoElementWrapper: HTMLDivElement) {
    this.#player = MediaPlayer().create();
    this.#videoElement = document.createElement('video');
    videoElementWrapper.appendChild(this.#videoElement);
  }

  public load(manifestUrl: string): void {
    this.#player?.initialize(this.#videoElement, manifestUrl, true);
  }

  public stop(): void {
    this.#player?.reset();
    this.#player = null;
  }
}

export default DashjsPlayer;
