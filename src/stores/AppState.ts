import { observable } from 'mobx';
import * as W3 from '../lib/W3/';

import { isProduction, testAccounts } from '../constants';

export class AppState {
  @observable timer = 0;
  constructor() {
    setInterval(() => {
      this.timer += 1;
    }, 1000);

    let p2 = new W3.Web3.providers.HttpProvider('http://localhost:8545');

    let web3: W3.Web3 = new W3.Web3();
    console.log(web3.eth);
    web3.getAccounts().then( (result: string[]) => {
        console.log('Original Accounts', result);
        return result;
    }).catch(error => {
      console.error('Original Accounts error', error);
    });

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

    // console.log('Block number: ', (web3.eth as any).blockNumber);
    let lb: number = 0;
    console.log(`Getting Ethereum block number`);

    let f = async function () {
      try {
        let result = await web3.eth.getBlockNumber();
        console.log('result', result);
        return;
      } catch (error) {
        console.error('error', error);
        return;
      }
    };

    f().then(() => console.log('done'));

    web3.eth.getBlockNumber((error, result) => {
      if (!error) {
        lb = result;
        console.log('result', result);
      } else {
        console.error('error', error);
      }
    });
    console.log('Syncing: ', web3.web3.eth.syncing);
    web3.eth.getBlock(lb, false, (error, result) => {
      if (!error) {
        console.log('Block: ', result);
      } else {
        console.error(error);
      }
    });

    console.log('Accounts: ', web3.eth.accounts);

    console.log('isProduction: ', isProduction);

    console.table('test accounts: ', testAccounts);

  }

  resetTimer() {
    this.timer = 0;
  }

}

export default AppState;