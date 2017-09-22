
import { W3, SoltsiceContract } from '..';

/**
 * ReentrancyGuard API
 */
export class ReentrancyGuard extends SoltsiceContract {
    constructor(
        web3: W3,
        deploymentParams?: string | W3.TC.TxParams,
        ctorParams?: {}
    ) {
        super(web3, '../../build/contracts/ReentrancyGuard.json', [], deploymentParams)
    }

    /*
        Contract methods
    */
    
}
