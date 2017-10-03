
import { BigNumber } from 'bignumber.js';
import { W3, SoltsiceContract } from '..';

/**
 * MultiSigWallet API
 */
export class MultiSigWallet extends SoltsiceContract {
    constructor(
        deploymentParams: string | W3.TC.TxParams | object,
        ctorParams?: {_owners: string[], _required: BigNumber},
        web3?: W3,
        link?: SoltsiceContract[]
    ) {
        // tslint:disable-next-line:max-line-length
        super(
            web3,
            require('../artifacts/MultiSigWallet.json'), 
            ctorParams ? [ctorParams!._owners, ctorParams!._required] : [], 
            deploymentParams,
            link
        );
    }

    /*
        Contract methods
    */
    
    // tslint:disable-next-line:max-line-length
    // tslint:disable-next-line:variable-name
    public owners(_0: BigNumber): Promise<string> {
        return new Promise((resolve, reject) => {
            this._instance.then((inst) => {
                inst.owners
                    .call(_0)
                    .then((res) => resolve(res))
                    .catch((err) => reject(err));
            });
        });
    }
    
    public get removeOwner() {
        // tslint:disable-next-line:max-line-length
        // tslint:disable-next-line:variable-name
        let ___call = (owner: string, txParams?: W3.TC.TxParams): Promise<W3.TC.TransactionResult> => {
            txParams = txParams || this._sendParams;
            return new Promise((resolve, reject) => {
                this._instance.then((inst) => {
                    inst.removeOwner(owner, txParams)
                        .then((res) => resolve(res))
                        .catch((err) => reject(err));
                });
            });
        };

        // tslint:disable-next-line:max-line-length
        // tslint:disable-next-line:variable-name
        let ___tx = (owner: string, txParams?: W3.TC.TxParams): Promise<string> => {
            txParams = txParams || this._sendParams;
            return new Promise((resolve, reject) => {
                this._instance.then((inst) => {
                    inst.removeOwner.sendTransaction(owner, txParams)
                        .then((res) => resolve(res))
                        .catch((err) => reject(err));
                });
            });
        };

        // tslint:disable-next-line:max-line-length
        // tslint:disable-next-line:variable-name
        let ___data = (owner: string): Promise<string> => {
            return new Promise((resolve, reject) => {
                this._instance.then((inst) => {
                    resolve(inst.removeOwner.request(owner).params[0].data);
                });
            });
        };
        // tslint:disable-next-line:max-line-length
        // tslint:disable-next-line:variable-name
        let ___gas = (owner: string): Promise<number> => {
            return new Promise((resolve, reject) => {
                this._instance.then((inst) => {
                    inst.removeOwner.estimateGas(owner).then((g) => resolve(g));
                });
            });
        };
        let method = Object.assign(___call, { data: ___data }, {estimateGas: ___gas}, {sendTransaction: ___tx});
        return method;
    }
    
    public get revokeConfirmation() {
        // tslint:disable-next-line:max-line-length
        // tslint:disable-next-line:variable-name
        let ___call = (transactionId: BigNumber, txParams?: W3.TC.TxParams): Promise<W3.TC.TransactionResult> => {
            txParams = txParams || this._sendParams;
            return new Promise((resolve, reject) => {
                this._instance.then((inst) => {
                    inst.revokeConfirmation(transactionId, txParams)
                        .then((res) => resolve(res))
                        .catch((err) => reject(err));
                });
            });
        };

        // tslint:disable-next-line:max-line-length
        // tslint:disable-next-line:variable-name
        let ___tx = (transactionId: BigNumber, txParams?: W3.TC.TxParams): Promise<string> => {
            txParams = txParams || this._sendParams;
            return new Promise((resolve, reject) => {
                this._instance.then((inst) => {
                    inst.revokeConfirmation.sendTransaction(transactionId, txParams)
                        .then((res) => resolve(res))
                        .catch((err) => reject(err));
                });
            });
        };

        // tslint:disable-next-line:max-line-length
        // tslint:disable-next-line:variable-name
        let ___data = (transactionId: BigNumber): Promise<string> => {
            return new Promise((resolve, reject) => {
                this._instance.then((inst) => {
                    resolve(inst.revokeConfirmation.request(transactionId).params[0].data);
                });
            });
        };
        // tslint:disable-next-line:max-line-length
        // tslint:disable-next-line:variable-name
        let ___gas = (transactionId: BigNumber): Promise<number> => {
            return new Promise((resolve, reject) => {
                this._instance.then((inst) => {
                    inst.revokeConfirmation.estimateGas(transactionId).then((g) => resolve(g));
                });
            });
        };
        let method = Object.assign(___call, { data: ___data }, {estimateGas: ___gas}, {sendTransaction: ___tx});
        return method;
    }
    
