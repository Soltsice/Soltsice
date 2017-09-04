import * as React from 'react';
import './App.css';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import DevTools from 'mobx-react-devtools';
import * as W3 from './lib/W3/';
const logo = require('./logo.svg');

class AppState {
  @observable timer = 0;
  constructor() {
    setInterval(() => {
      this.timer += 1;
    }, 1000);

    let p2 = new W3.Web3.providers.HttpProvider('http://localhost:8545');
    
    let web3: W3.Web3 = new W3.Web3();

    // console.log(web3.eth);
    let cp1 = web3.currentProvider;
    console.log(web3.currentProvider);
    console.log(web3.currentProvider.constructor.name);
    // console.log(new W3());
    console.log(W3.Web3.providers);
    console.log(p2);
    console.log('before');
    web3.setProvider(p2);
    console.log('after');

    console.log(cp1 === web3.currentProvider);
    console.log(web3.currentProvider.constructor.name);
    console.log(web3.currentProvider);

    console.log('Block number: ', (web3.eth as any).blockNumber);

    web3.eth.getBlock(0, false, (error, result) => {
      if (!error) {
        console.log('Block number: ', result);
      } else {
        console.error(error);
      }
    });
  }

  resetTimer() {
    this.timer = 0;
  }
}

const appState = new AppState();

@observer
class TimerView extends React.Component<{ appState: AppState }, {}> {
  render() {
    return (
      <div>
        <button onClick={this.onReset}>
          Seconds passed: {this.props.appState.timer}
        </button>
        <DevTools />
      </div>
    );
  }

  onReset = () => {
    this.props.appState.resetTimer();
  }
}

class App extends React.Component {
  render() {
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
          <TimerView appState={appState} />
        </div>
      </div>
    );
  }
}

export default App;
