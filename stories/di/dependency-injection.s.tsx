import React from 'react';
import {
  withDIContainer,
  useDIConsumer,
  injectable,
  SharedState,
} from 'react-svs-di';

@injectable()
class LogSvs {
  public constructor() {
    this.log('creating LogSvs');
  }

  public log(msg: string) {
    console.log('LogSvs:', msg);
  }
}

@injectable()
class CountSvs {
  // CountSvs don't need to know how to get LogSvs
  // It just 'declare' its dependencies.
  // and react-svs-di injector will handle it!
  public constructor(private logService: LogSvs) {
    this.logService.log('creating CountSvs');
  }

  private sum = new SharedState(0);

  useCountNumber() {
    const value = this.sum.useValue();
    return value;
  }
  public increase() {
    this.logService.log('increasing');
    this.sum.setValueWithFn(prev => prev + 1);
  }
}

export const Demo: React.FC = withDIContainer([CountSvs, LogSvs])(() => {
  const [countService] = useDIConsumer([CountSvs]);
  // auto re-render when the observable emit
  const sum = countService.useCountNumber();

  return (
    <div>
      <p>sum: {sum}</p>
      <Child />
    </div>
  );
});

const Child: React.FC = () => {
  const [countService, logSvs] = useDIConsumer([CountSvs, LogSvs]);
  React.useEffect(() => {
    logSvs.log('Child mounted');
  }, [logSvs]);
  return (
    <div>
      <button
        type="button"
        onClick={() => {
          countService.increase();
        }}
      >
        increase
      </button>
    </div>
  );
};

export default {
  title: 'dependency-injection',
};
