
import { BigNumber } from 'bignumber.js';
import { W3, SoltsiceContract } from '..';

/**
 * MultiSigWallet API
 */
export class MultiSigWallet extends SoltsiceContract {
    static get Artifacts() { return require('../artifacts/MultiSigWallet.json'); }
    constructor(
        deploymentParams: string | W3.TC.TxParams | object,
        ctorParams?: {_owners: string[], _required: BigNumber | number},
        w3?: W3,
        link?: SoltsiceContract[]
    ) {
        // tslint:disable-next-line:max-line-length
        super(
            w3,
            MultiSigWallet.Artifacts,
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
    public owners(_0: BigNumber | number): Promise<string> {
        return new Promise((resolve, reject) => {
            this._instance.then((inst) => {
                inst.owners
                    .call(_0)
                    .then((res) => resolve(res))
                    .catch((err) => reject(err));
            });
        });
    }
    
    // tslint:disable-next-line:member-ordering
    public removeOwner = Object.assign(
        // tslint:disable-next-line:max-line-length
        // tslint:disable-next-line:variable-name
        (owner: string, txParams?: W3.TC.TxParams): Promise<W3.TC.TransactionResult> => {
            return new Promise((resolve, reject) => {
                this._instance.then((inst) => {
                    inst.removeOwner(owner, txParams || this._sendParams)
                        .then((res) => resolve(res))
                        .catch((err) => reject(err));
                });
            });
        },
        {
            // tslint:disable-next-line:max-line-length
            // tslint:disable-next-line:variable-name
            sendTransaction: (owner: string, txParams?: W3.TC.TxParams): Promise<string> => {
                return new Promise((resolve, reject) => {
                    this._instance.then((inst) => {
                        inst.removeOwner.sendTransaction(owner, txParams || this._sendParams)
                            .then((res) => resolve(res))
                            .catch((err) => reject(err));
                    });
                });
            }
        },
        {
            // tslint:disable-next-line:max-line-length
            // tslint:disable-next-line:variable-name
            data: (owner: string): Promise<string> => {
                return new Promise((resolve, reject) => {
                    this._instance.then((inst) => {
                        resolve(inst.removeOwner.request(owner).params[0].data);
                    });
                });
            }
        },
        {
            // tslint:disable-next-line:max-line-length
            // tslint:disable-next-line:variable-name
            estimateGas: (owner: string): Promise<number> => {
                return new Promise((resolve, reject) => {
                    this._instance.then((inst) => {
                        inst.removeOwner.estimateGas(owner).then((g) => resolve(g));
                    });
                });
            }
        });
    
    // tslint:disable-next-line:member-ordering
    public revokeConfirmation = Object.assign(
        // tslint:disable-next-line:max-line-length
        // tslint:disable-next-line:variable-name
        (transactionId: BigNumber | number, txParams?: W3.TC.TxParams): Promise<W3.TC.TransactionResult> => {
            return new Promise((resolve, reject) => {
                this._instance.then((inst) => {
                    inst.revokeConfirmation(transactionId, txParams || this._sendParams)
                        .then((res) => resolve(res))
                        .catch((err) => reject(err));
                });
            });
        },
        {
            // tslint:disable-next-line:max-line-length
            // tslint:disable-next-line:variable-name
            sendTransaction: (transactionId: BigNumber | number, txParams?: W3.TC.TxParams): Promise<string> => {
                return new Promise((resolve, reject) => {
                    this._instance.then((inst) => {
                        inst.revokeConfirmation.sendTransaction(transactionId, txParams || this._sendParams)
                            .then((res) => resolve(res))
                            .catch((err) => reject(err));
                    });
                });
            }
        },
        {
            // tslint:disable-next-line:max-line-length
            // tslint:disable-next-line:variable-name
            data: (transactionId: BigNumber | number): Promise<string> => {
                return new Promise((resolve, reject) => {
                    this._instance.then((inst) => {
                        resolve(inst.revokeConfirmation.request(transactionId).params[0].data);
                    });
                });
            }
        },
        {
            // tslint:disable-next-line:max-line-length
            // tslint:disable-next-line:variable-name
            estimateGas: (transactionId: BigNumber | number): Promise<number> => {
                return new Promise((resolve, reject) => {
                    this._instance.then((inst) => {
                        inst.revokeConfirmation.estimateGas(transactionId).then((g) => resolve(g));
                    });
                });
            }
        });
    
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
    public confirmations(_0: BigNumber | number, _1: string): Promise<boolean> {
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
    
    // tslint:disable-next-line:member-ordering
    public addOwner = Object.assign(
        // tslint:disable-next-line:max-line-length
        // tslint:disable-next-line:variable-name
        (owner: string, txParams?: W3.TC.TxParams): Promise<W3.TC.TransactionResult> => {
            return new Promise((resolve, reject) => {
                this._instance.then((inst) => {
                    inst.addOwner(owner, txParams || this._sendParams)
                        .then((res) => resolve(res))
                        .catch((err) => reject(err));
                });
            });
        },
        {
            // tslint:disable-next-line:max-line-length
            // tslint:disable-next-line:variable-name
            sendTransaction: (owner: string, txParams?: W3.TC.TxParams): Promise<string> => {
                return new Promise((resolve, reject) => {
                    this._instance.then((inst) => {
                        inst.addOwner.sendTransaction(owner, txParams || this._sendParams)
                            .then((res) => resolve(res))
                            .catch((err) => reject(err));
                    });
                });
            }
        },
        {
            // tslint:disable-next-line:max-line-length
            // tslint:disable-next-line:variable-name
            data: (owner: string): Promise<string> => {
                return new Promise((resolve, reject) => {
                    this._instance.then((inst) => {
                        resolve(inst.addOwner.request(owner).params[0].data);
                    });
                });
            }
        },
        {
            // tslint:disable-next-line:max-line-length
            // tslint:disable-next-line:variable-name
            estimateGas: (owner: string): Promise<number> => {
                return new Promise((resolve, reject) => {
                    this._instance.then((inst) => {
                        inst.addOwner.estimateGas(owner).then((g) => resolve(g));
                    });
                });
            }
        });
    
    // tslint:disable-next-line:max-line-length
    // tslint:disable-next-line:variable-name
    public isConfirmed(transactionId: BigNumber | number): Promise<boolean> {
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
    public getConfirmationCount(transactionId: BigNumber | number): Promise<BigNumber> {
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
    public transactions(_0: BigNumber | number): Promise<any> {
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
    public getTransactionIds(from: BigNumber | number, to: BigNumber | number, pending: boolean, executed: boolean): Promise<BigNumber> {
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
    public getConfirmations(transactionId: BigNumber | number): Promise<string[]> {
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
    
    // tslint:disable-next-line:member-ordering
    public changeRequirement = Object.assign(
        // tslint:disable-next-line:max-line-length
        // tslint:disable-next-line:variable-name
        (_required: BigNumber | number, txParams?: W3.TC.TxParams): Promise<W3.TC.TransactionResult> => {
            return new Promise((resolve, reject) => {
                this._instance.then((inst) => {
                    inst.changeRequirement(_required, txParams || this._sendParams)
                        .then((res) => resolve(res))
                        .catch((err) => reject(err));
                });
            });
        },
        {
            // tslint:disable-next-line:max-line-length
            // tslint:disable-next-line:variable-name
            sendTransaction: (_required: BigNumber | number, txParams?: W3.TC.TxParams): Promise<string> => {
                return new Promise((resolve, reject) => {
                    this._instance.then((inst) => {
                        inst.changeRequirement.sendTransaction(_required, txParams || this._sendParams)
                            .then((res) => resolve(res))
                            .catch((err) => reject(err));
                    });
                });
            }
        },
        {
            // tslint:disable-next-line:max-line-length
            // tslint:disable-next-line:variable-name
            data: (_required: BigNumber | number): Promise<string> => {
                return new Promise((resolve, reject) => {
                    this._instance.then((inst) => {
                        resolve(inst.changeRequirement.request(_required).params[0].data);
                    });
                });
            }
        },
        {
            // tslint:disable-next-line:max-line-length
            // tslint:disable-next-line:variable-name
            estimateGas: (_required: BigNumber | number): Promise<number> => {
                return new Promise((resolve, reject) => {
                    this._instance.then((inst) => {
                        inst.changeRequirement.estimateGas(_required).then((g) => resolve(g));
                    });
                });
            }
        });
    
    // tslint:disable-next-line:member-ordering
    public confirmTransaction = Object.assign(
        // tslint:disable-next-line:max-line-length
        // tslint:disable-next-line:variable-name
        (transactionId: BigNumber | number, txParams?: W3.TC.TxParams): Promise<W3.TC.TransactionResult> => {
            return new Promise((resolve, reject) => {
                this._instance.then((inst) => {
                    inst.confirmTransaction(transactionId, txParams || this._sendParams)
                        .then((res) => resolve(res))
                        .catch((err) => reject(err));
                });
            });
        },
        {
            // tslint:disable-next-line:max-line-length
            // tslint:disable-next-line:variable-name
            sendTransaction: (transactionId: BigNumber | number, txParams?: W3.TC.TxParams): Promise<string> => {
                return new Promise((resolve, reject) => {
                    this._instance.then((inst) => {
                        inst.confirmTransaction.sendTransaction(transactionId, txParams || this._sendParams)
                            .then((res) => resolve(res))
                            .catch((err) => reject(err));
                    });
                });
            }
        },
        {
            // tslint:disable-next-line:max-line-length
            // tslint:disable-next-line:variable-name
            data: (transactionId: BigNumber | number): Promise<string> => {
                return new Promise((resolve, reject) => {
                    this._instance.then((inst) => {
                        resolve(inst.confirmTransaction.request(transactionId).params[0].data);
                    });
                });
            }
        },
        {
            // tslint:disable-next-line:max-line-length
            // tslint:disable-next-line:variable-name
            estimateGas: (transactionId: BigNumber | number): Promise<number> => {
                return new Promise((resolve, reject) => {
                    this._instance.then((inst) => {
                        inst.confirmTransaction.estimateGas(transactionId).then((g) => resolve(g));
                    });
                });
            }
        });
    
    // tslint:disable-next-line:member-ordering
    public submitTransaction = Object.assign(
        // tslint:disable-next-line:max-line-length
        // tslint:disable-next-line:variable-name
        (destination: string, value: BigNumber | number, data: string, txParams?: W3.TC.TxParams): Promise<W3.TC.TransactionResult> => {
            return new Promise((resolve, reject) => {
                this._instance.then((inst) => {
                    inst.submitTransaction(destination, value, data, txParams || this._sendParams)
                        .then((res) => resolve(res))
                        .catch((err) => reject(err));
                });
            });
        },
        {
            // tslint:disable-next-line:max-line-length
            // tslint:disable-next-line:variable-name
            sendTransaction: (destination: string, value: BigNumber | number, data: string, txParams?: W3.TC.TxParams): Promise<string> => {
                return new Promise((resolve, reject) => {
                    this._instance.then((inst) => {
                        inst.submitTransaction.sendTransaction(destination, value, data, txParams || this._sendParams)
                            .then((res) => resolve(res))
                            .catch((err) => reject(err));
                    });
                });
            }
        },
        {
            // tslint:disable-next-line:max-line-length
            // tslint:disable-next-line:variable-name
            data: (destination: string, value: BigNumber | number, data: string): Promise<string> => {
                return new Promise((resolve, reject) => {
                    this._instance.then((inst) => {
                        resolve(inst.submitTransaction.request(destination, value, data).params[0].data);
                    });
                });
            }
        },
        {
            // tslint:disable-next-line:max-line-length
            // tslint:disable-next-line:variable-name
            estimateGas: (destination: string, value: BigNumber | number, data: string): Promise<number> => {
                return new Promise((resolve, reject) => {
                    this._instance.then((inst) => {
                        inst.submitTransaction.estimateGas(destination, value, data).then((g) => resolve(g));
                    });
                });
            }
        });
    
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
    
    // tslint:disable-next-line:member-ordering
    public replaceOwner = Object.assign(
        // tslint:disable-next-line:max-line-length
        // tslint:disable-next-line:variable-name
        (owner: string, newOwner: string, txParams?: W3.TC.TxParams): Promise<W3.TC.TransactionResult> => {
            return new Promise((resolve, reject) => {
                this._instance.then((inst) => {
                    inst.replaceOwner(owner, newOwner, txParams || this._sendParams)
                        .then((res) => resolve(res))
                        .catch((err) => reject(err));
                });
            });
        },
        {
            // tslint:disable-next-line:max-line-length
            // tslint:disable-next-line:variable-name
            sendTransaction: (owner: string, newOwner: string, txParams?: W3.TC.TxParams): Promise<string> => {
                return new Promise((resolve, reject) => {
                    this._instance.then((inst) => {
                        inst.replaceOwner.sendTransaction(owner, newOwner, txParams || this._sendParams)
                            .then((res) => resolve(res))
                            .catch((err) => reject(err));
                    });
                });
            }
        },
        {
            // tslint:disable-next-line:max-line-length
            // tslint:disable-next-line:variable-name
            data: (owner: string, newOwner: string): Promise<string> => {
                return new Promise((resolve, reject) => {
                    this._instance.then((inst) => {
                        resolve(inst.replaceOwner.request(owner, newOwner).params[0].data);
                    });
                });
            }
        },
        {
            // tslint:disable-next-line:max-line-length
            // tslint:disable-next-line:variable-name
            estimateGas: (owner: string, newOwner: string): Promise<number> => {
                return new Promise((resolve, reject) => {
                    this._instance.then((inst) => {
                        inst.replaceOwner.estimateGas(owner, newOwner).then((g) => resolve(g));
                    });
                });
            }
        });
    
    // tslint:disable-next-line:member-ordering
    public executeTransaction = Object.assign(
        // tslint:disable-next-line:max-line-length
        // tslint:disable-next-line:variable-name
        (transactionId: BigNumber | number, txParams?: W3.TC.TxParams): Promise<W3.TC.TransactionResult> => {
            return new Promise((resolve, reject) => {
                this._instance.then((inst) => {
                    inst.executeTransaction(transactionId, txParams || this._sendParams)
                        .then((res) => resolve(res))
                        .catch((err) => reject(err));
                });
            });
        },
        {
            // tslint:disable-next-line:max-line-length
            // tslint:disable-next-line:variable-name
            sendTransaction: (transactionId: BigNumber | number, txParams?: W3.TC.TxParams): Promise<string> => {
                return new Promise((resolve, reject) => {
                    this._instance.then((inst) => {
                        inst.executeTransaction.sendTransaction(transactionId, txParams || this._sendParams)
                            .then((res) => resolve(res))
                            .catch((err) => reject(err));
                    });
                });
            }
        },
        {
            // tslint:disable-next-line:max-line-length
            // tslint:disable-next-line:variable-name
            data: (transactionId: BigNumber | number): Promise<string> => {
                return new Promise((resolve, reject) => {
                    this._instance.then((inst) => {
                        resolve(inst.executeTransaction.request(transactionId).params[0].data);
                    });
                });
            }
        },
        {
            // tslint:disable-next-line:max-line-length
            // tslint:disable-next-line:variable-name
            estimateGas: (transactionId: BigNumber | number): Promise<number> => {
                return new Promise((resolve, reject) => {
                    this._instance.then((inst) => {
                        inst.executeTransaction.estimateGas(transactionId).then((g) => resolve(g));
                    });
                });
            }
        });
    
}
