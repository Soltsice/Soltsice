
import { BigNumber } from 'bignumber.js';
import { W3, SoltsiceContract } from '..';

/**
 * Migrations API
 */
export class Migrations extends SoltsiceContract {
    constructor(
        deploymentParams: string | W3.TC.TxParams | object,
        ctorParams?: {},
        web3?: W3,
        link?: SoltsiceContract[]
    ) {
        // tslint:disable-next-line:max-line-length
        super(
            web3,
            require('../artifacts/Migrations.json'), 
            ctorParams ? [] : [], 
            deploymentParams,
            link
        );
    }

    /*
        Contract methods
    */
    
    public get upgrade() {
        let ___call = (new_address: string, txParams?: W3.TC.TxParams): Promise<W3.TC.TransactionResult> => {
            txParams = txParams || this._sendParams;
            return new Promise((resolve, reject) => {
                this._instance.then((inst) => {
                    inst.upgrade(new_address, txParams)
                        .then((res) => resolve(res))
                        .catch((err) => reject(err));
                });
            });
        };
        let ___data = (new_address: string): Promise<string> => {
            return new Promise((resolve, reject) => {
                this._instance.then((inst) => {
                    resolve(inst.upgrade.request(new_address).params[0].data);
                });
            });
        };
        let ___gas = (new_address: string): Promise<number> => {
            return new Promise((resolve, reject) => {
                this._instance.then((inst) => {
                    inst.upgrade.estimateGas(new_address).then((g) => resolve(g));
                });
            });
        };
        let method = Object.assign(___call, { data: ___data }, {estimateGas: ___gas});
        return method;
    }


    
    // tslint:disable-next-line:variable-name
    public last_completed_migration(): Promise<BigNumber> {
        return new Promise((resolve, reject) => {
            this._instance.then((inst) => {
                inst.last_completed_migration
                    .call()
                    .then((res) => resolve(res))
                    .catch((err) => reject(err));
            });
        });
    }
    
    // tslint:disable-next-line:variable-name
    public owner(): Promise<string> {
        return new Promise((resolve, reject) => {
            this._instance.then((inst) => {
                inst.owner
                    .call()
                    .then((res) => resolve(res))
                    .catch((err) => reject(err));
            });
        });
    }
    
    public get setCompleted() {
        let ___call = (completed: BigNumber, txParams?: W3.TC.TxParams): Promise<W3.TC.TransactionResult> => {
            txParams = txParams || this._sendParams;
            return new Promise((resolve, reject) => {
                this._instance.then((inst) => {
                    inst.setCompleted(completed, txParams)
                        .then((res) => resolve(res))
                        .catch((err) => reject(err));
                });
            });
        };
        let ___data = (completed: BigNumber): Promise<string> => {
            return new Promise((resolve, reject) => {
                this._instance.then((inst) => {
                    resolve(inst.setCompleted.request(completed).params[0].data);
                });
            });
        };
        let ___gas = (completed: BigNumber): Promise<number> => {
            return new Promise((resolve, reject) => {
                this._instance.then((inst) => {
                    inst.setCompleted.estimateGas(completed).then((g) => resolve(g));
                });
            });
        };
        let method = Object.assign(___call, { data: ___data }, {estimateGas: ___gas});
        return method;
    }


    
}
