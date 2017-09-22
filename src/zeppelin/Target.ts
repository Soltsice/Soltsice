
import { W3, SoltsiceContract } from '..';

/**
 * Target API
 */
export class Target extends SoltsiceContract {
    constructor(
        web3: W3,
        deploymentParams?: string | W3.TC.TxParams,
        ctorParams?: {}
    ) {
        super(web3, '../../build/contracts/Target.json', [], deploymentParams)
    }

    /*
        Contract methods
    */
    
    // tslint:disable-next-line:variable-name
    checkInvariant(): Promise<boolean> {
        return new Promise((resolve, reject) => {
            this._instance.then((inst) => {
                inst.checkInvariant()
                    .then((res) => resolve(res))
                    .catch((err) => reject(err));
            });
        });
    }
    
}
