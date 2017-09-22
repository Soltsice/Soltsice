
import { BigNumber } from 'bignumber.js';
import { W3, SoltsiceContract } from '..';

/**
 * HasNoTokens API
 */
export class HasNoTokens extends SoltsiceContract {
    constructor(
        web3: W3,
        deploymentParams?: string | W3.TC.TxParams,
        ctorParams?: {}
    ) {
        super(web3, '../../build/contracts/HasNoTokens.json', [], deploymentParams)
    }

    /*
        Contract methods
    */
    
    // tslint:disable-next-line:variable-name
    reclaimToken(token: string): Promise<void> {
        return new Promise((resolve, reject) => {
            this._instance.then((inst) => {
                inst.reclaimToken(token)
                    .then((res) => resolve(res))
                    .catch((err) => reject(err));
            });
        });
    }
    
    // tslint:disable-next-line:variable-name
    owner(): Promise<string> {
        return new Promise((resolve, reject) => {
            this._instance.then((inst) => {
                inst.owner
                    .call()
                    .then((res) => resolve(res))
                    .catch((err) => reject(err));
            });
        });
    }
    
    // tslint:disable-next-line:variable-name
    tokenFallback(from_: string, value_: BigNumber, data_: string): Promise<void> {
        return new Promise((resolve, reject) => {
            this._instance.then((inst) => {
                inst.tokenFallback(from_, value_, data_)
                    .then((res) => resolve(res))
                    .catch((err) => reject(err));
            });
        });
    }
    
    // tslint:disable-next-line:variable-name
    transferOwnership(newOwner: string): Promise<void> {
        return new Promise((resolve, reject) => {
            this._instance.then((inst) => {
                inst.transferOwnership(newOwner)
                    .then((res) => resolve(res))
                    .catch((err) => reject(err));
            });
        });
    }
    
}
