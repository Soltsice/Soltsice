
import { default as contract } from 'truffle-contract';
import { BigNumber } from 'bignumber.js';
import { Web3 } from '..';

/**
 * ERC20Basic API
 */
export class ERC20Basic {
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
        let tokenArtifacts = require('../../../contracts/ERC20Basic.json');

        let Contract = contract(tokenArtifacts);
        Contract.setProvider(web3.currentProvider);

        if (typeof deploymentParams !== 'string') {
            Contract.defaults(deploymentParams);
        }

        let instance = new Promise((resolve, reject) => {
            if (typeof deploymentParams === 'string' && Web3.isValidAddress(deploymentParams)) {
                console.log('USING DEPLOYED: ', 'ERC20Basic');
                this.address = deploymentParams!;
                this.instance = Contract.at(this.address).then((inst) => {
                    resolve(inst);
                }).catch((err) => {
                    reject(err);
                });
            } else {
                console.log('NEW CONTRACT: ', 'ERC20Basic');
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
    totalSupply(): Promise<BigNumber> {
        return new Promise((resolve, reject) => {
            this.instance.then((inst) => {
                inst.totalSupply
                    .call()
                    .then((res) => resolve(res))
                    .catch((err) => reject(err));
            });
        });
    }
    
    // tslint:disable-next-line:variable-name
    balanceOf(who: string): Promise<BigNumber> {
        return new Promise((resolve, reject) => {
            this.instance.then((inst) => {
                inst.balanceOf
                    .call(who)
                    .then((res) => resolve(res))
                    .catch((err) => reject(err));
            });
        });
    }
    
    // tslint:disable-next-line:variable-name
    transfer(to: string, value: BigNumber): Promise<boolean> {
        return new Promise((resolve, reject) => {
            this.instance.then((inst) => {
                inst.transfer(to, value)
                    .then((res) => resolve(res))
                    .catch((err) => reject(err));
            });
        });
    }
    
}
