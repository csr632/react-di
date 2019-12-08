import { CustomToken } from 'react-svs-di';
import LogSvs from './LogSvs';

export class CarSvs {
  private logCount = 0;

  constructor(private logSvs: LogSvs) {
    this.logSvs.log(`creating CarSvs`);
  }

  public run() {
    this.logSvs.log(`Car is running. logCount: ${this.logCount}`);
    this.logCount++;
  }
}

export const CarSvsToken = new CustomToken<CarSvs>('@@CarSvs Token@@');
