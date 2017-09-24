
import { W3, SoltsiceContract } from '..';

/**
 * SafeMath API
 */
export class SafeMath extends SoltsiceContract {
    constructor(
        web3: W3,
        deploymentParams: string | W3.TC.TxParams,
        ctorParams?: {}
    ) {
        // tslint:disable-next-line:max-line-length
        super(
            web3,
            require('../artifacts/SafeMath.json'), 
            [], 
            deploymentParams
        );
    }

    /*
        Contract methods
    */
    
}
