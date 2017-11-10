
import { W3, SoltsiceContract } from '..';

/**
 * Ownable API
 */
export class Ownable extends SoltsiceContract {
    static get Artifacts() { return require('../artifacts/Ownable.json'); }

    static get BytecodeHash() {
        // we need this before ctor, but artifacts are static and we cannot pass it to the base class, so need to generate
        let artifacts = Ownable.Artifacts;
        if (!artifacts || !artifacts.bytecode) {
            return undefined;
        }
        let hash = W3.sha3(JSON.stringify(artifacts.bytecode));
        return hash;
    }

    constructor(
        deploymentParams: string | W3.TC.TxParams | object,
        ctorParams?: {},
        w3?: W3,
        link?: SoltsiceContract[]
    ) {
        // tslint:disable-next-line:max-line-length
        super(
            w3,
            Ownable.Artifacts,
            ctorParams ? [] : [],
            deploymentParams,
            link
        );
    }
    /*
        Contract methods
    */
    
    // tslint:disable-next-line:max-line-length
    // tslint:disable-next-line:variable-name
    public owner(): Promise<string> {
        return new Promise((resolve, reject) => {
            this._instance.then((inst) => {
                inst.owner
                    .call()
                    .then((res) => resolve(res))
                    .catch((err) => reject(err));
            });
        });
    }
    
    // tslint:disable-next-line:member-ordering
    public transferOwnership = Object.assign(
        // tslint:disable-next-line:max-line-length
        // tslint:disable-next-line:variable-name
        (newOwner: string, txParams?: W3.TC.TxParams): Promise<W3.TC.TransactionResult> => {
            return new Promise((resolve, reject) => {
                this._instance.then((inst) => {
                    inst.transferOwnership(newOwner, txParams || this._sendParams)
                        .then((res) => resolve(res))
                        .catch((err) => reject(err));
                });
            });
        },
        {
            // tslint:disable-next-line:max-line-length
            // tslint:disable-next-line:variable-name
            sendTransaction: (newOwner: string, txParams?: W3.TC.TxParams): Promise<string> => {
                return new Promise((resolve, reject) => {
                    this._instance.then((inst) => {
                        inst.transferOwnership.sendTransaction(newOwner, txParams || this._sendParams)
                            .then((res) => resolve(res))
                            .catch((err) => reject(err));
                    });
                });
            }
        },
        {
            // tslint:disable-next-line:max-line-length
            // tslint:disable-next-line:variable-name
            data: (newOwner: string): Promise<string> => {
                return new Promise((resolve, reject) => {
                    this._instance.then((inst) => {
                        resolve(inst.transferOwnership.request(newOwner).params[0].data);
                    });
                });
            }
        },
        {
            // tslint:disable-next-line:max-line-length
            // tslint:disable-next-line:variable-name
            estimateGas: (newOwner: string): Promise<number> => {
                return new Promise((resolve, reject) => {
                    this._instance.then((inst) => {
                        inst.transferOwnership.estimateGas(newOwner).then((g) => resolve(g));
                    });
                });
            }
        });
    
}
