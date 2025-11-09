class Rng {
  #useNative: boolean;
  #rng: (() => number) | null = null;

  constructor(deterministic: boolean, seed: number = 0xc0ffee) {
    this.#useNative = !deterministic;
    if (deterministic) {
      this.#rng = this.#mulberry32(seed);
    }
  }

  random(): number {
    return this.#useNative ? Math.random() : this.#rng!();
  }

  // https://github.com/cprosche/mulberry32
  #mulberry32(seed: number): () => number {
    let t: number = seed >>> 0;

    return () => {
      t = (t + 0x6d2b79f5) >>> 0;
      let r: number = Math.imul(t ^ (t >>> 15), 1 | t);
      r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);

      return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
    };
  }
}

export default Rng;
