import * as React from 'react';
import { useObservable } from 'rxjs-hooks';
import { Link, Switch, Route, withRouter, Redirect } from 'react-router-dom';
import { withDIContainer, useDIConsumer, useBindLifeCycle } from 'react-svs-di';
import { CountSvs } from './service/CountSvs';
import { configLogSvs } from './service/LogSvs';
import { PollingSvs } from './service/PollingSvs';

/* eslint-disable @typescript-eslint/no-use-before-define */

const HierarchicalDemo: React.FC = withDIContainer([
  configLogSvs('Hierarchical demo: '),
])(
  withRouter(({ match }) => {
    const child1Path = `${match.path}/child1`;
    const child2Path = `${match.path}/child2`;
    return (
      <div>
        <ul>
          <li>
            <Link to={child1Path}>Child 1</Link>
          </li>
          <li>
            <Link to={child2Path}>Child 2</Link>
          </li>
        </ul>
        <hr />
        <Switch>
          <Route path={child1Path} component={Child1} />
          <Route path={child2Path} component={Child2} />
          <Route render={() => <Redirect to={child1Path} />} />
        </Switch>
      </div>
    );
  })
);

export default HierarchicalDemo;

// Child1 use parent's LogSvs
const Child1: React.FC = withDIContainer([CountSvs])(() => {
  const [countService] = useDIConsumer([CountSvs]);
  const sum = useObservable(() => countService.sum$, 0);
  return (
    <div>
      <h2>Child1</h2>
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

// Child2 has its own LogSvs
const Child2: React.FC = withDIContainer([
  CountSvs,
  configLogSvs('Hierarchical Child2: '),
  PollingSvs,
])(() => {
  const [countService, pollingSvs] = useDIConsumer([CountSvs, PollingSvs]);
  const sum = useObservable(() => countService.sum$, 0);
  useBindLifeCycle(pollingSvs._hostLifeCycle);
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
