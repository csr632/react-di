import { Observable } from 'rxjs';
import { useEffect } from 'react';
import { useAssertValueNotChange } from './usePrevious';

export function useObservableCB<T>(
  observable: Observable<T>,
  next?: (value: T) => void,
  error?: (error: any) => void,
  complete?: () => void
) {
  useAssertValueNotChange(observable);

  useEffect(() => {
    const sub = observable.subscribe(next, error, complete);
    return () => sub.unsubscribe();
    // next如果通过匿名函数传入，那么值会经常变化，这时候不应该重新执行subscribe
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [observable]);
}
