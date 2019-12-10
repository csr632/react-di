# react-svs-di

react-svs-di is a react state managent library. It helps you to build a robust data layer for your app. It comes with these features:

- Typescript first. Get full power of intellisense and type-checking when:
  - Subscribe shared state
  - Update shared state
  - Manage async works
  > Using typescript with 'redux-like' state managent library is a cumbersome development experience. Too many [boilerplate code](https://github.com/erikras/ducks-modular-redux)(define actions types and action creators, import actions creator, dispatch action, define reducer, connect, manage effects). And it is unintuitive to get intellisense and type-checking to work(because of string-based action type). The type of `dispatch` is dynamic.
- Dependency injection. We encourage users to 'depend on abstractions, don't depend on implementations'. (dependency inversion principle)
  - We use react context to implement DI, but we [resolve the problem of 'provider hell'](https://csr632.github.io/react-svs-di/?path=/story/no-provider-hell--demo), which is ignored by most 'state management libraries'.
- Embrace react hooks. Hooks is a booming trend in react community. You can benefit from the community while using react-svs-di. For example, you can [use swr](https://csr632.github.io/react-svs-di/?path=/story/plugin-hook-consumer-hook--demo), which is a fantastic react hook library!
- Rxjs friendly. rxjs fit very well in react-svs-di. react-svs-di makes it [very](https://csr632.github.io/react-svs-di/?path=/story/basic-rxjs-version--demo) [easy](https://csr632.github.io/react-svs-di/?path=/story/life-cycle-to-rxjs--demo) to use rxjs in react.
  > If you don't like/know rxjs, feel free to drop it!

## Basic example

[![Edit in codesandbox](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/pensive-hamilton-j3511?fontsize=14&hidenavigation=1&theme=dark)

```tsx
import React from 'react';
import {
  injectable,
  withDIContainer,
  useDIConsumer,
  SharedState,
} from 'react-svs-di';

@injectable()
class CountSvs {
  private sum = new SharedState(0);
  // this is a react hook to be run in consumer
  useCountNumber() {
    const value = this.sum.useValue();
    return value;
  }
  public increase() {
    this.sum.setValueWithFn(prev => prev + 1);
  }
  public decrease() {
    this.sum.setValueWithFn(prev => prev - 1);
  }
  public reset() {
    this.sum.setValue(0);
  }
}

export const Demo: React.FC = withDIContainer([CountSvs])(() => {
  const [dataSvs] = useDIConsumer([CountSvs]);
  // auto re-render when the SharedState changed
  const sum = dataSvs.useCountNumber();

  return (
    <div>
      <h1>Basic Demo - SharedState version</h1>
      <p>sum: {sum}</p>
      <button
        onClick={() => {
          dataSvs.increase();
        }}
      >
        increase
      </button>
      <button
        onClick={() => {
          dataSvs.decrease();
        }}
      >
        decrease
      </button>
      <button
        onClick={() => {
          dataSvs.reset();
        }}
      >
        reset
      </button>
    </div>
  );
});
```

## Workflow

- Split your app logic and state into multiple services:
  - shared state.
  - side effects. Can be async.
    - procedures to update state.
    - communicate with backend.
- Provide those services at appropriate places of component tree.
- Component ask for some service.
  - Component can 'use' service's state to render view.
  - Component can call react hooks provided by the service.
  - Component can call side effect in it's event handler.
    > The service should be provided **above** the component.
- If some side effects change some shared states. Components (that 'use' the shared states) will re-render automatically.
- A service can ask for other services(dependency injection). And call other services' procedures.

## More examples

[Examples page](https://csr632.github.io/react-svs-di).

- Some examples use 'console.log' to proof a point. See it int the 'Actions' tab(or browser dev tool).
- The source code of an example is in the 'Story' tab.
- Explanation of an example is in the comment of the 'Story' tab.
