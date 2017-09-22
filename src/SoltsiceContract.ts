import contract = require('truffle-contract');
import { W3 } from './W3';

/**
 * CustomContract API
 */
export class SoltsiceContract {
    public address: string;
    protected web3: W3;
    protected instance: Promise<any>;
    protected constructor(
        web3: W3,
        tokenArtifactsPath: string,
        constructorParams: W3.TC.ContractDataType[],
        deploymentParams?: string | W3.TC.TxParams,
    ) {
        if (typeof deploymentParams === 'string' && !W3.isValidAddress(deploymentParams as string)) {
            throw 'Invalid deployed contract address';
        }
        this.web3 = web3;
        let tokenArtifacts = require(tokenArtifactsPath);
        let Contract = contract(tokenArtifacts);
        Contract.setProvider(web3.currentProvider);

        if (typeof deploymentParams !== 'string') {
            Contract.defaults(deploymentParams);
        }

        let instance = new Promise((resolve, reject) => {
            if (typeof deploymentParams === 'string' && W3.isValidAddress(deploymentParams)) {
                console.log('USING DEPLOYED: ', this.constructor.name);
                this.address = deploymentParams!;
                this.instance = Contract.at(this.address).then((inst) => {
                    resolve(inst);
                }).catch((err) => {
                    reject(err);
                });
            } else {
                console.log('NEW CONTRACT: ', this.constructor.name);
                this.instance = Contract.new(constructorParams).then((inst) => {
                    console.log('NEW ADDRESS', inst.address);
                    resolve(inst);
                }).catch((err) => {
                    reject(err);
                });
            }
        });

        this.instance = instance;
    }

}
