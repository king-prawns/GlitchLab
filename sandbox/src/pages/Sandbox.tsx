import './Sandbox.css';
import React, {JSX} from 'react';

import {ChaosEvent, GlitchLab, HttpChaosEvent, TimerThrottleEvent} from '../../../src';
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

  #onCreate = (): void => {
    // eslint-disable-next-line no-console
    console.clear();

    this.#glitchLab = new GlitchLab({
      playbackChaos: 0.2
    });

    this.#glitchLab.on(ChaosEvent.httpChaos, (evt: HttpChaosEvent) => {
      const {url} = evt;
      // eslint-disable-next-line no-console
      console.log(ChaosEvent.httpChaos, {url});
    });

    this.#glitchLab.on(ChaosEvent.timerThrottle, (evt: TimerThrottleEvent) => {
      const {type, scaled, requested} = evt;
      // eslint-disable-next-line no-console
      console.log(ChaosEvent.timerThrottle, {type, scaled, requested});
    });

    const videoElementWrapper: HTMLDivElement = document.getElementById('video-wrapper') as HTMLDivElement;
    this.#player = new Player(videoElementWrapper);

    this.setState({status: 'Created', libVersion: this.#glitchLab.version});
  };

  #onStart = (): void => {
    this.#glitchLab?.enable();

    const MANIFEST_URL: string = 'https://dash.akamaized.net/envivio/EnvivioDash3/manifest.mpd';
    this.#player?.load(MANIFEST_URL);

    this.setState({status: 'Started'});
  };

  #onStop = (): void => {
    this.#glitchLab?.disable();

    this.#player?.stop();
    this.#player = null;

    this.setState({status: 'Idle'});
  };
}

export default Sandbox;
