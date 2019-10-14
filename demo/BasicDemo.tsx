import * as React from 'react';
import { useObservable } from 'rxjs-hooks';
import { withDIProvider, useDIConsumer } from 'react-rxdi';
import { CountSvs } from './service/CountSvs';
import LogSvs, { configLogSvs } from './service/LogSvs';

const BasicDemo: React.FC = withDIProvider([
  CountSvs,
  configLogSvs('Basic demo: '),
])(() => {
  const [countService] = useDIConsumer([CountSvs]);
  const sum = useObservable(() => countService.sum$, 0);

  return (
    <div>
      <p>sum: {sum}</p>
      <Child />
    </div>
  );
});

export default BasicDemo;

const Child: React.FC = () => {
  const [countService, logSvs] = useDIConsumer([CountSvs, LogSvs]);
  React.useEffect(() => {
    logSvs.log('Child mounted');
    return () => {
      logSvs.log('Child un-mounted');
    };
  }, [logSvs]);
  return (
    <div>
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
};
