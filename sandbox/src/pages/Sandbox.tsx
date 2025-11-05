import './Sandbox.css';
import React, {JSX} from 'react';

import {GlitchLab} from '../../../src';
import type {Chaos} from '../../../src';
import Player from '../interfaces/Player';
import DashjsPlayer from '../players/Dashjs';

type IProps = Record<string, never>;
type IState = {
  status: 'Idle' | 'Created' | 'Started' | 'Stopped';
};

class Sandbox extends React.Component<IProps, IState> {
  private chaos: Chaos | null = null;

  private player: Player | null = null;

  constructor(props: IProps) {
    super(props);

    this.state = {
      status: 'Idle'
    };
  }

  render(): JSX.Element {
    return (
      <div className="sandbox">
        <h1>GlitchLab Sandbox</h1>
        {this.state.status === 'Idle' && <button onClick={this.onCreate}>CREATE</button>}
        {this.state.status === 'Created' && <button onClick={this.onStart}>START</button>}
        {this.state.status === 'Started' && <button onClick={this.onStop}>STOP</button>}
        <p>Status: {this.state.status}</p>
        {this.state.status !== 'Idle' && (
          <div className="video-wrapper">
            <video id="video" />
          </div>
        )}
      </div>
    );
  }

  private onCreate = (): void => {
    this.chaos = new GlitchLab();

    this.player = new DashjsPlayer();

    this.setState({status: 'Created'});
  };

  private onStart = (): void => {
    const MANIFEST_URL: string = 'https://dash.akamaized.net/envivio/EnvivioDash3/manifest.mpd';
    const videoElement: HTMLVideoElement = document.getElementById('video') as HTMLVideoElement;

    this.chaos?.enable();

    this.player?.load(videoElement, MANIFEST_URL);

    this.setState({status: 'Started'});
  };

  private onStop = (): void => {
    this.chaos?.disable();

    this.player?.stop();
    this.player = null;

    this.setState({status: 'Idle'});
  };
}

export default Sandbox;
