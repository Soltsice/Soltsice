
import { W3, SoltsiceContract } from '..';

/**
 * Math API
 */
export class Math extends SoltsiceContract {
    constructor(
        web3: W3,
        constructorParams: W3.TC.ContractDataType[],
        deploymentParams?: string | W3.TC.TxParams
    ) {
        super(web3, '../../build/contracts/Math.json', constructorParams, deploymentParams)
    }

    /*
        Contract methods
    */
    
}
