import * as React from 'react';
import { isObject } from '.';

const INIT_NOT_DONE = Symbol('@@init_not_done@@');

function isPromise(value: any): value is PromiseLike<any> {
  return isObject(value) && typeof value.then === 'function';
}

// Alternative 1:
// render Wrapped component after init is done
// init is call once for every Wrapped component instance
export const withInit = <Inited extends {}>(
  initer: () => Inited | Promise<Inited>
) => <Props extends Inited>(Wrapped: React.ComponentType<Props>) => {
  const HOC: React.FC<Omit<Props, keyof Inited>> = props => {
    const [inited, setInited] = React.useState<Inited | typeof INIT_NOT_DONE>(
      INIT_NOT_DONE
    );
    React.useLayoutEffect(() => {
      const ret = initer();
      if (isPromise(ret)) {
        // async init
        ret.then(inited0 => {
          setInited(inited0);
        });
        return;
      }
      setInited(ret);
    }, []);
    if (inited === INIT_NOT_DONE) return null;
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
export function useSyncInit<Inited extends {}>(
  initer: Inited | (() => Inited)
): Inited {
  const [inited] = React.useState(initer);
  return inited;
}
