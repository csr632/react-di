import { inject as inject0 } from 'inversify';
import { IToken, getActualToken } from './di';

export { injectable } from 'inversify';
export function inject(serviceIdentifier: IToken) {
  const actualToken = getActualToken(serviceIdentifier);
  return inject0(actualToken);
}

// TODO: support lazyInject
