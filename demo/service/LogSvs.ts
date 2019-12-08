import { injectable, IProvider } from 'react-svs-di';

// LogSvs demonstrate
// how can a service hidden by an abstraction

abstract class LogSvs {
  public constructor(private prefix: string) {
    this.log('creating LogSvs');
  }

  public log(msg: string) {
    console.log(this.prefix + msg);
  }
  // can define some abstract methods here
}

// LogSvs is an abstraction (configurable, extendable)
export function configLogSvs(prefix: string): IProvider {
  @injectable()
  class ActualLogSvs extends LogSvs {
    public constructor() {
      super(prefix);
    }
  }
  return { provide: LogSvs, useClass: ActualLogSvs };
}

export default LogSvs;
