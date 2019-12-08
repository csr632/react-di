import * as React from 'react';
import { useObservable } from 'rxjs-hooks';
import { withDIContainer, useDIConsumer } from 'react-svs-di';
import { CountSvs } from './service/CountSvs';
import { configLogSvs } from './service/LogSvs';

const AutoBindDemo: React.FC = withDIContainer({
  // Constructors with no parameters can be auto-bind
  autoBindInjectable: true,
  // configurable services can't be auto-bind. so provide it
  providers: [configLogSvs('Auto bind demo: ')],
})(() => {
  const [countService] = useDIConsumer([CountSvs]);
  const sum = useObservable(() => countService.sum$, 0);
  return (
    <div>
      <p>sum: {sum}</p>
      <Child />
    </div>
  );
});

export default AutoBindDemo;

const Child: React.FC = () => {
  const [countService] = useDIConsumer([CountSvs]);
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
