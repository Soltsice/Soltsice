import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as W3 from './types/web3/index.d';
import App from './App';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App />, div);
});

it('could use types from web3', () => {
  
  console.log(web3);

  if (typeof web3 !== 'undefined' && typeof web3.currentProvider !== 'undefined') {
    web3 = new Web3(web3.currentProvider);
  } else {
    var web3: W3.Web3 = require('web3');
    // set the provider you want from Web3.providers
    web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
  }

  console.log('Getting Ethereum block number');
  web3.eth.getBlock(1, false, (error, result) => {
    if (!error) {
      console.log(result);
    } else {
      console.error(error);
    }
  });
  
});