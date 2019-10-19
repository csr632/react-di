import * as React from 'react';
import { isObject } from '.';

/* eslint-disable import/export, no-redeclare, @typescript-eslint/no-namespace */

// Alternative 1:
// init is called in effect
// suitable for init that has side effect
export function useInit<Inited extends {}>(
  initer: () => Inited | Promise<Inited>
) {
  const [inited, setInited] = React.useState<
    Inited | typeof useInit.INIT_NOT_DONE
  >(useInit.INIT_NOT_DONE);
  React.useLayoutEffect(() => {
    const ret = initer();
    if (isPromise(ret)) {
      // async init
      ret.then(setInited);
      return;
    }
    setInited(ret);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return inited;
}
export namespace useInit {
  export const INIT_NOT_DONE = Symbol('init_not_done');
}

function isPromise(value: any): value is PromiseLike<any> {
  return isObject(value) && typeof value.then === 'function';
}

export const withInit = <Inited extends {}>(
  initer: () => Inited | Promise<Inited>
) => <Props extends Inited>(Wrapped: React.ComponentType<Props>) => {
  const HOC: React.FC<Omit<Props, keyof Inited>> = props => {
    const inited = useInit(initer);
    if (inited === useInit.INIT_NOT_DONE) return null;
    const actualProps = ({
      ...props,
      ...inited,
    } as unknown) as Props;
    // eslint-disable-next-line react/jsx-props-no-spreading
    return <Wrapped {...actualProps} />;
  };
  HOC.displayName = `WithInit`;
  return HOC;
};

// Alternative 2:
// https://reactjs.org/docs/hooks-faq.html#how-to-create-expensive-objects-lazily
// init is called in render phase
// not suitable for init that has side effect
export function useSyncInit<Inited extends {}>(
  initer: Inited | (() => Inited)
): Inited {
  const [inited] = React.useState(initer);
  return inited;
}
