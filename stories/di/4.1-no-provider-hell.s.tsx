/**
 If you have used some "state management with hooks" tools,
 you may notice the "provider hell" problem in them.
 You may end up with dozens of "state provider" nested
 in each other:

<Container1.Provider>
   <Container2.Provider>
      ...
        <Container12.Provider>
          MyApp
        </Container12.Provider>
      ...
    </Container2.Provider>
</Container1.Provider>

 This is ugly. 
 see: https://github.com/jamiebuilds/unstated-next/issues/35
 
 What's worse, you have to be really careful about their order. If Container1 depends on Container2, Container2 must be put "above" Container1. You must read the implementation of all containers and make sure the order is right. Imagine 5 containers with dependency on each other.

 What's worse, most of the tools out there are not good at handling circular dependency (when it is necessory). If your containers have circular dependency, you must create some 'unreasonable workaround containers', throwing "single responsibility principle" out of the window.
 */

/** 
With react-svs-di, we can avoid all of these. 
react-svs-di use React context provider to broadcast **injector**, not services. The granularity is bigger. One injector can have multiple services in it.
As long as services live in the same injector, they can get each other's reference! You don't need to care about the 'declare order'.
react-svs-di makes it easy to workaround circular dependency, by using 'DIContainerHook'. (Although we encourage you to eliminate circular dependency when appropriate)
 */

import React, { useEffect } from 'react';
import {
  injectable,
  withDIContainer,
  useDIConsumer,
  WithDIContainerHook,
} from 'react-svs-di';

@injectable()
class Foo implements WithDIContainerHook {
  public qux!: Qux;

  useDIContainerHook() {
    // circular dependency
    const [qux] = useDIConsumer([Qux]);
    this.qux = qux;
  }
}

@injectable()
class Bar {
  constructor(public foo: Foo) {}
}

@injectable()
class Baz {
  constructor(public bar: Bar) {}
}

@injectable()
class Qux {
  constructor(public baz: Baz, foo: Foo) {}
}

// The array order dosen't matter. You can reorder it.
export const Demo: React.FC = withDIContainer([Baz, Qux, Foo, Bar])(() => {
  // Order of useDIConsumer's argument also dosen't matter.
  const [foo, bar, baz, qux] = useDIConsumer([Foo, Bar, Baz, Qux]);
  useEffect(() => {
    console.log(foo.qux, bar.foo, baz.bar, qux.baz);
  });
  return (
    <div>
      <h1>NoProviderHell Demo</h1>
    </div>
  );
});

export default {
  title: 'no provider hell',
};
