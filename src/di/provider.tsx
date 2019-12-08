import React from 'react';
import { Container as Injector } from 'inversify';
import { useAssertValueNotChange, useSyncInit } from '../utils';
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
import { DIPluginAutoBindLifeCycle } from '../lifeCycle';
import { ContainerHookPlugin } from './container-hook-plugin';
import { PluginExecutor } from './plugin-executor';

/*
injector should be static, and sealed after init.
so we currently don't recommend
call getDIContainer in render,
which generate injector dynamically (based on props)
*/

export function getDIContainer(opts: IDIConatinerOpts = {}) {
  const { providers = [], autoBindInjectable = false, plugins = [] } = opts;

  // add build-in plugins
  plugins.unshift(DIPluginAutoBindLifeCycle, ContainerHookPlugin);

  const useDIContainerIniter = (upperContainer: Injector | null) => () => {
    const injector = new Injector({
      defaultScope: 'Singleton',
      skipBaseClassChecks: true,
      autoBindInjectable,
    });
    // hierarchical DI systems
    if (upperContainer) {
      injector.parent = upperContainer;
    }
    providers.forEach(provider => {
      if (isServiceCtor(provider)) {
        injector.bind(provider).toSelf();
      } else if (isClassProvider(provider)) {
        injector.bind(getActualToken(provider.provide)).to(provider.useClass);
      } else if (isExistingProvider(provider)) {
        injector
          .bind(getActualToken(provider.provide))
          .toService(getActualToken(provider.useExisting));
      } else if (isValueProvider(provider)) {
        injector
          .bind(getActualToken(provider.provide))
          .toConstantValue(provider.useValue);
      } else if (isFactoryProvider(provider)) {
        injector
          .bind(getActualToken(provider.provide))
          .toDynamicValue(context => {
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
          });
      } else {
        console.error('Invalid provider definition:', provider);
        throw new Error(
          `Invalid provider definition: ${JSON.stringify(provider)}`
        );
      }
    });

    // create instances immediately after injector is inited
    const allProvidedValues = providers.map(provider => {
      const value = (() => {
        if (isServiceCtor(provider)) {
          return injector.get(provider);
        }
        return injector.get(getActualToken(provider.provide));
      })();
      return { value, provider };
    });

    return { injector, allProvidedValues };
  };

  const DIContainer: React.FC = ({ children }) => {
    // hierarchical DI systems
    const upperContainer = React.useContext(ctx);
    useAssertValueNotChange(upperContainer);
    const { injector, allProvidedValues } = useSyncInit(
      useDIContainerIniter(upperContainer)
    );

    return (
      <ctx.Provider value={injector}>
        {/* PluginExecutor should be under Provider, 
        so that useDIConsumer can works*/}
        <PluginExecutor allProvidedValues={allProvidedValues} plugins={plugins}>
          {children}
        </PluginExecutor>
      </ctx.Provider>
    );
  };
  return DIContainer;
}

type RetType = <Props extends {}>(
  Wrapped: React.ComponentType<Props>
) => React.FunctionComponent<Props>;
// return a HOC to wrap ctx.Provider
export function withDIContainer(): RetType;
export function withDIContainer(
  providers: NonNullable<IDIConatinerOpts['providers']>
): RetType;
export function withDIContainer(opts: IDIConatinerOpts): RetType;
export function withDIContainer(optsOrProviders?: unknown) {
  const opts: IDIConatinerOpts = (() => {
    // invalid arguments
    if (optsOrProviders === null || typeof optsOrProviders !== 'object')
      return {};
    // pass providers arr directly
    if (Array.isArray(optsOrProviders)) return { providers: optsOrProviders };
    return optsOrProviders as IDIConatinerOpts;
  })();
  const DIContainer = getDIContainer(opts);

  return <Props extends {}>(Wrapped: React.ComponentType<Props>) => {
    const WithDIContainer: React.FC<Props> = props => (
      <DIContainer>
        {/* eslint-disable-next-line react/jsx-props-no-spreading */}
        <Wrapped {...props} />
      </DIContainer>
    );
    return WithDIContainer;
  };
}
