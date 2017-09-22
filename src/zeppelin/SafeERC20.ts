
import { W3, SoltsiceContract } from '..';

/**
 * SafeERC20 API
 */
export class SafeERC20 extends SoltsiceContract {
    constructor(
        web3: W3,
        deploymentParams?: string | W3.TC.TxParams,
        ctorParams?: {}
    ) {
        super(web3, '../../build/contracts/SafeERC20.json', [], deploymentParams)
    }

    /*
        Contract methods
    */
    
}
