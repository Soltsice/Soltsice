
import { W3, SoltsiceContract } from '..';

/**
 * CanReclaimToken API
 */
export class CanReclaimToken extends SoltsiceContract {
    constructor(
        web3: W3,
        constructorParams: W3.TC.ContractDataType[],
        deploymentParams?: string | W3.TC.TxParams
    ) {
        super(web3, '../../build/contracts/CanReclaimToken.json', constructorParams, deploymentParams)
    }

    /*
        Contract methods
    */
    
    // tslint:disable-next-line:variable-name
    reclaimToken(token: string): Promise<void> {
        return new Promise((resolve, reject) => {
            this.instance.then((inst) => {
                inst.reclaimToken(token)
                    .then((res) => resolve(res))
                    .catch((err) => reject(err));
            });
        });
    }
    
    // tslint:disable-next-line:variable-name
    owner(): Promise<string> {
        return new Promise((resolve, reject) => {
            this.instance.then((inst) => {
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
            this.instance.then((inst) => {
                inst.transferOwnership(newOwner)
                    .then((res) => resolve(res))
                    .catch((err) => reject(err));
            });
        });
    }
    
}
