
import { BigNumber } from 'bignumber.js';
import { W3, SoltsiceContract } from '..';

/**
 * PullPayment API
 */
export class PullPayment extends SoltsiceContract {
    constructor(
        web3: W3,
        deploymentParams?: string | W3.TC.TxParams,
        ctorParams?: {}
    ) {
        super(web3, '../../build/contracts/PullPayment.json', [], deploymentParams)
    }

    /*
        Contract methods
    */
    
    // tslint:disable-next-line:variable-name
    totalPayments(): Promise<BigNumber> {
        return new Promise((resolve, reject) => {
            this._instance.then((inst) => {
                inst.totalPayments
                    .call()
                    .then((res) => resolve(res))
                    .catch((err) => reject(err));
            });
        });
    }
    
    // tslint:disable-next-line:variable-name
    withdrawPayments(): Promise<void> {
        return new Promise((resolve, reject) => {
            this._instance.then((inst) => {
                inst.withdrawPayments()
                    .then((res) => resolve(res))
                    .catch((err) => reject(err));
            });
        });
    }
    
    // tslint:disable-next-line:variable-name
    payments(_0: string): Promise<BigNumber> {
        return new Promise((resolve, reject) => {
            this._instance.then((inst) => {
                inst.payments
                    .call(_0)
                    .then((res) => resolve(res))
                    .catch((err) => reject(err));
            });
        });
    }
    
}
