import Patch from './patch';

class Eme extends Patch {
  patch(): void {
    if (this.opt.eme.rmksa === 0) return;

    this.console.info('Patching eme');
  }

  restore(): void {
    if (this.opt.eme.rmksa === 0) return;

    this.console.info('Restoring eme');
  }
}

export default Eme;
