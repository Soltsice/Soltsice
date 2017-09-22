
import { BigNumber } from 'bignumber.js';
import { W3, SoltsiceContract } from '..';

/**
 * DayLimit API
 */
export class DayLimit extends SoltsiceContract {
    constructor(
        web3: W3,
        deploymentParams?: string | W3.TC.TxParams,
        ctorParams?: {_limit: BigNumber}
    ) {
        super(web3, '../../build/contracts/DayLimit.json', [ctorParams!._limit], deploymentParams)
    }

    /*
        Contract methods
    */
    
    // tslint:disable-next-line:variable-name
    dailyLimit(): Promise<BigNumber> {
        return new Promise((resolve, reject) => {
            this._instance.then((inst) => {
                inst.dailyLimit
                    .call()
                    .then((res) => resolve(res))
                    .catch((err) => reject(err));
            });
        });
    }
    
    // tslint:disable-next-line:variable-name
    lastDay(): Promise<BigNumber> {
        return new Promise((resolve, reject) => {
            this._instance.then((inst) => {
                inst.lastDay
                    .call()
                    .then((res) => resolve(res))
                    .catch((err) => reject(err));
            });
        });
    }
    
    // tslint:disable-next-line:variable-name
    spentToday(): Promise<BigNumber> {
        return new Promise((resolve, reject) => {
            this._instance.then((inst) => {
                inst.spentToday
                    .call()
                    .then((res) => resolve(res))
                    .catch((err) => reject(err));
            });
        });
    }
    
}
