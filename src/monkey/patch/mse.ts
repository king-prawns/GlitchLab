import MseChaosOptions from '@config/interfaces/mseChaosOptions';
import Dispatcher from '@dispatcher/dispatcher';
import ChaosEvent from '@dispatcher/enum/chaosEvent';
import Seed from '@seed/seed';

import Patch from './patch';

class Mse extends Patch {
  #originalMediaSourceAddSourceBuffer: ((this: MediaSource, type: string) => SourceBuffer) | null = null;

  patch(): void {
    if (this.opt.mse.decode === 0) return;

    this.console.info('Patching mse');

    this.#patchMediaSourceAddSourceBuffer();
  }

  restore(): void {
    if (this.opt.mse.decode === 0) return;

    this.console.info('Restoring mse');

    this.#restoreMediaSourceAddSourceBuffer();
  }

  #patchMediaSourceAddSourceBuffer(): void {
    const dispatcher: Dispatcher = this.dispatcher;
    const mseChaos: Required<MseChaosOptions> = this.opt.mse;
    const seed: Seed = this.seed;

    if (!this.#originalMediaSourceAddSourceBuffer) {
      this.#originalMediaSourceAddSourceBuffer = window.MediaSource.prototype.addSourceBuffer;

      const originalAddSourceBuffer: (this: MediaSource, type: string) => SourceBuffer =
        this.#originalMediaSourceAddSourceBuffer;

      const patchedAddSourceBuffer: (this: MediaSource, type: string) => SourceBuffer = function (
        this: MediaSource,
        type: string
      ): SourceBuffer {
        const sb: SourceBuffer = originalAddSourceBuffer.call(this, type);

        const originalAppendBuffer: (data: BufferSource) => void = sb.appendBuffer;

        sb.appendBuffer = function (data: BufferSource): void {
          if (seed.random() < mseChaos.decode) {
            const corruptBytes = (buffer: ArrayBuffer, byteOffset: number = 0, byteLength?: number): void => {
              const view: Uint8Array = new Uint8Array(
                buffer,
                byteOffset,
                byteLength ?? buffer.byteLength - byteOffset
              );

              if (view.length === 0) return;

              // flip a small percentage of bytes so that the segment is likely invalid
              const corruptCount: number = Math.max(1, Math.floor(view.length * 0.01));
              for (let i: number = 0; i < corruptCount; i += 1) {
                const idx: number = Math.floor(seed.random() * view.length);
                view[idx] = view[idx] ^ 0xff;
              }
            };

            if (data instanceof ArrayBuffer) {
              corruptBytes(data);
            } else if (ArrayBuffer.isView(data)) {
              corruptBytes(data.buffer, data.byteOffset, data.byteLength);
            }

            dispatcher.emit(ChaosEvent.mseChaos, {
              kind: 'SourceBuffer',
              type: 'decode',
              data
            });
          }

          originalAppendBuffer.call(this, data);
        };

        return sb;
      };

      window.MediaSource.prototype.addSourceBuffer = patchedAddSourceBuffer;
    }
  }

  #restoreMediaSourceAddSourceBuffer(): void {
    if (this.#originalMediaSourceAddSourceBuffer) {
      window.MediaSource.prototype.addSourceBuffer = this.#originalMediaSourceAddSourceBuffer;
    }

    this.#originalMediaSourceAddSourceBuffer = null;
  }
}

export default Mse;
