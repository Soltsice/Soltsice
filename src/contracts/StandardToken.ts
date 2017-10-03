
import { BigNumber } from 'bignumber.js';
import { W3, SoltsiceContract } from '..';

/**
 * StandardToken API
 */
export class StandardToken extends SoltsiceContract {
    constructor(
        deploymentParams: string | W3.TC.TxParams | object,
        ctorParams?: {},
        web3?: W3,
        link?: SoltsiceContract[]
    ) {
        // tslint:disable-next-line:max-line-length
        super(
            web3,
            require('../artifacts/StandardToken.json'), 
            ctorParams ? [] : [], 
            deploymentParams,
            link
        );
    }

    /*
        Contract methods
    */
    
    public get approve() {
        // tslint:disable-next-line:max-line-length
        // tslint:disable-next-line:variable-name
        let ___call = (_spender: string, _value: BigNumber, txParams?: W3.TC.TxParams): Promise<W3.TC.TransactionResult> => {
            txParams = txParams || this._sendParams;
            return new Promise((resolve, reject) => {
                this._instance.then((inst) => {
                    inst.approve(_spender, _value, txParams)
                        .then((res) => resolve(res))
                        .catch((err) => reject(err));
                });
            });
        };

        // tslint:disable-next-line:max-line-length
        // tslint:disable-next-line:variable-name
        let ___tx = (_spender: string, _value: BigNumber, txParams?: W3.TC.TxParams): Promise<string> => {
            txParams = txParams || this._sendParams;
            return new Promise((resolve, reject) => {
                this._instance.then((inst) => {
                    inst.approve.sendTransaction(_spender, _value, txParams)
                        .then((res) => resolve(res))
                        .catch((err) => reject(err));
                });
            });
        };

        // tslint:disable-next-line:max-line-length
        // tslint:disable-next-line:variable-name
        let ___data = (_spender: string, _value: BigNumber): Promise<string> => {
            return new Promise((resolve, reject) => {
                this._instance.then((inst) => {
                    resolve(inst.approve.request(_spender, _value).params[0].data);
                });
            });
        };
        // tslint:disable-next-line:max-line-length
        // tslint:disable-next-line:variable-name
        let ___gas = (_spender: string, _value: BigNumber): Promise<number> => {
            return new Promise((resolve, reject) => {
                this._instance.then((inst) => {
                    inst.approve.estimateGas(_spender, _value).then((g) => resolve(g));
                });
            });
        };
        let method = Object.assign(___call, { data: ___data }, {estimateGas: ___gas}, {sendTransaction: ___tx});
        return method;
    }
    
    // tslint:disable-next-line:max-line-length
    // tslint:disable-next-line:variable-name
    public totalSupply(): Promise<BigNumber> {
        return new Promise((resolve, reject) => {
            this._instance.then((inst) => {
                inst.totalSupply
                    .call()
                    .then((res) => resolve(res))
                    .catch((err) => reject(err));
            });
        });
    }
    
