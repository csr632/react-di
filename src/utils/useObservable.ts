import { Observable } from 'rxjs';
import { useEffect, useState, useCallback, useReducer } from 'react';
import { useAssertValueNotChange } from './usePrevious';

export function useObservableCB<ValueType>(
  observable: Observable<ValueType>,
  next?: (value: ValueType) => void,
  error?: (error: any) => void,
  complete?: () => void
) {
  // useAssertValueNotChange(observable);

  useEffect(() => {
    const sub = observable.subscribe(next, error, complete);
    return () => sub.unsubscribe();
  }, [complete, error, next, observable]);
}

export function useObservable<ValueType>(
  observable: Observable<ValueType>
): ValueType | undefined;
export function useObservable<ValueType>(
  observable: Observable<ValueType>,
  initialValue: ValueType
): ValueType;
export function useObservable<ValueType>(
  observable: Observable<ValueType>,
  initialValue?: ValueType
) {
  const [, forceUpdate] = useReducer((x, _: null) => x + 1, 0);

  const [state, setState] = useState(initialValue);
  const onNext = useCallback((nextVal: ValueType) => {
    setState(nextVal);
    // force update when observable emit to avoid this issue
    // https://github.com/LeetCode-OpenSource/rxjs-hooks/issues/91
    forceUpdate(null);
  }, []);
  useObservableCB(observable, onNext);
  return state;
}
