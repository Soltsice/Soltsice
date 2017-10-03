import { BigNumber } from 'bignumber.js';
import { W3 } from './W3';
import { SoltsiceContract } from './SoltsiceContract'

/**
 * CustomContract API
 */
export class CustomContract extends SoltsiceContract {
    constructor(deploymentParams: string | W3.TC.TxParams | object,
                web3?: W3,
                ctorParams?: { str: string }) {
        super(
            web3,
            require(`../../contracts/CustomContract.json`),
            ctorParams ? [ctorParams!.str] : [],
            deploymentParams
        )
    }

    /*
     Contract methods
     */

    totalSupply(): Promise<BigNumber> {
        return new Promise((resolve, reject) => {
            this._instance.then((inst) => {
                inst.totalSupply
                    .call()
                    .then((res) => resolve(res))
                    .catch((err) => reject(err));
            });
        });
    }
}
