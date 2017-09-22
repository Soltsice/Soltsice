
import { W3, SoltsiceContract } from '..';

/**
 * MerkleProof API
 */
export class MerkleProof extends SoltsiceContract {
    constructor(
        web3: W3,
        deploymentParams?: string | W3.TC.TxParams,
        ctorParams?: {}
    ) {
        super(web3, '../../build/contracts/MerkleProof.json', [], deploymentParams)
    }

    /*
        Contract methods
    */
    
    // tslint:disable-next-line:variable-name
    verifyProof(_proof: string, _root: any, _leaf: any): Promise<boolean> {
        return new Promise((resolve, reject) => {
            this._instance.then((inst) => {
                inst.verifyProof
                    .call(_proof, _root, _leaf)
                    .then((res) => resolve(res))
                    .catch((err) => reject(err));
            });
        });
    }
    
}
