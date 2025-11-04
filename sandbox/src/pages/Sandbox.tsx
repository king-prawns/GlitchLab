import './Sandbox.css';
import React, {JSX} from 'react';

import {GlitchLab} from '../../../src';
import type {Chaos} from '../../../src';

type IProps = Record<string, never>;
type IState = {
  status: string;
};

class Sandbox extends React.Component<IProps, IState> {
  private chaos: Chaos;

  constructor(props: IProps) {
    super(props);

    this.chaos = new GlitchLab();

    this.state = {
      status: 'Idle'
    };
  }

  render(): JSX.Element {
    return (
      <div className="sandbox">
        <h1>Sandbox</h1>
        <button disabled={this.state.status === 'Running'} onClick={this.onEnable}>
          ENABLE
        </button>
        <button disabled={this.state.status === 'Idle'} onClick={this.onDisable}>
          DISABLE
        </button>
        <p>Status: {this.state.status}</p>
      </div>
    );
  }

  private onEnable = (): void => {
    this.chaos.enable();

    // TODO: run video player

    this.setState({status: 'Running'});
  };

  private onDisable = (): void => {
    this.chaos.disable();

    // TODO: destroy video player

    this.setState({status: 'Idle'});
  };
}

export default Sandbox;
