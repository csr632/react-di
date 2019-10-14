import * as React from 'react';
import { render } from 'react-dom';
import { BrowserRouter, Link, Switch, Route, Redirect } from 'react-router-dom';
import 'reflect-metadata';
import InjectDemo from './InjectDemo';
import ProvidersDemo from './ProvidersDemo';
import AsyncCallerDemoRoute from './asyncCaller';
import BasicDemo from './BasicDemo';
import HierarchicalDemo from './HierarchicalDemo';
import AutoBindDemo from './AutoBindDemo';
import ChildrenMonitorDemo from './ChildrenMonitorDemo';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <div className="App">
        <ul>
          <li>
            <Link to="/basic">basic</Link>
          </li>
          <li>
            <Link to="/hierarchical">hierarchical</Link>
          </li>
          <li>
            <Link to="/auto-bind">auto-bind</Link>
          </li>
          <li>
            <Link to="/children-monitor">children-monitor</Link>
          </li>
          <li>
            <Link to="/inject-demo">inject-demo</Link>
          </li>
          <li>
            <Link to="/providers-demo">providers-demo</Link>
          </li>
          <li>
            <Link to="/caller">caller</Link>
          </li>
        </ul>

        <hr />
        <Switch>
          <Route path="/basic" component={BasicDemo} />
          <Route path="/auto-bind" component={AutoBindDemo} />
          <Route path="/hierarchical" component={HierarchicalDemo} />
          <Route path="/children-monitor" component={ChildrenMonitorDemo} />
          <Route path="/inject-demo" component={InjectDemo} />
          <Route path="/providers-demo" component={ProvidersDemo} />
          <Route path="/caller" component={AsyncCallerDemoRoute} />
          <Route render={() => <Redirect to="/basic" />} />
        </Switch>
      </div>
    </BrowserRouter>
  );
};

const rootElement = document.getElementById('app');
render(<App />, rootElement);
