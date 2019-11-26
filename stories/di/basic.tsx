import React from 'react';
import {
  withDIProvider,
  useDIConsumer,
  useObservable,
  injectable,
} from 'react-rxdi';
import { Subject } from 'rxjs';
import { scan } from 'rxjs/operators';

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
  private readonly addend$ = new Subject<number>();

  // CountSvs don't need to know how to get LogSvs
  // It just 'declare' its dependencies
  public constructor(private logService: LogSvs) {
    this.logService.log('creating CountSvs');
  }

  public readonly sum$ = this.addend$.pipe(
    scan((acc, value) => acc + value, 0)
  );

  public increase() {
    this.logService.log('increasing');
    this.addend$.next(1);
  }
}

export const BasicDemo: React.FC = withDIProvider([CountSvs, LogSvs])(() => {
  const [countService] = useDIConsumer([CountSvs]);
  const sum = useObservable(() => countService.sum$, 0);

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
    return () => {
      logSvs.log('Child un-mounted');
    };
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
