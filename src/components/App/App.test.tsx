import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './App';
import * as W3 from '../../lib/W3/';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App foo="asd" />, div);
  
});

it('could use types from web3', () => {
  // console.log(Web3JS);
  let web3 = new W3.Web3();
  console.log(`Getting Ethereum block number`);
  web3.eth.getBlockNumber((error, result) => {
    if (!error) {
      console.log(result);
    } else {
      console.error(error);
    }
  });
});