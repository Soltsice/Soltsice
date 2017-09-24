
import { W3, SoltsiceContract } from '..';

/**
 * Ownable API
 */
export class Ownable extends SoltsiceContract {
    constructor(
        web3: W3,
        deploymentParams: string | W3.TC.TxParams,
        ctorParams?: {}
    ) {
        // tslint:disable-next-line:max-line-length
        super(
            web3,
            require('../artifacts/Ownable.json'), 
            [], 
            deploymentParams
        );
    }

    /*
        Contract methods
    */
    
    // tslint:disable-next-line:variable-name
    owner(): Promise<string> {
        return new Promise((resolve, reject) => {
            this._instance.then((inst) => {
                inst.owner
                    .call()
                    .then((res) => resolve(res))
                    .catch((err) => reject(err));
            });
        });
    }
    
    // tslint:disable-next-line:variable-name
    transferOwnership(newOwner: string): Promise<void> {
        return new Promise((resolve, reject) => {
            this._instance.then((inst) => {
                inst.transferOwnership(newOwner)
                    .then((res) => resolve(res))
                    .catch((err) => reject(err));
            });
        });
    }
    
}
