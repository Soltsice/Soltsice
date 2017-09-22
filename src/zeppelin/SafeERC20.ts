
import { W3, SoltsiceContract } from '..';

/**
 * SafeERC20 API
 */
export class SafeERC20 extends SoltsiceContract {
    constructor(
        web3: W3,
        constructorParams: W3.TC.ContractDataType[],
        deploymentParams?: string | W3.TC.TxParams
    ) {
        super(web3, '../../build/contracts/SafeERC20.json', constructorParams, deploymentParams)
    }

    /*
        Contract methods
    */
    
}