    public get transferFrom() {
        // tslint:disable-next-line:max-line-length
        // tslint:disable-next-line:variable-name
        let ___call = (_from: string, _to: string, _value: BigNumber, txParams?: W3.TC.TxParams): Promise<W3.TC.TransactionResult> => {
            txParams = txParams || this._sendParams;
            return new Promise((resolve, reject) => {
                this._instance.then((inst) => {
                    inst.transferFrom(_from, _to, _value, txParams)
                        .then((res) => resolve(res))
                        .catch((err) => reject(err));
                });
            });
        };

        // tslint:disable-next-line:max-line-length
        // tslint:disable-next-line:variable-name
        let ___tx = (_from: string, _to: string, _value: BigNumber, txParams?: W3.TC.TxParams): Promise<string> => {
            txParams = txParams || this._sendParams;
            return new Promise((resolve, reject) => {
                this._instance.then((inst) => {
                    inst.transferFrom.sendTransaction(_from, _to, _value, txParams)
                        .then((res) => resolve(res))
                        .catch((err) => reject(err));
                });
            });
        };

        // tslint:disable-next-line:max-line-length
        // tslint:disable-next-line:variable-name
        let ___data = (_from: string, _to: string, _value: BigNumber): Promise<string> => {
            return new Promise((resolve, reject) => {
                this._instance.then((inst) => {
                    resolve(inst.transferFrom.request(_from, _to, _value).params[0].data);
                });
            });
        };
        // tslint:disable-next-line:max-line-length
        // tslint:disable-next-line:variable-name
        let ___gas = (_from: string, _to: string, _value: BigNumber): Promise<number> => {
            return new Promise((resolve, reject) => {
                this._instance.then((inst) => {
                    inst.transferFrom.estimateGas(_from, _to, _value).then((g) => resolve(g));
                });
            });
        };
        let method = Object.assign(___call, { data: ___data }, {estimateGas: ___gas}, {sendTransaction: ___tx});
        return method;
    }
    
    public get decreaseApproval() {
        // tslint:disable-next-line:max-line-length
        // tslint:disable-next-line:variable-name
        let ___call = (_spender: string, _subtractedValue: BigNumber, txParams?: W3.TC.TxParams): Promise<W3.TC.TransactionResult> => {
            txParams = txParams || this._sendParams;
            return new Promise((resolve, reject) => {
                this._instance.then((inst) => {
                    inst.decreaseApproval(_spender, _subtractedValue, txParams)
                        .then((res) => resolve(res))
                        .catch((err) => reject(err));
                });
            });
        };

        // tslint:disable-next-line:max-line-length
        // tslint:disable-next-line:variable-name
        let ___tx = (_spender: string, _subtractedValue: BigNumber, txParams?: W3.TC.TxParams): Promise<string> => {
            txParams = txParams || this._sendParams;
            return new Promise((resolve, reject) => {
                this._instance.then((inst) => {
                    inst.decreaseApproval.sendTransaction(_spender, _subtractedValue, txParams)
                        .then((res) => resolve(res))
                        .catch((err) => reject(err));
                });
            });
        };

        // tslint:disable-next-line:max-line-length
        // tslint:disable-next-line:variable-name
        let ___data = (_spender: string, _subtractedValue: BigNumber): Promise<string> => {
            return new Promise((resolve, reject) => {
                this._instance.then((inst) => {
                    resolve(inst.decreaseApproval.request(_spender, _subtractedValue).params[0].data);
                });
            });
        };
        // tslint:disable-next-line:max-line-length
        // tslint:disable-next-line:variable-name
        let ___gas = (_spender: string, _subtractedValue: BigNumber): Promise<number> => {
            return new Promise((resolve, reject) => {
                this._instance.then((inst) => {
                    inst.decreaseApproval.estimateGas(_spender, _subtractedValue).then((g) => resolve(g));
                });
            });
        };
        let method = Object.assign(___call, { data: ___data }, {estimateGas: ___gas}, {sendTransaction: ___tx});
        return method;
    }
    
    // tslint:disable-next-line:max-line-length
    // tslint:disable-next-line:variable-name
    public balanceOf(_owner: string): Promise<BigNumber> {
        return new Promise((resolve, reject) => {
            this._instance.then((inst) => {
                inst.balanceOf
                    .call(_owner)
                    .then((res) => resolve(res))
                    .catch((err) => reject(err));
            });
        });
    }
    
