
import { BigNumber } from 'bignumber.js';
import { W3, SoltsiceContract } from '..';

/**
 * Storage API
 */
export class Storage extends SoltsiceContract {
    static get Artifacts() { return require('../artifacts/Storage.json'); }

    static get BytecodeHash() {
        // we need this before ctor, but artifacts are static and we cannot pass it to the base class, so need to generate
        let artifacts = Storage.Artifacts;
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
            Storage.Artifacts,
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
    public getBooleanValue(record: string): Promise<boolean> {
        return new Promise((resolve, reject) => {
            this._instance.then((inst) => {
                inst.getBooleanValue
                    .call(record)
                    .then((res) => resolve(res))
                    .catch((err) => reject(err));
            });
        });
    }
    
    // tslint:disable-next-line:member-ordering
    public setUIntValue = Object.assign(
        // tslint:disable-next-line:max-line-length
        // tslint:disable-next-line:variable-name
        (record: string, value: BigNumber | number, txParams?: W3.TC.TxParams): Promise<W3.TC.TransactionResult> => {
            return new Promise((resolve, reject) => {
                this._instance.then((inst) => {
                    inst.setUIntValue(record, value, txParams || this._sendParams)
                        .then((res) => resolve(res))
                        .catch((err) => reject(err));
                });
            });
        },
        {
            // tslint:disable-next-line:max-line-length
            // tslint:disable-next-line:variable-name
            sendTransaction: (record: string, value: BigNumber | number, txParams?: W3.TC.TxParams): Promise<string> => {
                return new Promise((resolve, reject) => {
                    this._instance.then((inst) => {
                        inst.setUIntValue.sendTransaction(record, value, txParams || this._sendParams)
                            .then((res) => resolve(res))
                            .catch((err) => reject(err));
                    });
                });
            }
        },
        {
            // tslint:disable-next-line:max-line-length
            // tslint:disable-next-line:variable-name
            data: (record: string, value: BigNumber | number): Promise<string> => {
                return new Promise((resolve, reject) => {
                    this._instance.then((inst) => {
                        resolve(inst.setUIntValue.request(record, value).params[0].data);
                    });
                });
            }
        },
        {
            // tslint:disable-next-line:max-line-length
            // tslint:disable-next-line:variable-name
            estimateGas: (record: string, value: BigNumber | number): Promise<number> => {
                return new Promise((resolve, reject) => {
                    this._instance.then((inst) => {
                        inst.setUIntValue.estimateGas(record, value).then((g) => resolve(g));
                    });
                });
            }
        });
    
    // tslint:disable-next-line:member-ordering
    public setBooleanValue = Object.assign(
        // tslint:disable-next-line:max-line-length
        // tslint:disable-next-line:variable-name
        (record: string, value: boolean, txParams?: W3.TC.TxParams): Promise<W3.TC.TransactionResult> => {
            return new Promise((resolve, reject) => {
                this._instance.then((inst) => {
                    inst.setBooleanValue(record, value, txParams || this._sendParams)
                        .then((res) => resolve(res))
                        .catch((err) => reject(err));
                });
            });
        },
        {
            // tslint:disable-next-line:max-line-length
            // tslint:disable-next-line:variable-name
            sendTransaction: (record: string, value: boolean, txParams?: W3.TC.TxParams): Promise<string> => {
                return new Promise((resolve, reject) => {
                    this._instance.then((inst) => {
                        inst.setBooleanValue.sendTransaction(record, value, txParams || this._sendParams)
                            .then((res) => resolve(res))
                            .catch((err) => reject(err));
                    });
                });
            }
        },
        {
            // tslint:disable-next-line:max-line-length
            // tslint:disable-next-line:variable-name
            data: (record: string, value: boolean): Promise<string> => {
                return new Promise((resolve, reject) => {
                    this._instance.then((inst) => {
                        resolve(inst.setBooleanValue.request(record, value).params[0].data);
                    });
                });
            }
        },
        {
            // tslint:disable-next-line:max-line-length
            // tslint:disable-next-line:variable-name
            estimateGas: (record: string, value: boolean): Promise<number> => {
                return new Promise((resolve, reject) => {
                    this._instance.then((inst) => {
                        inst.setBooleanValue.estimateGas(record, value).then((g) => resolve(g));
                    });
                });
            }
        });
    
    // tslint:disable-next-line:max-line-length
    // tslint:disable-next-line:variable-name
    public getBytesValue(record: string): Promise<string> {
        return new Promise((resolve, reject) => {
            this._instance.then((inst) => {
                inst.getBytesValue
                    .call(record)
                    .then((res) => resolve(res))
                    .catch((err) => reject(err));
            });
        });
    }
    
    // tslint:disable-next-line:max-line-length
    // tslint:disable-next-line:variable-name
    public getAddressValue(record: string): Promise<string> {
        return new Promise((resolve, reject) => {
            this._instance.then((inst) => {
                inst.getAddressValue
                    .call(record)
                    .then((res) => resolve(res))
                    .catch((err) => reject(err));
            });
        });
    }
    
    // tslint:disable-next-line:member-ordering
    public setAddressValue = Object.assign(
        // tslint:disable-next-line:max-line-length
        // tslint:disable-next-line:variable-name
        (record: string, value: string, txParams?: W3.TC.TxParams): Promise<W3.TC.TransactionResult> => {
            return new Promise((resolve, reject) => {
                this._instance.then((inst) => {
                    inst.setAddressValue(record, value, txParams || this._sendParams)
                        .then((res) => resolve(res))
                        .catch((err) => reject(err));
                });
            });
        },
        {
            // tslint:disable-next-line:max-line-length
            // tslint:disable-next-line:variable-name
            sendTransaction: (record: string, value: string, txParams?: W3.TC.TxParams): Promise<string> => {
                return new Promise((resolve, reject) => {
                    this._instance.then((inst) => {
                        inst.setAddressValue.sendTransaction(record, value, txParams || this._sendParams)
                            .then((res) => resolve(res))
                            .catch((err) => reject(err));
                    });
                });
            }
        },
        {
            // tslint:disable-next-line:max-line-length
            // tslint:disable-next-line:variable-name
            data: (record: string, value: string): Promise<string> => {
                return new Promise((resolve, reject) => {
                    this._instance.then((inst) => {
                        resolve(inst.setAddressValue.request(record, value).params[0].data);
                    });
                });
            }
        },
        {
            // tslint:disable-next-line:max-line-length
            // tslint:disable-next-line:variable-name
            estimateGas: (record: string, value: string): Promise<number> => {
                return new Promise((resolve, reject) => {
                    this._instance.then((inst) => {
                        inst.setAddressValue.estimateGas(record, value).then((g) => resolve(g));
                    });
                });
            }
        });
    
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
    public getIntValue(record: string): Promise<BigNumber> {
        return new Promise((resolve, reject) => {
            this._instance.then((inst) => {
                inst.getIntValue
                    .call(record)
                    .then((res) => resolve(res))
                    .catch((err) => reject(err));
            });
        });
    }
    
    // tslint:disable-next-line:max-line-length
    // tslint:disable-next-line:variable-name
    public getStringValue(record: string): Promise<string> {
        return new Promise((resolve, reject) => {
            this._instance.then((inst) => {
                inst.getStringValue
                    .call(record)
                    .then((res) => resolve(res))
                    .catch((err) => reject(err));
            });
        });
    }
    
    // tslint:disable-next-line:member-ordering
    public setIntValue = Object.assign(
        // tslint:disable-next-line:max-line-length
        // tslint:disable-next-line:variable-name
        (record: string, value: BigNumber | number, txParams?: W3.TC.TxParams): Promise<W3.TC.TransactionResult> => {
            return new Promise((resolve, reject) => {
                this._instance.then((inst) => {
                    inst.setIntValue(record, value, txParams || this._sendParams)
                        .then((res) => resolve(res))
                        .catch((err) => reject(err));
                });
            });
        },
        {
            // tslint:disable-next-line:max-line-length
            // tslint:disable-next-line:variable-name
            sendTransaction: (record: string, value: BigNumber | number, txParams?: W3.TC.TxParams): Promise<string> => {
                return new Promise((resolve, reject) => {
                    this._instance.then((inst) => {
                        inst.setIntValue.sendTransaction(record, value, txParams || this._sendParams)
                            .then((res) => resolve(res))
                            .catch((err) => reject(err));
                    });
                });
            }
        },
        {
            // tslint:disable-next-line:max-line-length
            // tslint:disable-next-line:variable-name
            data: (record: string, value: BigNumber | number): Promise<string> => {
                return new Promise((resolve, reject) => {
                    this._instance.then((inst) => {
                        resolve(inst.setIntValue.request(record, value).params[0].data);
                    });
                });
            }
        },
        {
            // tslint:disable-next-line:max-line-length
            // tslint:disable-next-line:variable-name
            estimateGas: (record: string, value: BigNumber | number): Promise<number> => {
                return new Promise((resolve, reject) => {
                    this._instance.then((inst) => {
                        inst.setIntValue.estimateGas(record, value).then((g) => resolve(g));
                    });
                });
            }
        });
    
    // tslint:disable-next-line:max-line-length
    // tslint:disable-next-line:variable-name
    public getUIntValue(record: string): Promise<BigNumber> {
        return new Promise((resolve, reject) => {
            this._instance.then((inst) => {
                inst.getUIntValue
                    .call(record)
                    .then((res) => resolve(res))
                    .catch((err) => reject(err));
            });
        });
    }
    
    // tslint:disable-next-line:member-ordering
    public setBytesValue = Object.assign(
        // tslint:disable-next-line:max-line-length
        // tslint:disable-next-line:variable-name
        (record: string, value: string, txParams?: W3.TC.TxParams): Promise<W3.TC.TransactionResult> => {
            return new Promise((resolve, reject) => {
                this._instance.then((inst) => {
                    inst.setBytesValue(record, value, txParams || this._sendParams)
                        .then((res) => resolve(res))
                        .catch((err) => reject(err));
                });
            });
        },
        {
            // tslint:disable-next-line:max-line-length
            // tslint:disable-next-line:variable-name
            sendTransaction: (record: string, value: string, txParams?: W3.TC.TxParams): Promise<string> => {
                return new Promise((resolve, reject) => {
                    this._instance.then((inst) => {
                        inst.setBytesValue.sendTransaction(record, value, txParams || this._sendParams)
                            .then((res) => resolve(res))
                            .catch((err) => reject(err));
                    });
                });
            }
        },
        {
            // tslint:disable-next-line:max-line-length
            // tslint:disable-next-line:variable-name
            data: (record: string, value: string): Promise<string> => {
                return new Promise((resolve, reject) => {
                    this._instance.then((inst) => {
                        resolve(inst.setBytesValue.request(record, value).params[0].data);
                    });
                });
            }
        },
        {
            // tslint:disable-next-line:max-line-length
            // tslint:disable-next-line:variable-name
            estimateGas: (record: string, value: string): Promise<number> => {
                return new Promise((resolve, reject) => {
                    this._instance.then((inst) => {
                        inst.setBytesValue.estimateGas(record, value).then((g) => resolve(g));
                    });
                });
            }
        });
    
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
    
    // tslint:disable-next-line:member-ordering
    public setStringValue = Object.assign(
        // tslint:disable-next-line:max-line-length
        // tslint:disable-next-line:variable-name
        (record: string, value: string, txParams?: W3.TC.TxParams): Promise<W3.TC.TransactionResult> => {
            return new Promise((resolve, reject) => {
                this._instance.then((inst) => {
                    inst.setStringValue(record, value, txParams || this._sendParams)
                        .then((res) => resolve(res))
                        .catch((err) => reject(err));
                });
            });
        },
        {
            // tslint:disable-next-line:max-line-length
            // tslint:disable-next-line:variable-name
            sendTransaction: (record: string, value: string, txParams?: W3.TC.TxParams): Promise<string> => {
                return new Promise((resolve, reject) => {
                    this._instance.then((inst) => {
                        inst.setStringValue.sendTransaction(record, value, txParams || this._sendParams)
                            .then((res) => resolve(res))
                            .catch((err) => reject(err));
                    });
                });
            }
        },
        {
            // tslint:disable-next-line:max-line-length
            // tslint:disable-next-line:variable-name
            data: (record: string, value: string): Promise<string> => {
                return new Promise((resolve, reject) => {
                    this._instance.then((inst) => {
                        resolve(inst.setStringValue.request(record, value).params[0].data);
                    });
                });
            }
        },
        {
            // tslint:disable-next-line:max-line-length
            // tslint:disable-next-line:variable-name
            estimateGas: (record: string, value: string): Promise<number> => {
                return new Promise((resolve, reject) => {
                    this._instance.then((inst) => {
                        inst.setStringValue.estimateGas(record, value).then((g) => resolve(g));
                    });
                });
            }
        });
    
}
