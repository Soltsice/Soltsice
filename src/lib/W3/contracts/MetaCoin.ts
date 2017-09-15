
import { default as contract } from 'truffle-contract';
import { BigNumber } from 'bignumber.js';
import { Web3 } from '..';

/**
 * MetaCoin API
 */
export class MetaCoin {
    public address: string;
    private web3: Web3;
    private instance: Promise<any>;
    constructor(
        web3: Web3,
        deploymentParams?: string | Web3.TC.TxParams,
        ctorParams?: {}
    ) {
        if (typeof deploymentParams === 'string' && !Web3.isValidAddress(deploymentParams as string)) {
            throw 'Invalid deployed contract address';
        }

        this.web3 = web3;
        let tokenArtifacts = require('../../../contracts/MetaCoin.json');

        let Contract = contract(tokenArtifacts);
        Contract.setProvider(web3.currentProvider);

        if (typeof deploymentParams !== 'string') {
            Contract.defaults(deploymentParams);
        }

        let instance = new Promise((resolve, reject) => {
            if (typeof deploymentParams === 'string' && Web3.isValidAddress(deploymentParams)) {
                console.log('USING DEPLOYED: ', 'MetaCoin');
                this.address = deploymentParams!;
                this.instance = Contract.at(this.address).then((inst) => {
                    resolve(inst);
                }).catch((err) => {
                    reject(err);
                });
            } else {
                console.log('NEW CONTRACT: ', 'MetaCoin');
                // tslint:disable-next-line:max-line-length
                this.instance = Contract.new([] as Web3.TC.ContractDataType[]).then((inst) => {
                    console.log('NEW ADDRESS', inst.address);
                    resolve(inst);
                }).catch((err) => {
                    reject(err);
                });
            }
        });

        this.instance = instance;
    }

    /*
        Contract methods
    */
    
    // tslint:disable-next-line:variable-name
    getBalanceInEth(addr: string): Promise<BigNumber> {
        return new Promise((resolve, reject) => {
            this.instance.then((inst) => {
                inst.getBalanceInEth(addr)
                    .then((res) => resolve(res))
                    .catch((err) => reject(err));
            });
        });
    }
    
    // tslint:disable-next-line:variable-name
    sendCoin(receiver: string, amount: BigNumber): Promise<boolean> {
        return new Promise((resolve, reject) => {
            this.instance.then((inst) => {
                inst.sendCoin(receiver, amount)
                    .then((res) => resolve(res))
                    .catch((err) => reject(err));
            });
        });
    }
    
    // tslint:disable-next-line:variable-name
    getBalance(addr: string): Promise<BigNumber> {
        return new Promise((resolve, reject) => {
            this.instance.then((inst) => {
                inst.getBalance(addr)
                    .then((res) => resolve(res))
                    .catch((err) => reject(err));
            });
        });
    }
    
}
