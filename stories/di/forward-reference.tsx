/**
 * forwardRef allows you to refer to values
 * which are not yet defined.
 * Just like Angular's forwardRef:
 * https://stackoverflow.com/q/50894571
 */

import React from 'react';
import {
  injectable,
  withDIContainer,
  useDIConsumer,
  inject,
  forwardRef,
} from 'react-svs-di';

@injectable()
class Foo {
  // Bar is not defined yet, but we can still refer to it
  // using 'javascript closure'
  constructor(@inject(forwardRef(() => Bar)) public bar: Bar) {
    console.log(bar);
  }
}

@injectable()
class Bar {}

export const Demo: React.FC = withDIContainer([Foo, Bar])(() => {
  const [foo, bar] = useDIConsumer([Foo, Bar]);
  return (
    <div>
      <h1>NoProviderHell Demo</h1>
    </div>
  );
});

export default {
  title: 'no provider hell',
};
