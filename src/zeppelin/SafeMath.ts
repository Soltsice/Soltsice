
import { W3, SoltsiceContract } from '..';

/**
 * SafeMath API
 */
export class SafeMath extends SoltsiceContract {
    constructor(
        web3: W3,
        deploymentParams?: string | W3.TC.TxParams,
        ctorParams?: {}
    ) {
        super(web3, '../../build/contracts/SafeMath.json', [], deploymentParams)
    }

    /*
        Contract methods
    */
    
}
