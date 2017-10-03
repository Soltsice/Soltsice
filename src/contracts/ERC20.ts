
import { BigNumber } from 'bignumber.js';
import { W3, SoltsiceContract } from '..';

/**
 * ERC20 API
 */
export class ERC20 extends SoltsiceContract {
    constructor(
        deploymentParams: string | W3.TC.TxParams | object,
        ctorParams?: {},
        web3?: W3,
        link?: SoltsiceContract[]
    ) {
        // tslint:disable-next-line:max-line-length
        super(
            web3,
            require('../artifacts/ERC20.json'),
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
        let ___call = (spender: string, value: BigNumber, txParams?: W3.TC.TxParams): Promise<W3.TC.TransactionResult> => {
            txParams = txParams || this._sendParams;
            return new Promise((resolve, reject) => {
                this._instance.then((inst) => {
                    inst.approve(spender, value, txParams)
                        .then((res) => resolve(res))
                        .catch((err) => reject(err));
                });
            });
        };
        // tslint:disable-next-line:max-line-length
        // tslint:disable-next-line:variable-name
        let ___tx = (spender: string, value: BigNumber, txParams?: W3.TC.TxParams): Promise<string> => {
            txParams = txParams || this._sendParams;
            return new Promise((resolve, reject) => {
                this._instance.then((inst) => {
                    inst.approve.sendTransaction(spender, value, txParams)
                        .then((res) => resolve(res))
                        .catch((err) => reject(err));
                });
            });
        };
        // tslint:disable-next-line:max-line-length
        // tslint:disable-next-line:variable-name
        let ___data = (spender: string, value: BigNumber): Promise<string> => {
            return new Promise((resolve, reject) => {
                this._instance.then((inst) => {
                    resolve(inst.approve.request(spender, value).params[0].data);
                });
            });
        };
        // tslint:disable-next-line:max-line-length
        // tslint:disable-next-line:variable-name
        let ___gas = (spender: string, value: BigNumber): Promise<number> => {
            return new Promise((resolve, reject) => {
                this._instance.then((inst) => {
                    inst.approve.estimateGas(spender, value).then((g) => resolve(g));
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
        let ___call = (from: string, to: string, value: BigNumber, txParams?: W3.TC.TxParams): Promise<W3.TC.TransactionResult> => {
            txParams = txParams || this._sendParams;
            return new Promise((resolve, reject) => {
                this._instance.then((inst) => {
                    inst.transferFrom(from, to, value, txParams)
                        .then((res) => resolve(res))
                        .catch((err) => reject(err));
                });
            });
        };
        // tslint:disable-next-line:max-line-length
        // tslint:disable-next-line:variable-name
        let ___tx = (from: string, to: string, value: BigNumber, txParams?: W3.TC.TxParams): Promise<string> => {
            txParams = txParams || this._sendParams;
            return new Promise((resolve, reject) => {
                this._instance.then((inst) => {
                    inst.transferFrom.sendTransaction(from, to, value, txParams)
                        .then((res) => resolve(res))
                        .catch((err) => reject(err));
                });
            });
        };
        // tslint:disable-next-line:max-line-length
        // tslint:disable-next-line:variable-name
        let ___data = (from: string, to: string, value: BigNumber): Promise<string> => {
            return new Promise((resolve, reject) => {
                this._instance.then((inst) => {
                    resolve(inst.transferFrom.request(from, to, value).params[0].data);
                });
            });
        };
        // tslint:disable-next-line:max-line-length
        // tslint:disable-next-line:variable-name
        let ___gas = (from: string, to: string, value: BigNumber): Promise<number> => {
            return new Promise((resolve, reject) => {
                this._instance.then((inst) => {
                    inst.transferFrom.estimateGas(from, to, value).then((g) => resolve(g));
                });
            });
        };
        let method = Object.assign(___call, { data: ___data }, {estimateGas: ___gas}, {sendTransaction: ___tx});
        return method;
    }
    
    // tslint:disable-next-line:max-line-length
    // tslint:disable-next-line:variable-name
    public balanceOf(who: string): Promise<BigNumber> {
        return new Promise((resolve, reject) => {
            this._instance.then((inst) => {
                inst.balanceOf
                    .call(who)
                    .then((res) => resolve(res))
                    .catch((err) => reject(err));
            });
        });
    }
    
    public get transfer() {
        // tslint:disable-next-line:max-line-length
        // tslint:disable-next-line:variable-name
        let ___call = (to: string, value: BigNumber, txParams?: W3.TC.TxParams): Promise<W3.TC.TransactionResult> => {
            txParams = txParams || this._sendParams;
            return new Promise((resolve, reject) => {
                this._instance.then((inst) => {
                    inst.transfer(to, value, txParams)
                        .then((res) => resolve(res))
                        .catch((err) => reject(err));
                });
            });
        };
        // tslint:disable-next-line:max-line-length
        // tslint:disable-next-line:variable-name
        let ___tx = (to: string, value: BigNumber, txParams?: W3.TC.TxParams): Promise<string> => {
            txParams = txParams || this._sendParams;
            return new Promise((resolve, reject) => {
                this._instance.then((inst) => {
                    inst.transfer.sendTransaction(to, value, txParams)
                        .then((res) => resolve(res))
                        .catch((err) => reject(err));
                });
            });
        };
        // tslint:disable-next-line:max-line-length
        // tslint:disable-next-line:variable-name
        let ___data = (to: string, value: BigNumber): Promise<string> => {
            return new Promise((resolve, reject) => {
                this._instance.then((inst) => {
                    resolve(inst.transfer.request(to, value).params[0].data);
                });
            });
        };
        // tslint:disable-next-line:max-line-length
        // tslint:disable-next-line:variable-name
        let ___gas = (to: string, value: BigNumber): Promise<number> => {
            return new Promise((resolve, reject) => {
                this._instance.then((inst) => {
                    inst.transfer.estimateGas(to, value).then((g) => resolve(g));
                });
            });
        };
        let method = Object.assign(___call, { data: ___data }, {estimateGas: ___gas}, {sendTransaction: ___tx});
        return method;
    }
    
    // tslint:disable-next-line:max-line-length
    // tslint:disable-next-line:variable-name
    public allowance(owner: string, spender: string): Promise<BigNumber> {
        return new Promise((resolve, reject) => {
            this._instance.then((inst) => {
                inst.allowance
                    .call(owner, spender)
                    .then((res) => resolve(res))
                    .catch((err) => reject(err));
            });
        });
    }
    
}
