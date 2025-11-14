import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import 'videojs-contrib-dash';

import type Player from '../interfaces/Player';

class VideojsPlayer implements Player {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  #player: any | null = null;

  #videoElement: HTMLVideoElement;

  constructor(videoElementWrapper: HTMLDivElement) {
    this.#videoElement = document.createElement('video');
    videoElementWrapper.appendChild(this.#videoElement);
  }

  public load(manifestUrl: string): void {
    this.#player = videojs(this.#videoElement, {
      autoplay: true,
      controls: false,
      sources: [
        {
          src: manifestUrl,
          type: 'application/dash+xml'
        }
      ]
    });
  }

  public stop(): void {
    this.#player?.dispose();
    this.#player = null;
  }
}

export default VideojsPlayer;
