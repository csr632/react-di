import React, { useEffect } from 'react';
import {
  CustomToken,
  withDIProvider,
  useDIConsumer,
  injectable,
} from 'react-rxdi';

@injectable()
class LogSvs {
  log() {
    console.log('log!');
  }
}

// If you don't wan't to use class constructor as DI token,
// you can use CustomToken!

// The type information of value is stored in token!
const tokenLogSvs = new CustomToken<LogSvs>('I am token id for LogSvs');

// differnt CustomToken object with same "token id" is equivalent!
const tokenLogSvs2 = new CustomToken<LogSvs>('I am token id for LogSvs');

export const CustomTokenDemo: React.FC = withDIProvider([
  { provide: tokenLogSvs, useClass: LogSvs },
])(() => {
  const [logSvs, logSvs2] = useDIConsumer([tokenLogSvs, tokenLogSvs2]);
  // consumer can get correct type information from the custom token

  useEffect(() => {
    if (logSvs2 !== logSvs) throw new Error(`should get same instance`);
    logSvs.log();
  });

  return (
    <div>
      <h1>CustomToken demo</h1>
    </div>
  );
});