    // tslint:disable-next-line:max-line-length
    // tslint:disable-next-line:variable-name
    public isOwner(_0: string): Promise<boolean> {
        return new Promise((resolve, reject) => {
            this._instance.then((inst) => {
                inst.isOwner
                    .call(_0)
                    .then((res) => resolve(res))
                    .catch((err) => reject(err));
            });
        });
    }
    
    // tslint:disable-next-line:max-line-length
    // tslint:disable-next-line:variable-name
    public confirmations(_0: BigNumber, _1: string): Promise<boolean> {
        return new Promise((resolve, reject) => {
            this._instance.then((inst) => {
                inst.confirmations
                    .call(_0, _1)
                    .then((res) => resolve(res))
                    .catch((err) => reject(err));
            });
        });
    }
    
    // tslint:disable-next-line:max-line-length
    // tslint:disable-next-line:variable-name
    public getTransactionCount(pending: boolean, executed: boolean): Promise<BigNumber> {
        return new Promise((resolve, reject) => {
            this._instance.then((inst) => {
                inst.getTransactionCount
                    .call(pending, executed)
                    .then((res) => resolve(res))
                    .catch((err) => reject(err));
            });
        });
    }
    
    public get addOwner() {
        // tslint:disable-next-line:max-line-length
        // tslint:disable-next-line:variable-name
        let ___call = (owner: string, txParams?: W3.TC.TxParams): Promise<W3.TC.TransactionResult> => {
            txParams = txParams || this._sendParams;
            return new Promise((resolve, reject) => {
                this._instance.then((inst) => {
                    inst.addOwner(owner, txParams)
                        .then((res) => resolve(res))
                        .catch((err) => reject(err));
                });
            });
        };

        // tslint:disable-next-line:max-line-length
        // tslint:disable-next-line:variable-name
        let ___tx = (owner: string, txParams?: W3.TC.TxParams): Promise<string> => {
            txParams = txParams || this._sendParams;
            return new Promise((resolve, reject) => {
                this._instance.then((inst) => {
                    inst.addOwner.sendTransaction(owner, txParams)
                        .then((res) => resolve(res))
                        .catch((err) => reject(err));
                });
            });
        };

        // tslint:disable-next-line:max-line-length
        // tslint:disable-next-line:variable-name
        let ___data = (owner: string): Promise<string> => {
            return new Promise((resolve, reject) => {
                this._instance.then((inst) => {
                    resolve(inst.addOwner.request(owner).params[0].data);
                });
            });
        };
        // tslint:disable-next-line:max-line-length
        // tslint:disable-next-line:variable-name
        let ___gas = (owner: string): Promise<number> => {
            return new Promise((resolve, reject) => {
                this._instance.then((inst) => {
                    inst.addOwner.estimateGas(owner).then((g) => resolve(g));
                });
            });
        };
        let method = Object.assign(___call, { data: ___data }, {estimateGas: ___gas}, {sendTransaction: ___tx});
        return method;
    }
    
    // tslint:disable-next-line:max-line-length
    // tslint:disable-next-line:variable-name
    public isConfirmed(transactionId: BigNumber): Promise<boolean> {
        return new Promise((resolve, reject) => {
            this._instance.then((inst) => {
                inst.isConfirmed
                    .call(transactionId)
                    .then((res) => resolve(res))
                    .catch((err) => reject(err));
            });
        });
    }
    
