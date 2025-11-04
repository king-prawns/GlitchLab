import Chaos from './interfaces/chaos';

class GlitchLab implements Chaos {
  public enable(): void {
    throw new Error('Method not implemented.');
  }
  public disable(): void {
    throw new Error('Method not implemented.');
  }
}

export default GlitchLab;
