import { inject, injectable, CustomToken } from 'react-rxdi';
import LogSvs from './LogSvs';

export const injectNumberToken = new CustomToken<number>('injectNumberToken');

@injectable()
export class InjectDemoSvs {
  @inject(injectNumberToken)
  private injectNumber = -1;

  constructor(@inject(LogSvs) private logSvs: any) {
    this.logSvs.log(`creating InjectDemoSvs`);
  }

  public show() {
    this.logSvs.log(`injectNumber: ${this.injectNumber}`);
  }
}
