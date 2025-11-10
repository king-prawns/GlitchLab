import type ChaosOptions from '@config/interfaces/chaosOptions';
import type Console from '@logger/interfaces/console';
import Seed from '@seed/seed';

abstract class Patch {
  constructor(
    protected seed: Seed,
    protected opt: Required<ChaosOptions>,
    protected console: Console
  ) {}

  abstract patch(): void;
  abstract restore(): void;
}

export default Patch;
