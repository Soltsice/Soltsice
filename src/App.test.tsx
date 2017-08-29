import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Web3Factory } from './types/web3/index';
import App from './App';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App />, div);
});

it('could use types from web3', () => {
  let web3 = Web3Factory.GetWeb3();
  console.log('Getting Ethereum block number');
  web3.eth.getBlock(1, false, (error, result) => {
    if (!error) {
      console.log(result);
    } else {
      console.error(error);
    }
  });
});