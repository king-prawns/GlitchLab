class Seed {
  #rng: (() => number) | null = null;

  constructor(seed: number | null) {
    if (seed !== null) {
      this.#rng = this.#mulberry32(seed);
    }
  }

  random(): number {
    return this.#rng ? this.#rng() : Math.random();
  }

  // https://github.com/cprosche/mulberry32
  #mulberry32(seed: number): () => number {
    let t: number = seed >>> 0;

    return (): number => {
      t = (t + 0x6d2b79f5) >>> 0;
      let r: number = Math.imul(t ^ (t >>> 15), 1 | t);
      r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);

      return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
    };
  }
}

export default Seed;
