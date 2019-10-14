import { Subject, Observable } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import * as React from 'react';
import { useAssertValueNotChange, useCompId } from './utils';

/* eslint-disable no-underscore-dangle */

export enum ELifeCycle {
  mount,
  unMount,
}
export type LifeCycleName = 'mount' | 'unMount';

export class LifeCycle {
  private _mount$ = new Subject<null>();

  private _unMount$ = new Subject<null>();

  public mount$ = this._mount$.pipe(take(1));

  public unMount$ = this._unMount$.pipe(take(1));

  // make sure LifeCycle instance and component instance is one-to-one
  private componentId: object | null = null;

  private checkComponent(currentId: object) {
    if (!this.componentId) {
      this.componentId = currentId;
    } else if (this.componentId !== currentId)
      throw new Error(`lifecycle is bound to multiple component instance`);
  }

  // not mounted yet | mounted | unMounted
  private state: 0 | 1 | 2 = 0;

  private mount() {
    if (this.state !== 0)
      throw new Error(`lifecycle error: mounted multiple times`);
    this._mount$.next();
    this.state = 1;
  }

  private unMount() {
    if (this.state !== 1)
      throw new Error(`lifecycle error: mounted multiple times`);
    this._unMount$.next();
    this.state = 2;
  }

  public subscribeInLifeCycle<T>(
    observable: Observable<T>,
    next?: (value: T) => void,
    error?: (error: any) => void,
    complete?: () => void
  ) {
    this.mount$.subscribe(() => {
      observable
        .pipe(takeUntil(this.unMount$))
        .subscribe(next, error, complete);
    });
  }
}

interface ILifeCycleInternal {
  checkComponent(currentId: object): void;
  mount(): void;
  unMount(): void;
}

export function useBindLifeCycle(
  lifeCycle: LifeCycle,
  opts: { setup?: () => void | (() => void) } = {}
) {
  const { setup = null } = opts;

  // make sure useLifeCycle is always called with same lifeCycle object
  useAssertValueNotChange(lifeCycle);
  useAssertValueNotChange(setup);

  const compId = useCompId();

  const lifeCycleInternal = (lifeCycle as unknown) as ILifeCycleInternal;

  React.useEffect(() => {
    lifeCycleInternal.checkComponent(compId);
  });

  React.useLayoutEffect(() => {
    lifeCycleInternal.checkComponent(compId);
    const cleanup = typeof setup === 'function' ? setup() : undefined;
    lifeCycleInternal.mount();
    return () => {
      lifeCycleInternal.unMount();
      if (typeof cleanup === 'function') cleanup();
    };
  }, [compId, lifeCycleInternal, setup]);
}
