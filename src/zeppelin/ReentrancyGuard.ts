
import { W3, SoltsiceContract } from '..';

/**
 * ReentrancyGuard API
 */
export class ReentrancyGuard extends SoltsiceContract {
    constructor(
        web3: W3,
        constructorParams: W3.TC.ContractDataType[],
        deploymentParams?: string | W3.TC.TxParams
    ) {
        super(web3, '../../build/contracts/ReentrancyGuard.json', constructorParams, deploymentParams)
    }

    /*
        Contract methods
    */
    
}
