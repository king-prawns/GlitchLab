import './Sandbox.css';
import React, {JSX} from 'react';

import {
  ChaosEvent,
  ChaosLevel,
  ChaosOptions,
  GlitchLab,
  HttpChaosEvent,
  MseChaosEvent,
  PlaybackChaosEvent,
  TimerChaosEvent
} from '../../../src';
import type IPlayer from '../interfaces/Player';
import Player from '../players/Tape';
// import Player from '../players/Shaka';
// import Player from '../players/Dashjs';
// import Player from '../players/RxPlayer';
// import Player from '../players/Videojs';

type IProps = Record<string, never>;
type IState = {
  status: 'Idle' | 'Created' | 'Started' | 'Stopped';
  libVersion: string;
};

class Sandbox extends React.Component<IProps, IState> {
  #glitchLab: GlitchLab | null = null;

  #glitchLabOptions: ChaosOptions | ChaosLevel = {};

  #player: IPlayer | null = null;

  constructor(props: IProps) {
    super(props);

    this.state = {
      status: 'Idle',
      libVersion: ''
    };
  }

  componentDidMount(): void {
    this.#onCreate();
  }

  render(): JSX.Element {
    return (
      <div className="sandbox">
        <h1>GlitchLab v{this.state.libVersion}</h1>
        {this.state.status === 'Idle' && <button onClick={this.#onCreate}>CREATE</button>}
        {this.state.status === 'Created' && <button onClick={this.#onStart}>START</button>}
        {this.state.status === 'Started' && <button onClick={this.#onStop}>STOP</button>}
        <p>Status: {this.state.status}</p>
        <div id="video-wrapper"></div>
      </div>
    );
  }

  #onHttpChaos = (evt: HttpChaosEvent): void => {
    const {kind, type, url} = evt;
    if (type === 'fail') {
      // eslint-disable-next-line no-console
      console.log(ChaosEvent.httpChaos, {kind, type, url});
    } else if (type === 'delay') {
      const {delayMs} = evt;

      // eslint-disable-next-line no-console
      console.log(ChaosEvent.httpChaos, {kind, type, url, delayMs});
    }
  };

  #onMseChaos = (evt: MseChaosEvent): void => {
    const {kind, type, currentTime} = evt;
    // eslint-disable-next-line no-console
    console.log(ChaosEvent.mseChaos, {kind, type, currentTime});
  };

  #onPlaybackChaos = (evt: PlaybackChaosEvent): void => {
    const {kind, type} = evt;
    if (type === 'seek') {
      const {targetTime} = evt;

      // eslint-disable-next-line no-console
      console.log(ChaosEvent.playbackChaos, {kind, type, targetTime});
    } else if (type === 'waiting') {
      const {currentTime} = evt;

      // eslint-disable-next-line no-console
      console.log(ChaosEvent.playbackChaos, {kind, type, currentTime});
    }
  };

  #onTimerChaos = (evt: TimerChaosEvent): void => {
    const {kind, type, scaled, requested} = evt;
    // eslint-disable-next-line no-console
    console.log(ChaosEvent.timerChaos, {kind, type, scaled, requested});
  };

  #onCreate = (): void => {
    // eslint-disable-next-line no-console
    console.clear();

    this.#glitchLab = new GlitchLab(this.#glitchLabOptions);

    const videoElementWrapper: HTMLDivElement = document.getElementById('video-wrapper') as HTMLDivElement;
    this.#player = new Player(videoElementWrapper);

    this.setState({status: 'Created', libVersion: this.#glitchLab.version});
  };

  #onStart = (): void => {
    this.#glitchLab?.enable();

    this.#glitchLab?.on(ChaosEvent.httpChaos, this.#onHttpChaos);
    this.#glitchLab?.on(ChaosEvent.mseChaos, this.#onMseChaos);
    this.#glitchLab?.on(ChaosEvent.playbackChaos, this.#onPlaybackChaos);
    this.#glitchLab?.on(ChaosEvent.timerChaos, this.#onTimerChaos);

    const MANIFEST_URL: string = 'https://dash.akamaized.net/envivio/EnvivioDash3/manifest.mpd';
    this.#player?.load(MANIFEST_URL);

    this.setState({status: 'Started'});
  };

  #onStop = (): void => {
    this.#glitchLab?.disable();

    this.#glitchLab?.off(ChaosEvent.httpChaos, this.#onHttpChaos);
    this.#glitchLab?.off(ChaosEvent.mseChaos, this.#onMseChaos);
    this.#glitchLab?.off(ChaosEvent.playbackChaos, this.#onPlaybackChaos);
    this.#glitchLab?.off(ChaosEvent.timerChaos, this.#onTimerChaos);

    this.#player?.stop();
    this.#player = null;

    this.setState({status: 'Idle'});
  };
}

export default Sandbox;
