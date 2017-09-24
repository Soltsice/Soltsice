
import { BigNumber } from 'bignumber.js';
import { W3, SoltsiceContract } from '..';

/**
 * MetaCoin API
 */
export class MetaCoin extends SoltsiceContract {
    constructor(
        web3: W3,
        deploymentParams: string | W3.TC.TxParams,
        ctorParams?: {}
    ) {
        // tslint:disable-next-line:max-line-length
        super(
            web3,
            require('../artifacts/MetaCoin.json'), 
            [], 
            deploymentParams
        );
    }

    /*
        Contract methods
    */
    
    // tslint:disable-next-line:variable-name
    getBalanceInEth(addr: string): Promise<BigNumber> {
        return new Promise((resolve, reject) => {
            this._instance.then((inst) => {
                inst.getBalanceInEth(addr)
                    .then((res) => resolve(res))
                    .catch((err) => reject(err));
            });
        });
    }
    
    // tslint:disable-next-line:variable-name
    sendCoin(receiver: string, amount: BigNumber): Promise<boolean> {
        return new Promise((resolve, reject) => {
            this._instance.then((inst) => {
                inst.sendCoin(receiver, amount)
                    .then((res) => resolve(res))
                    .catch((err) => reject(err));
            });
        });
    }
    
    // tslint:disable-next-line:variable-name
    getBalance(addr: string): Promise<BigNumber> {
        return new Promise((resolve, reject) => {
            this._instance.then((inst) => {
                inst.getBalance(addr)
                    .then((res) => resolve(res))
                    .catch((err) => reject(err));
            });
        });
    }
    
}
