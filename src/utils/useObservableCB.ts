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
  }, [complete, error, next, observable]);
}
