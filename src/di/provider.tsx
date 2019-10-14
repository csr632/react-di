import * as React from 'react';
import { Container } from 'inversify';
import { useSyncInit } from '../utils';
import {
  isServiceCtor,
  isClassProvider,
  isExistingProvider,
  isValueProvider,
  IDIConatinerOpts,
  isFactoryProvider,
  getActualToken,
} from './types';
import ctx from './context';

/*
injector should be static, and sealed after init.
so we currently don't recommend
call getDIProvider in render,
which generate injector dynamically (based on props)
*/

export function getDIProvider(opts: IDIConatinerOpts = {}) {
  const { providers = [], autoBindInjectable = false } = opts;

  const DIContainerIniter = () => {
    const DIContainer = new Container({
      defaultScope: 'Singleton',
      skipBaseClassChecks: true,
      autoBindInjectable,
    });
    providers.forEach(provider => {
      if (isServiceCtor(provider)) {
        DIContainer.bind(provider).toSelf();
      } else if (isClassProvider(provider)) {
        DIContainer.bind(getActualToken(provider.provide)).to(
          provider.useClass
        );
      } else if (isExistingProvider(provider)) {
        DIContainer.bind(getActualToken(provider.provide)).toService(
          getActualToken(provider.useExisting)
        );
      } else if (isValueProvider(provider)) {
        DIContainer.bind(getActualToken(provider.provide)).toConstantValue(
          provider.useValue
        );
      } else if (isFactoryProvider(provider)) {
        DIContainer.bind(getActualToken(provider.provide)).toDynamicValue(
          context => {
            const { container } = context;
            const deps = (() => {
              const result: any[] = [];
              if (Array.isArray(provider.deps)) {
                provider.deps.forEach(depToken => {
                  result.push(container.get(getActualToken(depToken)));
                });
              }
              return result;
            })();
            return provider.useFactory(...deps);
          }
        );
      } else {
        console.error('Invalid provider definition:', provider);
        throw new Error(
          `Invalid provider definition: ${JSON.stringify(provider)}`
        );
      }
    });
    return { DIContainer };
  };

  const DIProvider: React.FC = ({ children }) => {
    const { DIContainer } = useSyncInit(DIContainerIniter);
    // hierarchical DI systems
    const upperContainer = React.useContext(ctx);
    if (upperContainer) {
      DIContainer.parent = upperContainer;
    }
    return <ctx.Provider value={DIContainer}>{children}</ctx.Provider>;
  };
  return DIProvider;
}

type RetType = <Props extends {}>(
  Wrapped: React.ComponentType<Props>
) => React.FunctionComponent<Props>;
// return a HOC to wrap ctx.Provider
export function withDIProvider(): RetType;
export function withDIProvider(
  providers: NonNullable<IDIConatinerOpts['providers']>
): RetType;
export function withDIProvider(opts: IDIConatinerOpts): RetType;
export function withDIProvider(optsOrProviders?: unknown) {
  const opts: IDIConatinerOpts = (() => {
    if (optsOrProviders === null || typeof optsOrProviders !== 'object')
      return {};
    if (Array.isArray(optsOrProviders)) return { providers: optsOrProviders };
    return optsOrProviders as IDIConatinerOpts;
  })();
  const Provider = getDIProvider(opts);

  return <Props extends {}>(Wrapped: React.ComponentType<Props>) => {
    const WithDIProvider: React.FC<Props> = props => (
      <Provider>
        {/* eslint-disable-next-line react/jsx-props-no-spreading */}
        <Wrapped {...props} />
      </Provider>
    );
    return WithDIProvider;
  };
}
