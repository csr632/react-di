import * as React from 'react';
import { Link, Switch, Route, withRouter } from 'react-router-dom';
import AsyncCallerDemo from './asyncCaller';
import AsyncCallerWithCacheDemo from './asyncCallerWithCache';

const AsyncCallerDemoRoute: React.ComponentType = withRouter(({ match }) => {
  const child1Path = `${match.path}/asyncCaller`;
  const child2Path = `${match.path}/asyncCallerWithCache`;
  return (
    <div>
      <ul>
        <li>
          <Link to={child1Path}>asyncCaller</Link>
        </li>
        <li>
          <Link to={child2Path}>asyncCallerWithCache</Link>
        </li>
      </ul>
      <Switch>
        <Route path={child1Path} component={AsyncCallerDemo} />
        <Route path={child2Path} component={AsyncCallerWithCacheDemo} />
      </Switch>
    </div>
  );
});

export default AsyncCallerDemoRoute;
