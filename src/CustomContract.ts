import { BigNumber } from 'bignumber.js';
import { W3 } from './W3';
import { SoltsiceContract } from './SoltsiceContract'

/**
 * CustomContract API
 */
export class CustomContract extends SoltsiceContract {
    constructor(
        web3: W3,
        constructorParams: W3.TC.ContractDataType[],
        deploymentParams?: string | W3.TC.TxParams
    ) {
        super(web3, `../../contracts/CustomContract.json`, constructorParams, deploymentParams)
    }

    /*
        Contract methods
    */

    totalSupply(): Promise<BigNumber> {
        return new Promise((resolve, reject) => {
            this.instance.then((inst) => {
                inst.totalSupply
                    .call()
                    .then((res) => resolve(res))
                    .catch((err) => reject(err));
            });
        });
    }
}