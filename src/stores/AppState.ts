import { observable, action } from 'mobx';
import * as W3 from '../lib/W3/';

// import { isProduction, testAccounts } from '../constants';

export class AppState {
  @observable timer = 0;
  constructor() {
    setInterval(() => {
      this.incrementTimer();
    }, 1000);

    // let p2 = new W3.Web3.providers.HttpProvider('http://localhost:8545');

    let web3: W3.Web3 = new W3.Web3();

    let token = new W3.DBrainToken(web3,
      '0xd7126c8c920800706f826df0772d792343cfecca',
      '0xd7126c8c920800706f826df0772d792343cfecca');

    console.log(token);

    token.totalSupplySting().then((res) => {
      console.log('TOTAL SUPPLY', res);
    }).catch((err) => {
      console.log('error in totalSupply call', err);
    });

    web3.version.getNetwork((error, result) => {
      switch (result) {
        case '1':
          console.log('This is mainnet');
          break;
        case '2':
          console.log('This is the deprecated Morden test network.');
          break;
        case '3':
          console.log('This is the Ropsten test network.');
          break;
        case '314':
          console.log('This is testrpc DBrain network with id 314.');
          break;
        default:
          console.log('This is an unknown network with id ', result);
      }
    });

    // console.log(web3.eth);
    // web3.getAccounts().then( (result: string[]) => {
    //     console.log('Original Accounts', result);
    //     return result;
    // }).catch(error => {
    //   console.error('Original Accounts error', error);
    // });

    // // console.log(web3.eth);
    // let cp1 = web3.currentProvider;
    // console.log(web3.currentProvider);
    // console.log(web3.currentProvider.constructor.name);
    // // console.log(new W3());
    // console.log(W3.Web3.providers);
    // console.log(p2);
    // console.log('before');
    // web3.setProvider(p2);
    // console.log('after');

    // console.log(cp1 === web3.currentProvider);
    // console.log(web3.currentProvider.constructor.name);
    // console.log(web3.currentProvider);

    // // console.log('Block number: ', (web3.eth as any).blockNumber);
    // let lb: number = 0;
    // console.log(`Getting Ethereum block number`);

    // let f = async function () {
    //   try {
    //     let result = await web3.eth.getBlockNumber();
    //     console.log('result', result);
    //     return;
    //   } catch (error) {
    //     console.error('error', error);
    //     return;
    //   }
    // };

    // f().then(() => console.log('done'));

    // web3.eth.getBlockNumber((error, result) => {
    //   if (!error) {
    //     lb = result;
    //     console.log('result', result);
    //   } else {
    //     console.error('error', error);
    //   }
    // });
    // console.log('Syncing: ', web3.web3.eth.syncing);
    // web3.eth.getBlock(lb, false, (error, result) => {
    //   if (!error) {
    //     console.log('Block: ', result);
    //   } else {
    //     console.error(error);
    //   }
    // });

    // console.log('Accounts: ', web3.eth.accounts);

    // console.log('isProduction: ', isProduction);

    // console.table('test accounts: ', testAccounts);

  }

  @action
  incrementTimer() {
    this.timer += 1;
  }

  @action
  resetTimer() {
    this.timer = 0;
  }

}

export default AppState;