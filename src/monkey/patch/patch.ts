import type ChaosOptions from '@config/interfaces/chaosOptions';
import Dispatcher from '@dispatcher/dispatcher';
import type Console from '@logger/interfaces/console';
import Seed from '@seed/seed';

abstract class Patch {
  protected seed: Seed;

  constructor(
    protected opt: Required<ChaosOptions>,
    protected dispatcher: Dispatcher,
    protected console: Console
  ) {
    this.seed = new Seed(opt.seed);
  }

  abstract patch(): void;
  abstract restore(): void;
}

export default Patch;
