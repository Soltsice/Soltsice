import { default as contract } from 'truffle-contract';
import * as W3 from './W3';
// import { ERC20 } from './ERC20';
import { BigNumber } from 'bignumber.js';

/**
 * ERC20 and custom methods on DBrain token
 */
export class DBrainToken { // implements ERC20
    public address: string;
    private web3: W3.Web3;
    private instance: Promise<any>;
    constructor(web3: W3.Web3, from: string, multisig: string, deployedContractAddress?: string) {
        if (!this.isValidAddress(from)) {
            throw 'Invalid from address';
        }
        if (!this.isValidAddress(multisig)) {
            throw 'Invalid multisig address';
        }
        if (deployedContractAddress && !this.isValidAddress(deployedContractAddress)) {
            throw 'Invalid deployed contract address';
        }

        this.web3 = web3;

        let tokenArtifacts = require('../../contracts/DBrainToken.json');
        
        let Token = contract(tokenArtifacts);
        Token.setProvider(web3.currentProvider);
        Token.defaults({
            from: from,
            gas: 4712388,
            gasPrice: 100000000000,
            value: 0
        });

        // console.log('TOKEN', JSON.stringify(Token));

        let instance = new Promise((resolve, reject) => {
            if (this.isValidAddress(deployedContractAddress)) {
                console.log('DEPLOYED');
                this.address = deployedContractAddress!;
                this.instance = Token.at(this.address).then((inst) => {
                    resolve(inst);
                }).catch((err) => {
                    reject(err);
                });
            } else {
                console.log('NEW CONTRACT');
                // tokenArtifacts = Object.assign(tokenArtifacts,
                //     { address: '0x3d0d809619d6b2857cfc4384d563c90fc650f0b2' }
                // );
                this.instance = Token.new([multisig]).then((inst) => {
                    console.log('NEW ADDRESS', inst.address);
                    resolve(inst);
                }).catch((err) => {
                    reject(err);
                });
            }
        });

        this.instance = instance;
    }

    totalSupply(): Promise<BigNumber> {
        return new Promise((resolve, reject) => {
            this.instance.then((inst) => {
                inst.totalSupply
                    .call()
                    .then((supply) => resolve(supply))
                    .catch((err) => reject(err));
            });
        });
    }

    /**
     * Total token supply without decimals returned as formatted string.
     */
    async totalSupplySting(): Promise<string> {
        return (await this.totalSupply()).dividedBy(1e18).toFormat(0);
    }

    private isValidAddress(address?: string): boolean {
        if (address && address.startsWith('0x') && address.length === 42) {
            return true;
        }
        return false;
    }
}