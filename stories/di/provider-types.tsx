import React, { useEffect } from 'react';
import {
  IValueProvider,
  CustomToken,
  IExistingProvider,
  withDIProvider,
  IClassProvider,
  IFactoryProvider,
  useDIConsumer,
  injectable,
} from 'react-rxdi';
import _ from 'lodash';

@injectable()
class LogSvs {
  log(msg: string) {
    console.log(msg);
  }
}

// or you can use 'LogSvs' as shorthand
const classProvider: IClassProvider = { provide: LogSvs, useClass: LogSvs };

const anotherTokenForSameSvsInstance = Symbol('anotherTokenForSameSvsInstance');
const existingProvider: IExistingProvider = {
  provide: anotherTokenForSameSvsInstance,
  useExisting: LogSvs,
};

@injectable()
class CountSvs {
  public count: number;

  constructor(init: number) {
    this.count = init;
  }

  inc() {
    this.count++;
  }
}

const factoryProvider: IFactoryProvider = {
  provide: CountSvs,
  useFactory: (logSvs: LogSvs) => {
    logSvs.log('creating CountSvs');
    return new CountSvs(123);
  },
  deps: [LogSvs],
};

const lodashToken = new CustomToken<typeof _>('lodash token');
const valueProvider: IValueProvider = {
  provide: lodashToken,
  useValue: _,
};

export const ProviderTypesDemo: React.FC = withDIProvider([
  // equivalent to shorthand LogSvs
  classProvider,
  existingProvider,
  factoryProvider,
  valueProvider,
])(() => {
  const [logSvs, logSvs2, countSvs, lodash] = useDIConsumer([
    LogSvs,
    anotherTokenForSameSvsInstance,
    CountSvs,
    lodashToken,
  ]);
  useEffect(() => {
    if (logSvs !== logSvs2)
      throw new Error(`should get same instance when using existingProvider`);

    logSvs.log(countSvs.count.toString());
    countSvs.inc();
    logSvs.log(countSvs.count.toString());
  });

  return (
    <div>
      <h1>{lodash.capitalize('providerTypes demo')}</h1>
    </div>
  );
});
