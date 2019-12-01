import { interfaces } from 'inversify';
import { isObject } from '../utils';

export interface IDIConatinerOpts {
  providers?: IProvider[];
  autoBindInjectable?: boolean;
  plugins?: IContainerLevelPlugin[];
}

/**
 * Token Types
 * Token can be a abstract class, which is not assignable to Newable
 */
export type IToken = CustomToken<any> | AbstractCtor<object> | symbol;
export type AbstractCtor<T> = Function & { prototype: T };
export class CustomToken<ValueType> {
  private readonly _reflectName = CustomToken.tokenReflectName;

  constructor(public readonly tokenId: string | symbol) {}

  // Don't use instanceOf, use Reflection instead.
  // Because user may have multi version of react-rxdi
  public static isCustomToken(value: any): value is CustomToken<any> {
    return (
      isObject(value) && value._reflectName === CustomToken.tokenReflectName
    );
  }

  private static readonly tokenReflectName = '@@RXDI Token v1@@' as const;
}

export type GetValueTypeByToken<
  Token extends IToken
> = Token extends CustomToken<infer ValueType>
  ? ValueType
  : Token extends AbstractCtor<infer ValueType2>
  ? ValueType2
  : Token extends symbol
  ? any
  : never;
// GetValueTypeByToken Example:
// declare function testFn<Input>(v: Input): GetValueTypeByToken<Input>;
// declare const v1: CustomToken<{ aaa: number }>;
// const v2 = testFn(v1);
// abstract class ABClass {
//   bbb = 123;
// }
// const v3 = testFn(ABClass).bbb;
// class TestClass {
//   ccc = 123;
// }
// const v4 = testFn(TestClass).ccc;
// //// Example end

export function isToken(value: any): value is IToken {
  return (
    CustomToken.isCustomToken(value) ||
    isServiceCtor(value) ||
    typeof value === 'symbol'
  );
}

export function getActualToken(token: IToken): symbol {
  if (!isToken(token)) {
    console.error(
      `The given token is invalid.
    Fail to provide this token.
    Token:`,
      token
    );
    throw new Error(`The given token is invalid.
    Fail to provide this token.
    See the console.error above.`);
  }
  if (CustomToken.isCustomToken(token)) {
    return token.tokenId as symbol;
  }
  // although token may be a class constructor here,
  // we can treat it like symbol
  return token as symbol;
}

/**
 * Provider Types
 */
export type IProvider =
  | ServiceCtor
  | IClassProvider
  | IExistingProvider
  | IValueProvider
  | IFactoryProvider;
export type Newable<T> = interfaces.Newable<T>;
export type ServiceCtor = Newable<object>;
export interface IClassProvider {
  provide: IToken;
  useClass: ServiceCtor;
}
export interface IExistingProvider {
  provide: IToken;
  useExisting: IToken;
}
export interface IValueProvider {
  provide: IToken;
  useValue: any;
}
export interface IFactoryProvider {
  provide: IToken;
  // angular also don't give type to useFactory
  // https://github.com/angular/angular/blob/5de7960f019701e4e26dc6a7809c244ef94b5e30/packages/core/src/di/interface/provider.ts#L209
  useFactory: (...deps: any[]) => any;
  deps?: IToken[];
}
export type GetTokenTypeByProvider<
  Provider extends IProvider
> = Provider extends ServiceCtor
  ? Provider
  : Provider extends IClassProvider
  ? Provider['provide']
  : Provider extends IExistingProvider
  ? Provider['provide']
  : Provider extends IValueProvider
  ? Provider['provide']
  : Provider extends IFactoryProvider
  ? Provider['provide']
  : never;

export function isServiceCtor(value: unknown): value is ServiceCtor {
  return (
    typeof value === 'function' &&
    isObject(value.prototype) &&
    value.prototype.constructor === value
  );
}
export function isClassProvider(value: unknown): value is IClassProvider {
  return (
    isObject(value) && isToken(value.provide) && isServiceCtor(value.useClass)
  );
}
export function isExistingProvider(value: unknown): value is IExistingProvider {
  return (
    isObject(value) && isToken(value.provide) && isToken(value.useExisting)
  );
}
export function isValueProvider(value: unknown): value is IValueProvider {
  return (
    isObject(value) &&
    isToken(value.provide) &&
    {}.hasOwnProperty.call(value, 'useValue')
  );
}
export function isFactoryProvider(value: unknown): value is IFactoryProvider {
  return (
    isObject(value) &&
    isToken(value.provide) &&
    typeof value.useFactory === 'function'
  );
}

/**
 * These plugins are called as React hook for container component.
 * This is the plugin mechanism of DIContainer
 */
export type IContainerLevelPlugin = (
  allProvidedValues: IAllProvidedValues
) => void;
export type ISvsLevelPlugin = () => void;

export type IAllProvidedValues = {
  provider: IProvider;
  value: unknown;
}[];

export interface WithSvsLevelPlugin {
  pluginHook: ISvsLevelPlugin;
}
