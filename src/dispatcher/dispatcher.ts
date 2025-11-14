import ChaosEvents from './interfaces/chaosEvents';

type Callback = (evt: ChaosEvents[keyof ChaosEvents]) => void;

class Dispatcher {
  #listeners: Map<keyof ChaosEvents, Set<Callback>> = new Map();

  emit<K extends keyof ChaosEvents>(evtName: K, evt: ChaosEvents[K]): void {
    const set: Set<Callback> | undefined = this.#listeners.get(evtName);
    if (!set) return;

    set.forEach((cb: Callback) => {
      cb(evt);
    });
  }

  on<K extends keyof ChaosEvents>(evtName: K, callback: (evt: ChaosEvents[K]) => void): void {
    const set: Set<Callback> = this.#listeners.get(evtName) ?? new Set<Callback>();
    set.add(callback as Callback);

    if (!this.#listeners.has(evtName)) {
      this.#listeners.set(evtName, set);
    }
  }

  off<K extends keyof ChaosEvents>(evtName: K, callback: (evt: ChaosEvents[K]) => void): void {
    const set: Set<Callback> | undefined = this.#listeners.get(evtName);
    if (!set) return;

    set.delete(callback as Callback);
    if (set.size === 0) {
      this.#listeners.delete(evtName);
    }
  }
}

export default Dispatcher;
