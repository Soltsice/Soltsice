
import { BigNumber } from 'bignumber.js';
import { W3, SoltsiceContract } from '..';

/**
 * DummyContract API
 */
export class DummyContract extends SoltsiceContract {
    constructor(
        deploymentParams: string | W3.TC.TxParams | object,
        ctorParams?: {_secret: BigNumber, _wellKnown: BigNumber},
        web3?: W3,
    ) {
        // tslint:disable-next-line:max-line-length
        super(
            web3,
            require('../artifacts/DummyContract.json'), 
            ctorParams ? [ctorParams!._secret, ctorParams!._wellKnown] : [], 
            deploymentParams
        );
    }

    /*
        Contract methods
    */
    
    // tslint:disable-next-line:variable-name
    public getPublic(): Promise<BigNumber> {
        return new Promise((resolve, reject) => {
            this._instance.then((inst) => {
                inst.getPublic
                    .call()
                    .then((res) => resolve(res))
                    .catch((err) => reject(err));
            });
        });
    }
    
    public get setPublic() {
        let call = (_newValue: BigNumber): Promise<W3.TC.TransactionResult> => {
            return new Promise((resolve, reject) => {
                this._instance.then((inst) => {
                    inst.setPublic(_newValue)
                        .then((res) => resolve(res))
                        .catch((err) => reject(err));
                });
            })
        };
        let data = (_newValue: BigNumber): Promise<string> => {
            return new Promise((resolve, reject) => {
                this._instance.then((inst) => {
                    resolve(inst.setPublic.request(_newValue).params[0].data);
                });
            });
        };
        let method = Object.assign(call, { data: data });
        return method;
    }


    
    public get setPrivate() {
        let call = (_newValue: BigNumber): Promise<W3.TC.TransactionResult> => {
            return new Promise((resolve, reject) => {
                this._instance.then((inst) => {
                    inst.setPrivate(_newValue)
                        .then((res) => resolve(res))
                        .catch((err) => reject(err));
                });
            })
        };
        let data = (_newValue: BigNumber): Promise<string> => {
            return new Promise((resolve, reject) => {
                this._instance.then((inst) => {
                    resolve(inst.setPrivate.request(_newValue).params[0].data);
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
    
    // tslint:disable-next-line:variable-name
    public getPrivate(): Promise<BigNumber> {
        return new Promise((resolve, reject) => {
            this._instance.then((inst) => {
                inst.getPrivate
                    .call()
                    .then((res) => resolve(res))
                    .catch((err) => reject(err));
            });
        });
    }
    
    // tslint:disable-next-line:variable-name
    public wellKnown(): Promise<BigNumber> {
        return new Promise((resolve, reject) => {
            this._instance.then((inst) => {
                inst.wellKnown
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
