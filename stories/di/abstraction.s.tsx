import React, { useEffect } from 'react';
import { withDIProvider, useDIConsumer, injectable } from 'react-rxdi';

abstract class LogSvs {
  public constructor() {
    this.log('creating base class LogSvs');
  }

  // The actual implement may use console.log, or alert,
  // or sent log to server.
  public abstract log(msg: string);

  // can define more abstract methods here
}

@injectable()
class ActualLogSvs extends LogSvs {
  public constructor() {
    super();
  }

  log(msg: string) {
    console.log('Enhanced logger:', msg);
  }
}

export const Demo: React.FC = withDIProvider([
  // Abstractions are bind to their implementations at application root
  {
    provide: LogSvs,
    useClass: ActualLogSvs,
  },
])(() => {
  // DI consumers don't couple to the actual implementation.
  // They should only depend on the abstraction.
  // The actual implementation is hidden by the abstraction.
  const [logSvs] = useDIConsumer([LogSvs]);

  useEffect(() => {
    logSvs.log('Consumer is using abstraction!');
  });

  return (
    <div>
      <h1>Abstraction demo</h1>
    </div>
  );
});

export default {
  title: 'abstraction',
};
