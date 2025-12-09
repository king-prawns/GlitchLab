import EmeChaosOptions from '@config/interfaces/emeChaosOptions';
import Dispatcher from '@dispatcher/dispatcher';
import ChaosEvent from '@dispatcher/enum/chaosEvent';
import Seed from '@seed/seed';

import Patch from './patch';

class Eme extends Patch {
  #originalRequestMediaKeySystemAccess: typeof navigator.requestMediaKeySystemAccess | null = null;

  patch(): void {
    if (this.opt.eme.rmksa === 0) return;

    this.console.info('Patching eme');

    this.#patchRequestMediaKeySystemAccess();
  }

  restore(): void {
    if (this.opt.eme.rmksa === 0) return;

    this.console.info('Restoring eme');

    this.#restoreRequestMediaKeySystemAccess();
  }

  #patchRequestMediaKeySystemAccess(): void {
    if (!this.#originalRequestMediaKeySystemAccess) {
      this.#originalRequestMediaKeySystemAccess = navigator.requestMediaKeySystemAccess;
    }

    const original: typeof navigator.requestMediaKeySystemAccess = this.#originalRequestMediaKeySystemAccess;

    const dispatcher: Dispatcher = this.dispatcher;
    const emeChaos: Required<EmeChaosOptions> = this.opt.eme;
    const seed: Seed = this.seed;

    const patched: typeof original = function (
      this: Navigator,
      keySystem: string,
      supportedConfigurations: Array<MediaKeySystemConfiguration>
    ): Promise<MediaKeySystemAccess> {
      const shouldFail: boolean = seed.random() < emeChaos.rmksa;

      if (shouldFail) {
        dispatcher.emit(ChaosEvent.emeChaos, {
          type: 'rmksa',
          keySystem,
          supportedConfigurations
        });

        return Promise.reject(new Error('GlitchLab: requestMediaKeySystemAccess failed'));
      }

      return original.call(this, keySystem, supportedConfigurations);
    };

    navigator.requestMediaKeySystemAccess = patched;
  }

  #restoreRequestMediaKeySystemAccess(): void {
    if (this.#originalRequestMediaKeySystemAccess) {
      navigator.requestMediaKeySystemAccess = this.#originalRequestMediaKeySystemAccess;
    }

    this.#originalRequestMediaKeySystemAccess = null;
  }
}

export default Eme;
