import React, { useEffect } from 'react';
import { withDIProvider, useDIConsumer, IProvider } from 'react-rxdi';

class LogSvs {
  public constructor(private prefix: string) {
    this.log('creating LogSvs');
  }

  public log(msg: string) {
    console.log(`${this.prefix}: ${msg}`);
  }
}

// This is a useful pattern to configure injectable services
export function configLogSvs(prefix: string): IProvider {
  return { provide: LogSvs, useFactory: () => new LogSvs(prefix) };
}

export const ConfigurableDemo: React.FC = withDIProvider([
  configLogSvs('configurable demo'),
])(() => {
  // DI consumers don't couple to the actual implementation.
  // They should only depend on the abstraction.
  // The actual implementation is hidden by the abstraction.
  const [logSvs] = useDIConsumer([LogSvs]);

  useEffect(() => {
    logSvs.log('logging');
  });

  return (
    <div>
      <h1>Configurable demo</h1>
    </div>
  );
});
