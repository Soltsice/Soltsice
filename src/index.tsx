import './index.css';

import * as React from 'react';
import * as ReactDOM from 'react-dom';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import lightBaseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';

import { useStrict } from 'mobx';
import { Provider, observer } from 'mobx-react';
import { Router, Route, Switch } from 'react-router';
import { Link } from 'react-router-dom';

import { Root } from './containers/Root';
// import App from './App';
// import registerServiceWorker from './registerServiceWorker';
// import unregister from './registerServiceWorker';
import * as store from './stores';

import { LoginButton } from './components/LoginButton';
import { AuthHtml, AuthHtmlSilent } from './components/Auth';
import { App } from './components/App';
import { NotFound } from './components/NotFound';

// enable MobX strict mode
useStrict(true);

const userStore = store.stores[store.STORE_USER] as store.UserStore;

const muiTheme = getMuiTheme(lightBaseTheme);

@observer
class Index extends React.Component {
  render() {
    return (
      <Provider {...store.stores} >
        <MuiThemeProvider muiTheme={muiTheme}>
          <Root>
            <Router history={store.routerStore.history} >
              {userStore.isLoggedIn ?
                <div>
                  <ul>
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/app">App</Link></li>
                    <li><Link to="/404">Not found</Link></li>
                  </ul>
                  <Switch>
                    <Route exact={true} path="/" component={App} />
                    <Route exact={false} path="/auth.silent.html" component={AuthHtmlSilent} />
                    <Route exact={false} path="/auth.html" component={AuthHtml} />
                    <Route exact={false} path="/app" component={App} />
                    <Route exact={true} path="/404" component={NotFound} />
                    {/* <Route path="*" component={NotFound} /> */}
                  </Switch>
                </div>
                :
                <Switch>
                  <Route exact={false} path="/auth.silent.html" component={AuthHtmlSilent} />
                  <Route exact={false} path="/auth.html" component={AuthHtml} />
                  <Route path="*" component={LoginButton} />
                </Switch>
              }
            </Router>
          </Root>
        </MuiThemeProvider>
      </Provider >
    );
  }
}

// render react DOM
ReactDOM.render(<Index />, document.getElementById('root')
);

// ReactDOM.render(
//   <App foo="asd" />,
//   document.getElementById('root') as HTMLElement
// );
// registerServiceWorker();
// unregister();
