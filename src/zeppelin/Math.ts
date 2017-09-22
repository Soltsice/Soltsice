
import { W3, SoltsiceContract } from '..';

/**
 * Math API
 */
export class Math extends SoltsiceContract {
    constructor(
        web3: W3,
        deploymentParams?: string | W3.TC.TxParams,
        ctorParams?: {}
    ) {
        super(web3, '../../build/contracts/Math.json', [], deploymentParams)
    }

    /*
        Contract methods
    */
    
}
