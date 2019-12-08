/**
 * react-rxdi provide great interoperability with react hooks.
 *
 * Inside services, you can define hooks for consumers ,
 * to achieve better code cohesion and encapsulation.
 *
 * In those hooks, you can use those awesome hook libraries.
 * (benefit from the react community)
 * For example, swr: https://github.com/zeit/swr
 * (They don't provide rxjs version)
 */

import React from 'react';
import {
  injectable,
  WithAutoLifeCycle,
  LifeCycle,
  withDIContainer,
  useObservable,
  useDIConsumer,
} from 'react-rxdi';
import { Subject, merge } from 'rxjs';
import useSWR from 'swr';
import { scan, mapTo } from 'rxjs/operators';

async function mockAPI(id: string) {
  return new Promise<string>(res => {
    setTimeout(() => {
      res(`response for id: ${id}`);
    }, 300);
  });
}

@injectable()
class DataSvs implements WithAutoLifeCycle {
  autoLifeCycle = new LifeCycle();

  private inc$ = new Subject<null>();
  private dec$ = new Subject<null>();

  private sum$ = merge(
    this.inc$.pipe(mapTo(1)),
    this.dec$.pipe(mapTo(-1))
  ).pipe(scan((acc, v) => acc + v, 0));

  useDataSvsHooks1() {
    const dataId = useObservable(this.sum$, 0);
    const { data, isValidating } = useSWR(dataId.toString(), mockAPI);
    return { data, isValidating };
  }
  inc() {
    this.inc$.next();
  }
  dec() {
    this.dec$.next();
  }
}

export const Demo: React.FC = withDIContainer([DataSvs])(() => {
  const [dataSvs] = useDIConsumer([DataSvs]);
  const { data } = dataSvs.useDataSvsHooks1();

  return (
    <div>
      <h1>ConsumerHook Demo</h1>
      <p>{data ? data : 'loading'}</p>
      <button
        onClick={() => {
          dataSvs.inc();
        }}
      >
        increase data id
      </button>
      <button
        onClick={() => {
          dataSvs.dec();
        }}
      >
        decrease data id
      </button>
    </div>
  );
});

export default {
  title: 'plugin-hook/consumer-hook',
};
