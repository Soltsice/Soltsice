import './index.css';

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { useStrict } from 'mobx';
import { Provider } from 'mobx-react';
import { Router, Route, Switch } from 'react-router';
import { Link } from 'react-router-dom';

import { Root } from './containers/Root';
// import App from './App';
import registerServiceWorker from './registerServiceWorker';
import * as state from './stores';

import { App } from './components/App';

import { NotFound } from './components/NotFound';

// enable MobX strict mode
useStrict(false);

// render react DOM
ReactDOM.render(
  <Provider {...state.stores} >
    <Root>
      <Router history={state.routerStore.history} >
        <div>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/app">App</Link></li>
            <li><Link to="/404">Not found</Link></li>
          </ul>
          <Switch>
            <Route exact={true} path="/" component={App} />
            <Route exact={false} path="/app" component={App} />
            <Route exact={true} path="/404" component={NotFound} />
            <Route path="*" component={NotFound} />
          </Switch>
        </div>
      </Router>
    </Root>
  </Provider >,
  document.getElementById('root')
);

// ReactDOM.render(
//   <App foo="asd" />,
//   document.getElementById('root') as HTMLElement
// );
registerServiceWorker();
