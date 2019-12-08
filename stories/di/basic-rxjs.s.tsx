import React from 'react';
import {
  withDIContainer,
  useDIConsumer,
  useObservable,
  injectable,
} from 'react-rxdi';
import { Subject } from 'rxjs';
import { scan } from 'rxjs/operators';

@injectable()
class CountSvs {
  private readonly addend$ = new Subject<number | 'reset'>();
  public readonly sum$ = this.addend$.pipe(
    scan((acc, value) => {
      if (value === 'reset') return 0;
      return acc + value;
    }, 0)
  );
  public inc() {
    this.addend$.next(1);
  }
  public dec() {
    this.addend$.next(-1);
  }
  public reset() {
    this.addend$.next('reset');
  }
}

export const Demo: React.FC = withDIContainer([CountSvs])(() => {
  const [countService] = useDIConsumer([CountSvs]);
  // auto re-render when the observable emit
  const sum = useObservable(countService.sum$, 0);
  return (
    <div>
      <h1>Basic Demo - rxjs version</h1>
      <p>sum: {sum}</p>
      <button
        onClick={() => {
          countService.inc();
        }}
      >
        increase
      </button>
      <button
        onClick={() => {
          countService.dec();
        }}
      >
        decrease
      </button>
      <button
        onClick={() => {
          countService.reset();
        }}
      >
        reset
      </button>
    </div>
  );
});

export default {
  title: 'basic:rxjs version',
};
