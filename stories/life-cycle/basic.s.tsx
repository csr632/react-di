import {
  injectable,
  LifeCycle,
  withDIContainer,
  WithAutoLifeCycle,
} from 'react-rxdi';
import * as Rx from 'rxjs';
import React, { useState } from 'react';

const someObservable$ = Rx.interval(1000);

export const Demo: React.FC = () => {
  const [showChild, setShowChild] = useState(false);

  return (
    <div>
      <h1>LifeCycle Demo</h1>
      <div>
        <button
          type="button"
          onClick={() => {
            setShowChild(v => !v);
          }}
        >
          toggle showChild
        </button>
      </div>
      {showChild && <Child />}
    </div>
  );
};

// With the help of `LifeCycle`,
// we can easily turn 'component lifecycle' (which is usually in view layer)
// into a 'data stream'! (which is in data/model layer)

// Implements AutoBindLifeCycle to help you avoid typo.
// It is not necessary (but we recommend it).
@injectable()
class LifeCycleMonitorSvs implements WithAutoLifeCycle {
  // One LifeCycle instance track **one** component instance's lifecycle.
  // The `autoLifeCycle` property is automatically
  // bound to the lifecycle of its host component(DIContainer).
  autoLifeCycle = new LifeCycle();

  constructor() {
    this.autoLifeCycle.mount$.subscribe(() => {
      console.log('Child Mounted!');
    });
    this.autoLifeCycle.unMount$.subscribe(() => {
      console.log('Child unMounted!');
    });

    // will auto un-subscribe when host component unMount
    // to avoid memory leak
    this.autoLifeCycle.subscribeInLifeCycle(someObservable$, v => {
      console.log('get value', v);
    });
  }
}

// The DIContainer HOC have same lifecycle as Child
const Child: React.FC = withDIContainer([LifeCycleMonitorSvs])(() => {
  return <p>Child</p>;
});

export default {
  title: 'life-cycle/basic',
};
