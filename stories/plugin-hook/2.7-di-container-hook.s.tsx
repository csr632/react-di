import { injectable, withDIContainer, WithDIContainerHook } from 'react-svs-di';
import * as Rx from 'rxjs';
import React, { useState, useEffect } from 'react';

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

@injectable()
class LifeCycleMonitorSvs implements WithDIContainerHook {
  // DIContainerHook is called in the DIContainer HOC
  useDIContainerHook() {
    useEffect(() => {
      console.log('Service Mounted!');
      const sub = someObservable$.subscribe(v => {
        console.log('get value', v);
      });
      return () => {
        console.log('Service unMounted!');
        sub.unsubscribe();
      };
    }, []);
  }
}

// DIContainer HOC as the wrapper of Child
const Child: React.FC = withDIContainer([LifeCycleMonitorSvs])(() => {
  return <p>Child</p>;
});

export default {
  title: 'plugin-hook: container-hook',
};
