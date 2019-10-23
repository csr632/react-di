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
  constructor(foo: Foo) {
    console.log('Creating Bar. foo:', foo);
  }
}

export const HierarchicalDemo: React.FC = withDIProvider([Foo])(() => {
  return <Child />;
});

const Child: React.FC = withDIProvider([Bar])(() => {
  // get foo instance from parent
  const [foo] = useDIConsumer([Foo]);
  return <h2>HierarchicalDemo</h2>;
});