    public get transfer() {
        // tslint:disable-next-line:max-line-length
        // tslint:disable-next-line:variable-name
        let ___call = (_to: string, _value: BigNumber, txParams?: W3.TC.TxParams): Promise<W3.TC.TransactionResult> => {
            txParams = txParams || this._sendParams;
            return new Promise((resolve, reject) => {
                this._instance.then((inst) => {
                    inst.transfer(_to, _value, txParams)
                        .then((res) => resolve(res))
                        .catch((err) => reject(err));
                });
            });
        };

        // tslint:disable-next-line:max-line-length
        // tslint:disable-next-line:variable-name
        let ___tx = (_to: string, _value: BigNumber, txParams?: W3.TC.TxParams): Promise<string> => {
            txParams = txParams || this._sendParams;
            return new Promise((resolve, reject) => {
                this._instance.then((inst) => {
                    inst.transfer.sendTransaction(_to, _value, txParams)
                        .then((res) => resolve(res))
                        .catch((err) => reject(err));
                });
            });
        };

        // tslint:disable-next-line:max-line-length
        // tslint:disable-next-line:variable-name
        let ___data = (_to: string, _value: BigNumber): Promise<string> => {
            return new Promise((resolve, reject) => {
                this._instance.then((inst) => {
                    resolve(inst.transfer.request(_to, _value).params[0].data);
                });
            });
        };
        // tslint:disable-next-line:max-line-length
        // tslint:disable-next-line:variable-name
        let ___gas = (_to: string, _value: BigNumber): Promise<number> => {
            return new Promise((resolve, reject) => {
                this._instance.then((inst) => {
                    inst.transfer.estimateGas(_to, _value).then((g) => resolve(g));
                });
            });
        };
        let method = Object.assign(___call, { data: ___data }, {estimateGas: ___gas}, {sendTransaction: ___tx});
        return method;
    }
    
    public get increaseApproval() {
        // tslint:disable-next-line:max-line-length
        // tslint:disable-next-line:variable-name
        let ___call = (_spender: string, _addedValue: BigNumber, txParams?: W3.TC.TxParams): Promise<W3.TC.TransactionResult> => {
            txParams = txParams || this._sendParams;
            return new Promise((resolve, reject) => {
                this._instance.then((inst) => {
                    inst.increaseApproval(_spender, _addedValue, txParams)
                        .then((res) => resolve(res))
                        .catch((err) => reject(err));
                });
            });
        };

        // tslint:disable-next-line:max-line-length
        // tslint:disable-next-line:variable-name
        let ___tx = (_spender: string, _addedValue: BigNumber, txParams?: W3.TC.TxParams): Promise<string> => {
            txParams = txParams || this._sendParams;
            return new Promise((resolve, reject) => {
                this._instance.then((inst) => {
                    inst.increaseApproval.sendTransaction(_spender, _addedValue, txParams)
                        .then((res) => resolve(res))
                        .catch((err) => reject(err));
                });
            });
        };

        // tslint:disable-next-line:max-line-length
        // tslint:disable-next-line:variable-name
        let ___data = (_spender: string, _addedValue: BigNumber): Promise<string> => {
            return new Promise((resolve, reject) => {
                this._instance.then((inst) => {
                    resolve(inst.increaseApproval.request(_spender, _addedValue).params[0].data);
                });
            });
        };
        // tslint:disable-next-line:max-line-length
        // tslint:disable-next-line:variable-name
        let ___gas = (_spender: string, _addedValue: BigNumber): Promise<number> => {
            return new Promise((resolve, reject) => {
                this._instance.then((inst) => {
                    inst.increaseApproval.estimateGas(_spender, _addedValue).then((g) => resolve(g));
                });
            });
        };
        let method = Object.assign(___call, { data: ___data }, {estimateGas: ___gas}, {sendTransaction: ___tx});
        return method;
    }
    
    // tslint:disable-next-line:max-line-length
    // tslint:disable-next-line:variable-name
    public allowance(_owner: string, _spender: string): Promise<BigNumber> {
        return new Promise((resolve, reject) => {
            this._instance.then((inst) => {
                inst.allowance
                    .call(_owner, _spender)
                    .then((res) => resolve(res))
                    .catch((err) => reject(err));
            });
        });
    }
    
}