    // tslint:disable-next-line:max-line-length
    // tslint:disable-next-line:variable-name
    public getConfirmationCount(transactionId: BigNumber): Promise<BigNumber> {
        return new Promise((resolve, reject) => {
            this._instance.then((inst) => {
                inst.getConfirmationCount
                    .call(transactionId)
                    .then((res) => resolve(res))
                    .catch((err) => reject(err));
            });
        });
    }
    
    // tslint:disable-next-line:max-line-length
    // tslint:disable-next-line:variable-name
    public transactions(_0: BigNumber): Promise<any> {
        return new Promise((resolve, reject) => {
            this._instance.then((inst) => {
                inst.transactions
                    .call(_0)
                    .then((res) => resolve(res))
                    .catch((err) => reject(err));
            });
        });
    }
    
    // tslint:disable-next-line:max-line-length
    // tslint:disable-next-line:variable-name
    public getOwners(): Promise<string[]> {
        return new Promise((resolve, reject) => {
            this._instance.then((inst) => {
                inst.getOwners
                    .call()
                    .then((res) => resolve(res))
                    .catch((err) => reject(err));
            });
        });
    }
    
    // tslint:disable-next-line:max-line-length
    // tslint:disable-next-line:variable-name
    public getTransactionIds(from: BigNumber, to: BigNumber, pending: boolean, executed: boolean): Promise<BigNumber> {
        return new Promise((resolve, reject) => {
            this._instance.then((inst) => {
                inst.getTransactionIds
                    .call(from, to, pending, executed)
                    .then((res) => resolve(res))
                    .catch((err) => reject(err));
            });
        });
    }
    
    // tslint:disable-next-line:max-line-length
    // tslint:disable-next-line:variable-name
    public getConfirmations(transactionId: BigNumber): Promise<string[]> {
        return new Promise((resolve, reject) => {
            this._instance.then((inst) => {
                inst.getConfirmations
                    .call(transactionId)
                    .then((res) => resolve(res))
                    .catch((err) => reject(err));
            });
        });
    }
    
    // tslint:disable-next-line:max-line-length
    // tslint:disable-next-line:variable-name
    public transactionCount(): Promise<BigNumber> {
        return new Promise((resolve, reject) => {
            this._instance.then((inst) => {
                inst.transactionCount
                    .call()
                    .then((res) => resolve(res))
                    .catch((err) => reject(err));
            });
        });
    }
    
    public get changeRequirement() {
        // tslint:disable-next-line:max-line-length
        // tslint:disable-next-line:variable-name
        let ___call = (_required: BigNumber, txParams?: W3.TC.TxParams): Promise<W3.TC.TransactionResult> => {
            txParams = txParams || this._sendParams;
            return new Promise((resolve, reject) => {
                this._instance.then((inst) => {
                    inst.changeRequirement(_required, txParams)
                        .then((res) => resolve(res))
                        .catch((err) => reject(err));
                });
            });
        };

        // tslint:disable-next-line:max-line-length
        // tslint:disable-next-line:variable-name
        let ___tx = (_required: BigNumber, txParams?: W3.TC.TxParams): Promise<string> => {
            txParams = txParams || this._sendParams;
            return new Promise((resolve, reject) => {
                this._instance.then((inst) => {
                    inst.changeRequirement.sendTransaction(_required, txParams)
                        .then((res) => resolve(res))
                        .catch((err) => reject(err));
                });
            });
        };

        // tslint:disable-next-line:max-line-length
        // tslint:disable-next-line:variable-name
        let ___data = (_required: BigNumber): Promise<string> => {
            return new Promise((resolve, reject) => {
                this._instance.then((inst) => {
                    resolve(inst.changeRequirement.request(_required).params[0].data);
                });
            });
        };
        // tslint:disable-next-line:max-line-length
        // tslint:disable-next-line:variable-name
        let ___gas = (_required: BigNumber): Promise<number> => {
            return new Promise((resolve, reject) => {
                this._instance.then((inst) => {
                    inst.changeRequirement.estimateGas(_required).then((g) => resolve(g));
                });
            });
        };
        let method = Object.assign(___call, { data: ___data }, {estimateGas: ___gas}, {sendTransaction: ___tx});
        return method;
    }
    
