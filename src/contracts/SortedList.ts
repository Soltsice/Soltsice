
import { W3, SoltsiceContract } from '..';

/**
 * SortedList API
 */
export class SortedList extends SoltsiceContract {
    constructor(
        deploymentParams: string | W3.TC.TxParams | object,
        ctorParams?: {},
        web3?: W3,
    ) {
        // tslint:disable-next-line:max-line-length
        super(
            web3,
            require('../artifacts/SortedList.json'), 
            ctorParams ? [] : [], 
            deploymentParams
        );
    }

    /*
        Contract methods
    */
    
    public get iterate() {
        let call = (): Promise<W3.TC.TransactionResult> => {
            return new Promise((resolve, reject) => {
                this._instance.then((inst) => {
                    inst.iterate()
                        .then((res) => resolve(res))
                        .catch((err) => reject(err));
                });
            })
        };
        let data = (): Promise<string> => {
            return new Promise((resolve, reject) => {
                this._instance.then((inst) => {
                    resolve(inst.iterate.request().params[0].data);
                });
            });
        };
        let method = Object.assign(call, { data: data });
        return method;
    }


    
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
        let call = (newOwner: string): Promise<W3.TC.TransactionResult> => {
            return new Promise((resolve, reject) => {
                this._instance.then((inst) => {
                    inst.transferOwnership(newOwner)
                        .then((res) => resolve(res))
                        .catch((err) => reject(err));
                });
            })
        };
        let data = (newOwner: string): Promise<string> => {
            return new Promise((resolve, reject) => {
                this._instance.then((inst) => {
                    resolve(inst.transferOwnership.request(newOwner).params[0].data);
                });
            });
        };
        let method = Object.assign(call, { data: data });
        return method;
    }


    
}
