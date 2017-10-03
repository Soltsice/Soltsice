
import { W3, SoltsiceContract } from '..';

/**
 * Ownable API
 */
export class Ownable extends SoltsiceContract {
    constructor(
        deploymentParams: string | W3.TC.TxParams | object,
        ctorParams?: {},
        web3?: W3,
        link?: SoltsiceContract[]
    ) {
        // tslint:disable-next-line:max-line-length
        super(
            web3,
            require('../artifacts/Ownable.json'),
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
    
    public get transferOwnership() {
        // tslint:disable-next-line:max-line-length
        // tslint:disable-next-line:variable-name
        let ___call = (newOwner: string, txParams?: W3.TC.TxParams): Promise<W3.TC.TransactionResult> => {
            txParams = txParams || this._sendParams;
            return new Promise((resolve, reject) => {
                this._instance.then((inst) => {
                    inst.transferOwnership(newOwner, txParams)
                        .then((res) => resolve(res))
                        .catch((err) => reject(err));
                });
            });
        };
        // tslint:disable-next-line:max-line-length
        // tslint:disable-next-line:variable-name
        let ___tx = (newOwner: string, txParams?: W3.TC.TxParams): Promise<string> => {
            txParams = txParams || this._sendParams;
            return new Promise((resolve, reject) => {
                this._instance.then((inst) => {
                    inst.transferOwnership.sendTransaction(newOwner, txParams)
                        .then((res) => resolve(res))
                        .catch((err) => reject(err));
                });
            });
        };
        // tslint:disable-next-line:max-line-length
        // tslint:disable-next-line:variable-name
        let ___data = (newOwner: string): Promise<string> => {
            return new Promise((resolve, reject) => {
                this._instance.then((inst) => {
                    resolve(inst.transferOwnership.request(newOwner).params[0].data);
                });
            });
        };
        // tslint:disable-next-line:max-line-length
        // tslint:disable-next-line:variable-name
        let ___gas = (newOwner: string): Promise<number> => {
            return new Promise((resolve, reject) => {
                this._instance.then((inst) => {
                    inst.transferOwnership.estimateGas(newOwner).then((g) => resolve(g));
                });
            });
        };
        let method = Object.assign(___call, { data: ___data }, {estimateGas: ___gas}, {sendTransaction: ___tx});
        return method;
    }
    
}
