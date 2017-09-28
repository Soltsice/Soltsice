import contract = require('truffle-contract');
import { W3 } from './W3';

/**
 * CustomContract API
 */
export class SoltsiceContract {
    public address: string;
    public transactionHash: string;
    protected web3: W3;
    /** Truffle-contract instance. Use it if Soltsice doesn't support some features yet */
    protected _instance: Promise<any>;
    protected constructor(
        web3?: W3,
        tokenArtifacts?: any,
        constructorParams?: W3.TC.ContractDataType[],
        deploymentParams?: string | W3.TC.TxParams | object,
    ) {
        if (!deploymentParams) {
            throw 'Generated classes must require deploymentParams in their ctor (TODO refactor this parent ctor)'
        }
        if (typeof deploymentParams === 'string' && !W3.isValidAddress(deploymentParams as string)) {
            throw 'Invalid deployed contract address';
        }
        if (!web3) {
            web3 = W3.Default;
        }
        this.web3 = web3;
        let Contract = contract(tokenArtifacts);
        Contract.setProvider(web3.currentProvider);

        if (typeof deploymentParams !== 'string') {
            Contract.defaults(deploymentParams);
        }

        function instanceOfTxParams(obj: any): obj is W3.TC.TxParams {
            return 'from' in obj && 'gas' in obj && 'gasPrice' in obj && 'value' in obj;
        }

        let instance = new Promise((resolve, reject) => {
            if (typeof deploymentParams === 'string') {
                console.log('USING DEPLOYED: ', this.constructor.name);
                this.address = deploymentParams!;
                this._instance = Contract.at(this.address).then((inst) => {
                    this.address = inst.address;
                    this.transactionHash = inst.transactionHash;
                    resolve(inst);
                }).catch((err) => {
                    reject(err);
                });
            } else if (instanceOfTxParams(deploymentParams)) {
                console.log('NEW CONTRACT: ', this.constructor.name);
                this._instance = Contract.new(...constructorParams!, deploymentParams).then((inst) => {
                    console.log('NEW ADDRESS', inst.address);
                    this.address = inst.address;
                    this.transactionHash = inst.transactionHash;
                    resolve(inst);
                }).catch((err) => {
                    reject(err);
                });
            } else {
                this.address = deploymentParams['address'];
                resolve(deploymentParams);
            }
        });

        this._instance = instance;
    }

    get instance(): Promise<any> { return this._instance };

}
