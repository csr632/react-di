import * as React from 'react';
import { withDIProvider, useDIConsumer } from 'react-rxdi';
import { configLogSvs } from './service/LogSvs';
import { injectNumberToken, InjectDemoSvs } from './service/InjectDemoSvs';

const InjectDemo: React.FC = withDIProvider([
  configLogSvs('Inject demo: '),
  {
    provide: injectNumberToken,
    useValue: 123,
  },
  InjectDemoSvs,
])(() => {
  const [injectDemoSvs] = useDIConsumer([InjectDemoSvs]);
  React.useEffect(() => {
    injectDemoSvs.show();
  }, [injectDemoSvs]);
  return <h2>Inject demo</h2>;
});

export default InjectDemo;
