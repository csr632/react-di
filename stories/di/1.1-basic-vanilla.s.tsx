/**
 * react-svs-di provide great interoperability with react hooks.
 *
 * Inside services, you can define hooks for consumers,
 * to achieve better code cohesion and encapsulation.
 *
 * In those hooks, consumers can subscribe to shared states inside the services.
 * When the shared state change, consumers will be automatically re-rendered.
 *
 * With the help of SharedState,
 * you can create a shared state without using rxjs !
 */

import React from 'react';
import { injectable, withDIContainer, useDIConsumer } from 'react-svs-di';
import { SharedState } from 'react-svs-di';

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

export default {
  title: 'basic: vanilla version',
};
