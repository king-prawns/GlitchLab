import ChaosEvents from './interfaces/ChaosEvents';

class Dispatcher {
  #listeners: Map<keyof ChaosEvents, Set<(evt: ChaosEvents[keyof ChaosEvents]) => void>> = new Map();

  emit<K extends keyof ChaosEvents>(evtName: K, evt: ChaosEvents[K]): void {
    const set: Set<(evt: ChaosEvents[K]) => void> | undefined = this.#listeners.get(evtName);
    if (!set) return;

    set.forEach((cb: (evt: ChaosEvents[K]) => void) => {
      cb(evt);
    });
  }

  on<K extends keyof ChaosEvents>(evtName: K, callback: (evt: ChaosEvents[K]) => void): void {
    const set: Set<(evt: ChaosEvents[K]) => void> = this.#listeners.get(evtName) ?? new Set();
    set.add(callback);

    if (!this.#listeners.has(evtName)) {
      this.#listeners.set(evtName, set);
    }
  }

  off<K extends keyof ChaosEvents>(evtName: K, callback: (evt: ChaosEvents[K]) => void): void {
    const set: Set<(evt: ChaosEvents[K]) => void> | undefined = this.#listeners.get(evtName);
    if (!set) return;

    set.delete(callback);
    if (set.size === 0) {
      this.#listeners.delete(evtName);
    }
  }
}

export default Dispatcher;
