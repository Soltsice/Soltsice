
import { BigNumber } from 'bignumber.js';
import { W3, SoltsiceContract } from '..';

/**
 * DummyContract API
 */
export class DummyContract extends SoltsiceContract {
    public static get Artifacts() { return require('../artifacts/DummyContract.json'); }

    public static get BytecodeHash() {
        // we need this before ctor, but artifacts are static and we cannot pass it to the base class, so need to generate
        let artifacts = DummyContract.Artifacts;
        if (!artifacts || !artifacts.bytecode) {
            return undefined;
        }
        let hash = W3.sha3(JSON.stringify(artifacts.bytecode));
        return hash;
    }

    // tslint:disable-next-line:max-line-length
    public static async New(deploymentParams: W3.TX.TxParams, ctorParams?: {_secret: BigNumber | number, _wellKnown: BigNumber | number}, w3?: W3, link?: SoltsiceContract[], privateKey?: string): Promise<DummyContract> {
        w3 = w3 || W3.Default;
        if (!privateKey) {
            let contract = new DummyContract(deploymentParams, ctorParams, w3, link);
            await contract._instancePromise;
            return contract;
        } else {
            let data = DummyContract.NewData(ctorParams, w3);
            let txHash = await w3.sendSignedTransaction(W3.zeroAddress, privateKey, data, deploymentParams);
            let txReceipt = await w3.waitTransactionReceipt(txHash);
            let rawAddress = txReceipt.contractAddress;
            let contract = await DummyContract.At(rawAddress, w3);
            return contract;
        }
    }

    public static async At(address: string | object, w3?: W3): Promise<DummyContract> {
        let contract = new DummyContract(address, undefined, w3, undefined);
        await contract._instancePromise;
        return contract;
    }

    public static async Deployed(w3?: W3): Promise<DummyContract> {
        let contract = new DummyContract('', undefined, w3, undefined);
        await contract._instancePromise;
        return contract;
    }

    // tslint:disable-next-line:max-line-length
    public static NewData(ctorParams?: {_secret: BigNumber | number, _wellKnown: BigNumber | number}, w3?: W3): string {
        // tslint:disable-next-line:max-line-length
        let data = SoltsiceContract.NewDataImpl(w3, DummyContract.Artifacts, ctorParams ? [ctorParams!._secret, ctorParams!._wellKnown] : []);
        return data;
    }

