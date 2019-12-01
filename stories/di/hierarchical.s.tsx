import React, { useEffect } from 'react';
import { injectable, withDIContainer, useDIConsumer } from 'react-rxdi';

let fooCount = 0;

@injectable()
class Foo {
  id: number;

  constructor() {
    this.id = fooCount;
    fooCount++;
    console.log(`Creating Foo${this.id}`);
  }
}

@injectable()
class Bar {
  // get foo instance from parent
  constructor(private foo: Foo) {
    console.log('Creating Bar');
  }

  say() {
    console.log(`Bar says: I got foo${this.foo.id}`);
  }
}

export const Demo: React.FC = withDIContainer([Foo])(() => {
  return (
    <>
      <Child1 />
      <Child2 />
    </>
  );
});

const Child1: React.FC = withDIContainer([Bar])(() => {
  // get foo instance from parent
  const [bar] = useDIConsumer([Bar]);
  useEffect(() => {
    bar.say();
  });
  return <h1>HierarchicalDemo Child1</h1>;
});

const Child2: React.FC = withDIContainer([Foo, Bar])(() => {
  // get foo instance from its own provider
  // shadowing the parent's provider
  const [bar] = useDIConsumer([Bar]);
  useEffect(() => {
    bar.say();
  });
  return <h1>HierarchicalDemo Child2</h1>;
});

export default {
  title: 'hierarchical',
};
