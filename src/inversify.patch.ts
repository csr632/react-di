import {
  inject as inject0,
  LazyServiceIdentifer as LazyServiceIdentifer0,
} from 'inversify';
import { IToken, getActualToken } from './di';

export { injectable } from 'inversify';
export function inject(serviceIdentifier: IToken | LazyTokenRef) {
  const actualToken = (() => {
    if (serviceIdentifier instanceof LazyTokenRef) return serviceIdentifier;
    return getActualToken(serviceIdentifier);
  })();
  return inject0(actualToken);
}

export function forwardRef(lazyToken: () => IToken) {
  return new LazyTokenRef(lazyToken);
}

export class LazyTokenRef<T = any> extends LazyServiceIdentifer0<T> {
  constructor(cb: () => IToken) {
    super(() => {
      const token = cb();
      return getActualToken(token);
    });
  }
}
