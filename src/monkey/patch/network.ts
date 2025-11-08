import Patch from './patch';

class Network extends Patch {
  patch(): void {
    if (this.opt.httpChaos === 0) return;

    this.console.info('Patching network');
  }

  restore(): void {
    if (this.opt.httpChaos === 0) return;

    this.console.info('Restoring network');
  }
}

export default Network;