    public get confirmTransaction() {
        // tslint:disable-next-line:max-line-length
        // tslint:disable-next-line:variable-name
        let ___call = (transactionId: BigNumber, txParams?: W3.TC.TxParams): Promise<W3.TC.TransactionResult> => {
            txParams = txParams || this._sendParams;
            return new Promise((resolve, reject) => {
                this._instance.then((inst) => {
                    inst.confirmTransaction(transactionId, txParams)
                        .then((res) => resolve(res))
                        .catch((err) => reject(err));
                });
            });
        };

        // tslint:disable-next-line:max-line-length
        // tslint:disable-next-line:variable-name
        let ___tx = (transactionId: BigNumber, txParams?: W3.TC.TxParams): Promise<string> => {
            txParams = txParams || this._sendParams;
            return new Promise((resolve, reject) => {
                this._instance.then((inst) => {
                    inst.confirmTransaction.sendTransaction(transactionId, txParams)
                        .then((res) => resolve(res))
                        .catch((err) => reject(err));
                });
            });
        };

        // tslint:disable-next-line:max-line-length
        // tslint:disable-next-line:variable-name
        let ___data = (transactionId: BigNumber): Promise<string> => {
            return new Promise((resolve, reject) => {
                this._instance.then((inst) => {
                    resolve(inst.confirmTransaction.request(transactionId).params[0].data);
                });
            });
        };
        // tslint:disable-next-line:max-line-length
        // tslint:disable-next-line:variable-name
        let ___gas = (transactionId: BigNumber): Promise<number> => {
            return new Promise((resolve, reject) => {
                this._instance.then((inst) => {
                    inst.confirmTransaction.estimateGas(transactionId).then((g) => resolve(g));
                });
            });
        };
        let method = Object.assign(___call, { data: ___data }, {estimateGas: ___gas}, {sendTransaction: ___tx});
        return method;
    }
    
    public get submitTransaction() {
        // tslint:disable-next-line:max-line-length
        // tslint:disable-next-line:variable-name
        let ___call = (destination: string, value: BigNumber, data: string, txParams?: W3.TC.TxParams): Promise<W3.TC.TransactionResult> => {
            txParams = txParams || this._sendParams;
            return new Promise((resolve, reject) => {
                this._instance.then((inst) => {
                    inst.submitTransaction(destination, value, data, txParams)
                        .then((res) => resolve(res))
                        .catch((err) => reject(err));
                });
            });
        };

        // tslint:disable-next-line:max-line-length
        // tslint:disable-next-line:variable-name
        let ___tx = (destination: string, value: BigNumber, data: string, txParams?: W3.TC.TxParams): Promise<string> => {
            txParams = txParams || this._sendParams;
            return new Promise((resolve, reject) => {
                this._instance.then((inst) => {
                    inst.submitTransaction.sendTransaction(destination, value, data, txParams)
                        .then((res) => resolve(res))
                        .catch((err) => reject(err));
                });
            });
        };

        // tslint:disable-next-line:max-line-length
        // tslint:disable-next-line:variable-name
        let ___data = (destination: string, value: BigNumber, data: string): Promise<string> => {
            return new Promise((resolve, reject) => {
                this._instance.then((inst) => {
                    resolve(inst.submitTransaction.request(destination, value, data).params[0].data);
                });
            });
        };
        // tslint:disable-next-line:max-line-length
        // tslint:disable-next-line:variable-name
        let ___gas = (destination: string, value: BigNumber, data: string): Promise<number> => {
            return new Promise((resolve, reject) => {
                this._instance.then((inst) => {
                    inst.submitTransaction.estimateGas(destination, value, data).then((g) => resolve(g));
                });
            });
        };
        let method = Object.assign(___call, { data: ___data }, {estimateGas: ___gas}, {sendTransaction: ___tx});
        return method;
    }
    
    // tslint:disable-next-line:max-line-length
    // tslint:disable-next-line:variable-name
    public MAX_OWNER_COUNT(): Promise<BigNumber> {
        return new Promise((resolve, reject) => {
            this._instance.then((inst) => {
                inst.MAX_OWNER_COUNT
                    .call()
                    .then((res) => resolve(res))
                    .catch((err) => reject(err));
            });
        });
    }
    
