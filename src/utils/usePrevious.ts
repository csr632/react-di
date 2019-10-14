import * as React from 'react';

/* eslint-disable import/export, no-redeclare, @typescript-eslint/no-namespace */

// https://reactjs.org/docs/hooks-faq.html#how-to-get-the-previous-props-or-state
// https://reactjs.org/docs/hooks-faq.html#how-to-create-expensive-objects-lazily
export function usePrevious<T>(value: T): T | typeof usePrevious.NO_PREVIOUS {
  const ref = React.useRef<T | typeof usePrevious.NO_PREVIOUS>(
    usePrevious.NO_PREVIOUS
  );
  React.useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}
export namespace usePrevious {
  export const NO_PREVIOUS = Symbol('no previous');
}

/* eslint-enable */

export function useAssertValueNotChange<T>(value: T): void {
  const prev = React.useRef(value);
  if (value !== prev.current) {
    console.error(
      `useAssertValueNotChange check fail.
    Prev:`,
      prev,
      `\nCurrent:`,
      value
    );
    throw new Error(`useAssertValueNotChange check fail:
      prev: ${prev}, current: ${value}`);
  }
}

export function useCompId() {
  return React.useRef();
}
