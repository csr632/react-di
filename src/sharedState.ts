import { Observable, BehaviorSubject } from 'rxjs';
import { useObservable } from './utils';
import { tap } from 'rxjs/operators';

export class SharedState<ValueType> {
  private _value$: BehaviorSubject<ValueType>;
  private _value: ValueType;
  public value$: Observable<ValueType>;

  constructor(private initialValue: ValueType) {
    this._value$ = new BehaviorSubject(initialValue);
    this._value = initialValue;
    this.value$ = this._value$.pipe(
      tap(v => {
        this._value = v;
      })
    );
  }

  public useValue() {
    const value = useObservable(this.value$, this._value);
    return value;
  }

  public setValue(nextValue: ValueType) {
    this._value$.next(nextValue);
  }

  public setValueWithFn(updater: (prev: ValueType) => ValueType) {
    if (typeof updater !== 'function') {
      throw new Error(
        `updater should be a function. but got ${typeof updater}`
      );
    }
    this._value$.next(updater(this._value));
  }
}
