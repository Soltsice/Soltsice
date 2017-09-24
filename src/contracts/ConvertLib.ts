
import { BigNumber } from 'bignumber.js';
import { W3, SoltsiceContract } from '..';

/**
 * ConvertLib API
 */
export class ConvertLib extends SoltsiceContract {
    constructor(
        web3: W3,
        deploymentParams: string | W3.TC.TxParams,
        ctorParams?: {}
    ) {
        // tslint:disable-next-line:max-line-length
        super(
            web3,
            require('../artifacts/ConvertLib.json'), 
            [], 
            deploymentParams
        );
    }

    /*
        Contract methods
    */
    
    // tslint:disable-next-line:variable-name
    convert(amount: BigNumber, conversionRate: BigNumber): Promise<BigNumber> {
        return new Promise((resolve, reject) => {
            this._instance.then((inst) => {
                inst.convert(amount, conversionRate)
                    .then((res) => resolve(res))
                    .catch((err) => reject(err));
            });
        });
    }
    
}
