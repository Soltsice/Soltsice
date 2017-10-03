
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
        link?: SoltsiceContract[]
    ) {
        // tslint:disable-next-line:max-line-length
        super(
            web3,
            require('../artifacts/DummyContract.json'), 
            ctorParams ? [ctorParams!._secret, ctorParams!._wellKnown] : [], 
            deploymentParams,
            link
        );
    }

    /*
        Contract methods
    */
    
    // tslint:disable-next-line:max-line-length
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
        // tslint:disable-next-line:max-line-length
        // tslint:disable-next-line:variable-name
        let ___call = (_newValue: BigNumber, txParams?: W3.TC.TxParams): Promise<W3.TC.TransactionResult> => {
            txParams = txParams || this._sendParams;
            return new Promise((resolve, reject) => {
                this._instance.then((inst) => {
                    inst.setPublic(_newValue, txParams)
                        .then((res) => resolve(res))
                        .catch((err) => reject(err));
                });
            });
        };

        // tslint:disable-next-line:max-line-length
        // tslint:disable-next-line:variable-name
        let ___tx = (_newValue: BigNumber, txParams?: W3.TC.TxParams): Promise<string> => {
            txParams = txParams || this._sendParams;
            return new Promise((resolve, reject) => {
                this._instance.then((inst) => {
                    inst.setPublic.sendTransaction(_newValue, txParams)
                        .then((res) => resolve(res))
                        .catch((err) => reject(err));
                });
            });
        };

        // tslint:disable-next-line:max-line-length
        // tslint:disable-next-line:variable-name
        let ___data = (_newValue: BigNumber): Promise<string> => {
            return new Promise((resolve, reject) => {
                this._instance.then((inst) => {
                    resolve(inst.setPublic.request(_newValue).params[0].data);
                });
            });
        };
        // tslint:disable-next-line:max-line-length
        // tslint:disable-next-line:variable-name
        let ___gas = (_newValue: BigNumber): Promise<number> => {
            return new Promise((resolve, reject) => {
                this._instance.then((inst) => {
                    inst.setPublic.estimateGas(_newValue).then((g) => resolve(g));
                });
            });
        };
        let method = Object.assign(___call, { data: ___data }, {estimateGas: ___gas}, {sendTransaction: ___tx});
        return method;
    }
    
    public get setPrivate() {
        // tslint:disable-next-line:max-line-length
        // tslint:disable-next-line:variable-name
        let ___call = (_newValue: BigNumber, txParams?: W3.TC.TxParams): Promise<W3.TC.TransactionResult> => {
            txParams = txParams || this._sendParams;
            return new Promise((resolve, reject) => {
                this._instance.then((inst) => {
                    inst.setPrivate(_newValue, txParams)
                        .then((res) => resolve(res))
                        .catch((err) => reject(err));
                });
            });
        };

        // tslint:disable-next-line:max-line-length
        // tslint:disable-next-line:variable-name
        let ___tx = (_newValue: BigNumber, txParams?: W3.TC.TxParams): Promise<string> => {
            txParams = txParams || this._sendParams;
            return new Promise((resolve, reject) => {
                this._instance.then((inst) => {
                    inst.setPrivate.sendTransaction(_newValue, txParams)
                        .then((res) => resolve(res))
                        .catch((err) => reject(err));
                });
            });
        };

        // tslint:disable-next-line:max-line-length
        // tslint:disable-next-line:variable-name
        let ___data = (_newValue: BigNumber): Promise<string> => {
            return new Promise((resolve, reject) => {
                this._instance.then((inst) => {
                    resolve(inst.setPrivate.request(_newValue).params[0].data);
                });
            });
        };
        // tslint:disable-next-line:max-line-length
        // tslint:disable-next-line:variable-name
        let ___gas = (_newValue: BigNumber): Promise<number> => {
            return new Promise((resolve, reject) => {
                this._instance.then((inst) => {
                    inst.setPrivate.estimateGas(_newValue).then((g) => resolve(g));
                });
            });
        };
        let method = Object.assign(___call, { data: ___data }, {estimateGas: ___gas}, {sendTransaction: ___tx});
        return method;
    }
    
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
    
    // tslint:disable-next-line:max-line-length
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
    
    // tslint:disable-next-line:max-line-length
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
