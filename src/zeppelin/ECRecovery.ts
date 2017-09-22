
import { W3, SoltsiceContract } from '..';

/**
 * ECRecovery API
 */
export class ECRecovery extends SoltsiceContract {
    constructor(
        web3: W3,
        constructorParams: W3.TC.ContractDataType[],
        deploymentParams?: string | W3.TC.TxParams
    ) {
        super(web3, '../../build/contracts/ECRecovery.json', constructorParams, deploymentParams)
    }

    /*
        Contract methods
    */
    
    // tslint:disable-next-line:variable-name
    recover(hash: any, sig: string): Promise<string> {
        return new Promise((resolve, reject) => {
            this.instance.then((inst) => {
                inst.recover
                    .call(hash, sig)
                    .then((res) => resolve(res))
                    .catch((err) => reject(err));
            });
        });
    }
    
}
