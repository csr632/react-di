export * from './init';
export * from './usePrevious';
export * from './useObservableCB';

export function isObject(value: any): value is any {
  return !!value && typeof value === 'object';
}