    // tslint:disable-next-line:max-line-length
    // tslint:disable-next-line:variable-name
    public required(): Promise<BigNumber> {
        return new Promise((resolve, reject) => {
            this._instance.then((inst) => {
                inst.required
                    .call()
                    .then((res) => resolve(res))
                    .catch((err) => reject(err));
            });
        });
    }
    
    public get replaceOwner() {
        // tslint:disable-next-line:max-line-length
        // tslint:disable-next-line:variable-name
        let ___call = (owner: string, newOwner: string, txParams?: W3.TC.TxParams): Promise<W3.TC.TransactionResult> => {
            txParams = txParams || this._sendParams;
            return new Promise((resolve, reject) => {
                this._instance.then((inst) => {
                    inst.replaceOwner(owner, newOwner, txParams)
                        .then((res) => resolve(res))
                        .catch((err) => reject(err));
                });
            });
        };

        // tslint:disable-next-line:max-line-length
        // tslint:disable-next-line:variable-name
        let ___tx = (owner: string, newOwner: string, txParams?: W3.TC.TxParams): Promise<string> => {
            txParams = txParams || this._sendParams;
            return new Promise((resolve, reject) => {
                this._instance.then((inst) => {
                    inst.replaceOwner.sendTransaction(owner, newOwner, txParams)
                        .then((res) => resolve(res))
                        .catch((err) => reject(err));
                });
            });
        };

        // tslint:disable-next-line:max-line-length
        // tslint:disable-next-line:variable-name
        let ___data = (owner: string, newOwner: string): Promise<string> => {
            return new Promise((resolve, reject) => {
                this._instance.then((inst) => {
                    resolve(inst.replaceOwner.request(owner, newOwner).params[0].data);
                });
            });
        };
        // tslint:disable-next-line:max-line-length
        // tslint:disable-next-line:variable-name
        let ___gas = (owner: string, newOwner: string): Promise<number> => {
            return new Promise((resolve, reject) => {
                this._instance.then((inst) => {
                    inst.replaceOwner.estimateGas(owner, newOwner).then((g) => resolve(g));
                });
            });
        };
        let method = Object.assign(___call, { data: ___data }, {estimateGas: ___gas}, {sendTransaction: ___tx});
        return method;
    }
    
    public get executeTransaction() {
        // tslint:disable-next-line:max-line-length
        // tslint:disable-next-line:variable-name
        let ___call = (transactionId: BigNumber, txParams?: W3.TC.TxParams): Promise<W3.TC.TransactionResult> => {
            txParams = txParams || this._sendParams;
            return new Promise((resolve, reject) => {
                this._instance.then((inst) => {
                    inst.executeTransaction(transactionId, txParams)
                        .then((res) => resolve(res))
                        .catch((err) => reject(err));
                });
            });
        };

        // tslint:disable-next-line:max-line-length
        // tslint:disable-next-line:variable-name
        let ___tx = (transactionId: BigNumber, txParams?: W3.TC.TxParams): Promise<string> => {
            txParams = txParams || this._sendParams;
            return new Promise((resolve, reject) => {
                this._instance.then((inst) => {
                    inst.executeTransaction.sendTransaction(transactionId, txParams)
                        .then((res) => resolve(res))
                        .catch((err) => reject(err));
                });
            });
        };

        // tslint:disable-next-line:max-line-length
        // tslint:disable-next-line:variable-name
        let ___data = (transactionId: BigNumber): Promise<string> => {
            return new Promise((resolve, reject) => {
                this._instance.then((inst) => {
                    resolve(inst.executeTransaction.request(transactionId).params[0].data);
                });
            });
        };
        // tslint:disable-next-line:max-line-length
        // tslint:disable-next-line:variable-name
        let ___gas = (transactionId: BigNumber): Promise<number> => {
            return new Promise((resolve, reject) => {
                this._instance.then((inst) => {
                    inst.executeTransaction.estimateGas(transactionId).then((g) => resolve(g));
                });
            });
        };
        let method = Object.assign(___call, { data: ___data }, {estimateGas: ___gas}, {sendTransaction: ___tx});
        return method;
    }
    
}
