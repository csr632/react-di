import * as React from 'react';
import { useObservable } from 'rxjs-hooks';
import { withDIProvider, useDIConsumer, CustomToken } from 'react-rxdi';
import { CarSvsToken, CarSvs } from './service/CarSvs';
import { LodashProvider, LodashToken } from './service/LodashProvider';
import LogSvs, { configLogSvs } from './service/LogSvs';
import { CountSvs } from './service/CountSvs';

/* eslint-disable @typescript-eslint/no-use-before-define */

// const Providers

const ProvidersDemo: React.FC = withDIProvider([
  configLogSvs('Providers demo: '),
  // ValueProvider demo
  LodashProvider,
])(() => {
  const [_, logSvs] = useDIConsumer([LodashToken, LogSvs]);
  React.useEffect(() => {
    logSvs.log(`${_.capitalize('lodash')}is working`);
  }, [_, logSvs]);
  return (
    <div>
      <Child1 />
    </div>
  );
});

export default ProvidersDemo;

// Child1 use parent's LogSvs
const Child1: React.FC = withDIProvider([
  // FactoryProvider demo
  {
    provide: CarSvsToken,
    useFactory: (logSvs: LogSvs) => new CarSvs(logSvs),
    deps: [LogSvs],
  },
])(() => {
  const [carSvs] = useDIConsumer([CarSvsToken]);
  React.useEffect(() => {
    carSvs.run();
  }, [carSvs]);
  return (
    <div>
      <h2>Child1</h2>

      <hr />
      <Child2 />
    </div>
  );
});

const customCarToken = new CustomToken<CarSvs>(Symbol('customCarToken'));

// Child2 has its own CountSvs
const Child2: React.FC = withDIProvider([
  // ClassProvider demo
  {
    provide: CountSvs,
    useClass: CountSvs,
  },
  {
    provide: customCarToken,
    useExisting: CarSvsToken,
  },
])(() => {
  const [countService, aliasedCarSvs] = useDIConsumer([
    CountSvs,
    customCarToken,
  ]);
  const sum = useObservable(() => countService.sum$, 0);
  React.useEffect(() => {
    // same car object as Child1
    aliasedCarSvs.run();
  });
  return (
    <div>
      <h2>Child2</h2>
      <p>sum: {sum}</p>
      <button
        type="button"
        onClick={() => {
          countService.inc();
        }}
      >
        increase
      </button>
    </div>
  );
});
