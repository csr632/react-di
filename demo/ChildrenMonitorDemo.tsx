import * as React from 'react';
import { useObservable } from 'rxjs-hooks';
import { withDIProvider, useDIConsumer, useBindLifeCycle } from 'react-rxdi';
import { configLogSvs } from './service/LogSvs';
import { ChildrenMonitor, useReportLifeCycle } from './service/ChildrenMonitor';

const ChildrenMonitorDemo: React.FC = withDIProvider([
  configLogSvs('ChildrenMonitorDemo: '),
  ChildrenMonitor,
])(() => {
  const [childrenMonitor] = useDIConsumer([ChildrenMonitor]);
  useBindLifeCycle(childrenMonitor._hostLifeCycle);
  const childrenInfo = useObservable(() => childrenMonitor.childrenInfo$, {});
  const renderText = JSON.stringify(childrenInfo, null, 2);

  const [child1Count, setChild1Count] = React.useState(() =>
    Math.floor(Math.random() * 5)
  );
  const [child2Count, setChild2Count] = React.useState(() =>
    Math.floor(Math.random() * 5)
  );
  return (
    <div>
      <h2>ChildrenMonitorDemo</h2>
      <div>
        <pre>{renderText}</pre>
      </div>
      <div>
        <button
          type="button"
          onClick={() => {
            setChild1Count(v => v + 1);
          }}
        >
          add child1
        </button>
        {!!child1Count && (
          <button
            type="button"
            onClick={() => {
              setChild1Count(v => v - 1);
            }}
          >
            delete child1
          </button>
        )}
      </div>
      <div>
        <button
          type="button"
          onClick={() => {
            setChild2Count(v => v + 1);
          }}
        >
          add child2
        </button>
        {!!child2Count && (
          <button
            type="button"
            onClick={() => {
              setChild2Count(v => v - 1);
            }}
          >
            delete child2
          </button>
        )}
      </div>
      {Array.from(Array(child1Count)).map((v, i) => (
        // eslint-disable-next-line react/no-array-index-key
        <Child1 key={i} />
      ))}
      {Array.from(Array(child2Count)).map((v, i) => (
        // eslint-disable-next-line react/no-array-index-key
        <Child2 key={i} />
      ))}
    </div>
  );
});

const Child1: React.FC = () => {
  const [childrenMonitor] = useDIConsumer([ChildrenMonitor]);
  useReportLifeCycle('Child1', childrenMonitor.childrenLifeCycleCollector);
  return <p>Child1</p>;
};

const Child2: React.FC = () => {
  const [childrenMonitor] = useDIConsumer([ChildrenMonitor]);
  useReportLifeCycle('Child2', childrenMonitor.childrenLifeCycleCollector);
  return <p>Child2</p>;
};

export default ChildrenMonitorDemo;
