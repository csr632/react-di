import {
  injectable,
  ELifeCycle,
  LifeCycle,
  useBindLifeCycle,
} from 'react-svs-di';
import { ConnectableObservable, Subject, merge } from 'rxjs';
import {
  scan,
  takeUntil,
  publishReplay,
  mergeMap,
  mapTo,
} from 'rxjs/operators';

import { useAssertValueNotChange, useSyncInit } from 'react-svs-di/utils';
import LogSvs from './LogSvs';

interface ILifeCycleCollectorEvent<CompDesc> {
  compDesc: CompDesc;
  eventType: ELifeCycle;
}

class LifeCycleCollector<CompDesc = string> {
  public _register$ = new Subject<{
    compDesc: CompDesc;
    lifeCycle: LifeCycle;
  }>();

  public event$ = this._register$.pipe(
    mergeMap(({ compDesc, lifeCycle }) => {
      const mount$ = lifeCycle.mount$.pipe(
        mapTo<null, ILifeCycleCollectorEvent<CompDesc>>({
          compDesc,
          eventType: ELifeCycle.mount,
        })
      );
      const unMount$ = lifeCycle.unMount$.pipe(
        mapTo<null, ILifeCycleCollectorEvent<CompDesc>>({
          compDesc,
          eventType: ELifeCycle.unMount,
        })
      );
      return merge(mount$, unMount$);
    })
  );
}

export function useReportLifeCycle<CompDesc>(
  compDesc: CompDesc,
  lifeCycleCollector: LifeCycleCollector<CompDesc>
) {
  useAssertValueNotChange(compDesc);
  useAssertValueNotChange(lifeCycleCollector);

  const lifeCycle = useSyncInit(() => new LifeCycle());

  const setup = useSyncInit(() => () => {
    lifeCycleCollector._register$.next({
      compDesc,
      lifeCycle,
    });
  });

  useBindLifeCycle(lifeCycle, {
    setup,
  });
}

@injectable()
export class ChildrenMonitor {
  public _hostLifeCycle = new LifeCycle();

  public childrenLifeCycleCollector = new LifeCycleCollector<string>();

  public childrenInfo$ = this.childrenLifeCycleCollector.event$.pipe(
    scan(
      (acc, value) => {
        if (value.eventType === ELifeCycle.mount) {
          if (!acc[value.compDesc]) {
            acc[value.compDesc] = 1;
          } else {
            acc[value.compDesc]++;
          }
        }
        if (value.eventType === ELifeCycle.unMount) {
          if (!acc[value.compDesc] || acc[value.compDesc] <= 0) {
            throw new Error(
              `unMount times > mount times. compName: ${value.compDesc}`
            );
          } else {
            acc[value.compDesc]--;
          }
        }
        return { ...acc };
      },
      // eslint-disable-next-line @typescript-eslint/no-object-literal-type-assertion
      {} as {
        [compName: string]: number;
      }
    ),
    takeUntil(this._hostLifeCycle.unMount$),
    // tap(info => {
    //   console.log("info", JSON.stringify(info));
    // }),
    publishReplay(1)
  );

  public constructor(private logSvs: LogSvs) {
    this.logSvs.log('creating ChildrenMonitor');
    (this.childrenInfo$ as ConnectableObservable<any>).connect();
  }
}
