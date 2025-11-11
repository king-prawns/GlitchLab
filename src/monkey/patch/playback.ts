import Patch from './patch';

class Playback extends Patch {
  // #originalXYZ: any | null = null;

  patch(): void {
    if (this.opt.playbackHiccups === 0) return;

    this.console.info('Patching playback');

    this.#patchXYZ();
  }

  restore(): void {
    if (this.opt.playbackHiccups === 0) return;

    this.console.info('Restoring playback');

    this.#restoreXYZ();
  }

  #patchXYZ(): void {
    // TODO: implement
  }

  #restoreXYZ(): void {
    // TODO: implement
  }
}

export default Playback;
