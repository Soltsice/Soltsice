import { observable, computed, action } from 'mobx';
import * as W3 from '../lib/W3/';

/** Store current network status, accounts and DBrainToken-related info */
export class BlockchainStore {
    @observable
    totalSupply: BigNumber.BigNumber;

    @observable
    web3: W3.Web3;

    @observable
    accounts: string[];

    /** Index of active account to use from accounts property */
    @observable
    selectedAccountIndex: number;

    @computed
    get selectedAccount() {
        return this.accounts[this.selectedAccountIndex];
    }

    @computed
    get hasAccount() {
        return this.accounts.length > 0;
    }

    // its methods return Promises, will need to set store state from it
    @observable
    token: W3.DBrainToken;

    private setUpPromise: Promise<void>;
    private multiSigAddress: string;

    constructor() {
        this.setUpPromise = this.setup();

        this.multiSigAddress = ''; // must be hardcoded somewhere

        // setInterval(() => {
        //     this.update();
        // }, 10000);

        // this.web3 = new W3.Web3();



        let token = new W3.DBrainToken(web3, '0xaaae6c870ea81df05ec84e63ca52fcdbdde86600');

        console.log(token);

        token.totalSupplySting().then((res) => {
            console.log('TOTAL SUPPLY', res);
        }).catch((err) => {
            console.log('error in totalSupply call', err);
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
    async update() {
        // update only after setup is done
        await this.setUpPromise;
    }

    @action
    setAccounts(accounts: string[]) {
        this.accounts = accounts;
        if (accounts.length > 0) {
            this.setAccountIndex(0);
        }
        console.log('ACCOUNTS: ', accounts);
    }

    @action
    setAccountIndex(index: number) {
        if (!this.hasAccount) {
            throw 'No active accounts';
        }
        if (index < 0 || index >= this.accounts.length) {
            throw 'Wrong account index';
        }
        this.selectedAccountIndex = index;
        console.log('ACTIVE ACCOUNT INDEX: ', index);
    }

    @action
    private async setup(): Promise<void> {
        // in production web3 resolution logic is
        // 1. global web3 object from MIST, Metamask, etc
        // 2. local node
        // 3. remote calls via proxy (not implemented yet, will use 
        //    Etherscan or our own API since we need server- side operations on blockchain anyway)
        this.web3 = new W3.Web3();

        this.web3.getAccounts().then((accounts) => {
            this.setAccounts(accounts);
        }).then(() => {
            console.log('object');
        });


    }

}

export default BlockchainStore;