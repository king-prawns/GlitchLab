import ChaosEvent from '@dispatcher/enum/chaosEvent';

import Patch from './patch';

class Playback extends Patch {
  #originalCreateElement: typeof Document.prototype.createElement | null = null;

  #observer: MutationObserver | null = null;

  #wired: Set<HTMLVideoElement> = new Set();
  #onTickMap: Map<HTMLVideoElement, EventListener> = new Map();

  patch(): void {
    if (this.opt.playbackChaos.seek === 0 && this.opt.playbackChaos.stall === 0) return;

    this.console.info('Patching playback');

    this.#patchCreateVideoElement();
    this.#wireAll();

    // Start a short-lived observer only if nothing is wired yet
    if (this.#wired.size === 0) {
      this.#observeDOM();
    }
  }

  restore(): void {
    if (this.opt.playbackChaos.seek === 0 && this.opt.playbackChaos.stall === 0) return;

    this.console.info('Restoring playback');

    this.#restoreCreateVideoElement();
    this.#unwireAll();
  }

  #patchCreateVideoElement(): void {
    if (!this.#originalCreateElement) {
      this.#originalCreateElement = Document.prototype.createElement;
    }

    const original: typeof Document.prototype.createElement = this.#originalCreateElement!;
    const wire: (el: HTMLVideoElement) => void = this.#wire.bind(this);

    Document.prototype.createElement = function (
      this: Document,
      tagName: string,
      options?: ElementCreationOptions
    ): HTMLElement {
      const el: HTMLElement = original.call(this, tagName, options);
      if (String(tagName).toLowerCase() === 'video') {
        wire(el as HTMLVideoElement);
      }

      return el;
    };
  }

  #restoreCreateVideoElement(): void {
    if (this.#originalCreateElement) {
      Document.prototype.createElement = this.#originalCreateElement;
    }
    this.#originalCreateElement = null;
  }

  #observeDOM(): void {
    this.#observer = new MutationObserver((mutations: Array<MutationRecord>) => {
      for (const m of mutations) {
        if (m.addedNodes && m.addedNodes.length) {
          for (const n of Array.from(m.addedNodes)) {
            if (n.nodeType === 1) {
              this.#scanNode(n as Element);
            }
          }
        }
      }

      if (this.#observer && this.#wired.size !== 0) {
        this.#observer.disconnect();
        this.#observer = null;
      }
    });
    this.#observer.observe(document, {childList: true, subtree: true});
  }

  #scanNode(root: Element): void {
    const tag: string | undefined = root.tagName.toLowerCase();
    if (tag === 'video') {
      this.#wire(root as HTMLVideoElement);
    }
  }

  #wireAll(): void {
    const list: NodeListOf<HTMLVideoElement> = document.querySelectorAll('video');
    list.forEach((el: HTMLVideoElement) => this.#wire(el));
  }

  #wire(el: HTMLVideoElement): void {
    if (this.#wired.has(el)) return;
    this.#wired.add(el);

    const onTick: EventListener = () => {
      if (el.ended) {
        this.#unwire(el);

        return;
      }

      const shouldStall: boolean = this.seed.random() < this.opt.playbackChaos.stall;
      if (shouldStall) {
        const waitingEvent: Event = new Event('waiting');
        el.dispatchEvent(waitingEvent);

        this.dispatcher.emit(ChaosEvent.playbackChaos, {
          type: 'waiting',
          currentTime: el.currentTime
        });
      }

      const shouldSeek: boolean = this.seed.random() < this.opt.playbackChaos.seek;
      if (shouldSeek) {
        const direction: number = this.seed.random() < 0.5 ? -1 : 1;
        const magnitude: number = 1 + this.seed.random() * 4; // 1..5 seconds
        const targetTime: number = Math.max(0, el.currentTime + direction * magnitude);
        try {
          this.dispatcher.emit(ChaosEvent.playbackChaos, {type: 'seek', targetTime});

          el.currentTime = targetTime;
        } catch {
          /* ignore */
        }
      }
    };

    el.addEventListener('timeupdate', onTick);

    this.#onTickMap.set(el, onTick);
  }

  #unwire(el: HTMLVideoElement): void {
    const onTick: EventListener | undefined = this.#onTickMap.get(el);
    if (onTick) {
      el.removeEventListener('timeupdate', onTick);
      this.#onTickMap.delete(el);
    }

    this.#wired.delete(el);
  }

  #unwireAll(): void {
    for (const el of this.#wired) {
      this.#unwire(el);
    }
  }
}

export default Playback;
