import './App.css';

import * as React from 'react';
import DevTools from 'mobx-react-devtools';
import { isProduction } from '../../constants';
import * as stores from '../../stores';
import { TimerButton } from '../TimerButton';
import { Route } from 'react-router';
import { Link, match } from 'react-router-dom';

const logo = require('./logo.svg');

interface Props {
  foo: string;
  match?: match<any>;
}

class MyComponent extends React.Component<Props, {}> {
  render() {
    return <span>{this.props.foo}</span>;
  }
}

export class App extends React.Component<Props> {
  render() {
    let m = this.props.match!;
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to React!</h2>
        </div>
        <p className="App-intro">
          To get started, edit <code>src/App.tsx</code> and save to reload.
        </p>
        <div>
          <TimerButton appState={stores.appState} />
        </div>
        <h1>Prod: {String(isProduction)}</h1>
        <div>
          <MyComponent foo={this.props.foo} />
        </div>
        {!isProduction && <DevTools />}
        <Link to="404">Not found </Link>

        <h2>Topics</h2>
        <ul>
          <li>
            <Link to={`${m.url}/rendering`}>
              Rendering with React
        </Link>
          </li>
          <li>
            <Link to={`${m.url}/components`}>
              Components
        </Link>
          </li>
          <li>
            <Link to={`${m.url}/props-v-state`}>
              Props v. State
        </Link>
          </li>
        </ul>
        <Route
          path={`${m.url}/:topicId`}
          component={Topic}
        />
        <Route
          exact={true}
          path={m.url}
          render={() => (
            <h3>No topic {JSON.stringify(m)}</h3>
          )}
        />
      </div>

    );
  }
}

class Topic extends React.Component<Props> {
  render() {
    return (
      <div>
        <h3>{this.props.match!.params.topicId}</h3>
        <p>{JSON.stringify(this.props)}</p>
      </div>
    );
  }
}

export default App;