    protected constructor(
        deploymentParams: string | W3.TX.TxParams | object,
        ctorParams?: {_secret: BigNumber | number, _wellKnown: BigNumber | number},
        w3?: W3,
        link?: SoltsiceContract[]
    ) {
        // tslint:disable-next-line:max-line-length
        super(
            w3,
            DummyContract.Artifacts,
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
    public owner( txParams?: W3.TX.TxParams): Promise<string> {
        return new Promise((resolve, reject) => {
            this._instance.owner
                .call( txParams || this._sendParams)
                .then((res) => resolve(res))
                .catch((err) => reject(err));
        });
    }
    
    // tslint:disable-next-line:max-line-length
    // tslint:disable-next-line:variable-name
    public wellKnown( txParams?: W3.TX.TxParams): Promise<BigNumber> {
        return new Promise((resolve, reject) => {
            this._instance.wellKnown
                .call( txParams || this._sendParams)
                .then((res) => resolve(res))
                .catch((err) => reject(err));
        });
    }
    
    // tslint:disable-next-line:member-ordering
    public transferOwnership = Object.assign(
        // tslint:disable-next-line:max-line-length
        // tslint:disable-next-line:variable-name
        (newOwner: string, txParams?: W3.TX.TxParams): Promise<W3.TX.TransactionResult> => {
            return new Promise((resolve, reject) => {
                this._instance.transferOwnership(newOwner, txParams || this._sendParams)
                    .then((res) => resolve(res))
                    .catch((err) => reject(err));
            });
        },
        {
            // tslint:disable-next-line:max-line-length
            // tslint:disable-next-line:variable-name
            sendTransaction: Object.assign((newOwner: string, txParams?: W3.TX.TxParams): Promise<string> => {
                    return new Promise((resolve, reject) => {
                        this._instance.transferOwnership.sendTransaction(newOwner, txParams || this._sendParams)
                            .then((res) => resolve(res))
                            .catch((err) => reject(err));
                    });
                },
                {
                    // tslint:disable-next-line:max-line-length
                    // tslint:disable-next-line:variable-name
                    sendSigned: (newOwner: string, privateKey: string, txParams?: W3.TX.TxParams, nonce?: number): Promise<string> => {
                        // tslint:disable-next-line:max-line-length
                        return this.w3.sendSignedTransaction(this.address, privateKey, this._instance.transferOwnership.request(newOwner).params[0].data, txParams, nonce);
                    }
                }
            )
        },
        {
            // tslint:disable-next-line:max-line-length
            // tslint:disable-next-line:variable-name
            data: (newOwner: string): Promise<string> => {
                return new Promise((resolve, reject) => {
                    resolve(this._instance.transferOwnership.request(newOwner).params[0].data);
                });
            }
        },
        {
            // tslint:disable-next-line:max-line-length
            // tslint:disable-next-line:variable-name
            estimateGas: (newOwner: string): Promise<number> => {
                return new Promise((resolve, reject) => {
                    this._instance.transferOwnership.estimateGas(newOwner).then((g) => resolve(g));
                });
            }
        });
    
    // tslint:disable-next-line:max-line-length
    // tslint:disable-next-line:variable-name
    public getPrivate( txParams?: W3.TX.TxParams): Promise<BigNumber> {
        return new Promise((resolve, reject) => {
            this._instance.getPrivate
                .call( txParams || this._sendParams)
                .then((res) => resolve(res))
                .catch((err) => reject(err));
        });
    }
    
    // tslint:disable-next-line:member-ordering
    public setPrivate = Object.assign(
        // tslint:disable-next-line:max-line-length
        // tslint:disable-next-line:variable-name
        (_newValue: BigNumber | number, txParams?: W3.TX.TxParams): Promise<W3.TX.TransactionResult> => {
            return new Promise((resolve, reject) => {
                this._instance.setPrivate(_newValue, txParams || this._sendParams)
                    .then((res) => resolve(res))
                    .catch((err) => reject(err));
            });
        },
        {
            // tslint:disable-next-line:max-line-length
            // tslint:disable-next-line:variable-name
            sendTransaction: Object.assign((_newValue: BigNumber | number, txParams?: W3.TX.TxParams): Promise<string> => {
                    return new Promise((resolve, reject) => {
                        this._instance.setPrivate.sendTransaction(_newValue, txParams || this._sendParams)
                            .then((res) => resolve(res))
                            .catch((err) => reject(err));
                    });
                },
                {
                    // tslint:disable-next-line:max-line-length
                    // tslint:disable-next-line:variable-name
                    sendSigned: (_newValue: BigNumber | number, privateKey: string, txParams?: W3.TX.TxParams, nonce?: number): Promise<string> => {
                        // tslint:disable-next-line:max-line-length
                        return this.w3.sendSignedTransaction(this.address, privateKey, this._instance.setPrivate.request(_newValue).params[0].data, txParams, nonce);
                    }
                }
            )
        },
        {
            // tslint:disable-next-line:max-line-length
            // tslint:disable-next-line:variable-name
            data: (_newValue: BigNumber | number): Promise<string> => {
                return new Promise((resolve, reject) => {
                    resolve(this._instance.setPrivate.request(_newValue).params[0].data);
                });
            }
        },
        {
            // tslint:disable-next-line:max-line-length
            // tslint:disable-next-line:variable-name
            estimateGas: (_newValue: BigNumber | number): Promise<number> => {
                return new Promise((resolve, reject) => {
                    this._instance.setPrivate.estimateGas(_newValue).then((g) => resolve(g));
                });
            }
        });
    
    // tslint:disable-next-line:max-line-length
    // tslint:disable-next-line:variable-name
    public getPublic( txParams?: W3.TX.TxParams): Promise<BigNumber> {
        return new Promise((resolve, reject) => {
            this._instance.getPublic
                .call( txParams || this._sendParams)
                .then((res) => resolve(res))
                .catch((err) => reject(err));
        });
    }
    
    // tslint:disable-next-line:member-ordering
    public setPublic = Object.assign(
        // tslint:disable-next-line:max-line-length
        // tslint:disable-next-line:variable-name
        (_newValue: BigNumber | number, txParams?: W3.TX.TxParams): Promise<W3.TX.TransactionResult> => {
            return new Promise((resolve, reject) => {
                this._instance.setPublic(_newValue, txParams || this._sendParams)
                    .then((res) => resolve(res))
                    .catch((err) => reject(err));
            });
        },
        {
            // tslint:disable-next-line:max-line-length
            // tslint:disable-next-line:variable-name
            sendTransaction: Object.assign((_newValue: BigNumber | number, txParams?: W3.TX.TxParams): Promise<string> => {
                    return new Promise((resolve, reject) => {
                        this._instance.setPublic.sendTransaction(_newValue, txParams || this._sendParams)
                            .then((res) => resolve(res))
                            .catch((err) => reject(err));
                    });
                },
                {
                    // tslint:disable-next-line:max-line-length
                    // tslint:disable-next-line:variable-name
                    sendSigned: (_newValue: BigNumber | number, privateKey: string, txParams?: W3.TX.TxParams, nonce?: number): Promise<string> => {
                        // tslint:disable-next-line:max-line-length
                        return this.w3.sendSignedTransaction(this.address, privateKey, this._instance.setPublic.request(_newValue).params[0].data, txParams, nonce);
                    }
                }
            )
        },
        {
            // tslint:disable-next-line:max-line-length
            // tslint:disable-next-line:variable-name
            data: (_newValue: BigNumber | number): Promise<string> => {
                return new Promise((resolve, reject) => {
                    resolve(this._instance.setPublic.request(_newValue).params[0].data);
                });
            }
        },
        {
            // tslint:disable-next-line:max-line-length
            // tslint:disable-next-line:variable-name
            estimateGas: (_newValue: BigNumber | number): Promise<number> => {
                return new Promise((resolve, reject) => {
                    this._instance.setPublic.estimateGas(_newValue).then((g) => resolve(g));
                });
            }
        });
    
}
