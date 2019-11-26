import React, { useEffect } from 'react';
import {
  injectable,
  CustomToken,
  withDIProvider,
  useDIConsumer,
} from 'react-rxdi';

@injectable()
class Foo {
  constructor() {
    console.log('Creating Foo');
  }
}

@injectable()
class Bar {
  // get foo instance from parent
  constructor(private foo: Foo) {
    console.log('Creating Bar');
  }

  say() {
    console.log('Bar says: I got foo: ', this.foo);
  }
}

export const HierarchicalDemo: React.FC = withDIProvider([Foo])(() => {
  return <Child />;
});

const Child: React.FC = withDIProvider([Bar])(() => {
  // get foo instance from parent
  const [bar] = useDIConsumer([Bar]);
  useEffect(() => {
    bar.say();
  });
  return <h2>HierarchicalDemo</h2>;
});
