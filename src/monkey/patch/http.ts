import Patch from './patch';

class Http extends Patch {
  patch(): void {
    this.console.info('Patching HTTP');
  }

  restore(): void {
    this.console.info('Restoring HTTP');
  }
}

export default Http;
