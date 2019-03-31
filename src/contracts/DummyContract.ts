
import { W3, BN, SoltsiceContract } from '..';

/**
 * DummyContract API
 */
export class DummyContract extends SoltsiceContract {
  protected useBN: BN = new BN(0);

  public static get artifacts() { return require('../artifacts/DummyContract.json'); }

  public static get bytecodeHash() {
    // we need this before ctor, but artifacts are static and we cannot pass it to the base class, so need to generate
    let artifacts = DummyContract.artifacts;
    if (!artifacts || !artifacts.bytecode) {
        return undefined;
    }
    let hash = W3.sha3(JSON.stringify(artifacts.bytecode));
    return hash;
  }

  // tslint:disable-next-line:max-line-length
  public static async new(deploymentParams: W3.TX.TxParams, ctorParams?: {_secret: BN | number, _wellKnown: BN | number, _array: BN[] | number[]}, w3?: W3, link?: SoltsiceContract[], privateKey?: string): Promise<DummyContract> {
    w3 = w3 || W3.default;
    if (!privateKey) {
      let contract = new DummyContract(deploymentParams, ctorParams, w3, link);
      await contract._instancePromise;
      return contract;
    } else {
      let data = DummyContract.newData(ctorParams, w3);
      let txHash = await w3.sendSignedTransaction(W3.zeroAddress, privateKey, data, deploymentParams);
      let txReceipt = await w3.waitTransactionReceipt(txHash);
      let rawAddress = txReceipt.contractAddress!;
      let contract = await DummyContract.at(rawAddress, w3);
      return contract;
    }
  }

  public static async at(address: string | object, w3?: W3): Promise<DummyContract> {
    let contract = new DummyContract(address, undefined, w3, undefined);
    await contract._instancePromise;
    return contract;
  }

  public static async deployed(w3?: W3): Promise<DummyContract> {
    let contract = new DummyContract('', undefined, w3, undefined);
    await contract._instancePromise;
    return contract;
  }

  // tslint:disable-next-line:max-line-length
  public static newData(ctorParams?: {_secret: BN | number, _wellKnown: BN | number, _array: BN[] | number[]}, w3?: W3): string {
    // tslint:disable-next-line:max-line-length
    let data = SoltsiceContract.newDataImpl(w3, DummyContract.artifacts, ctorParams ? [ctorParams!._secret, ctorParams!._wellKnown, ctorParams!._array] : []);
    return data;
  }



  protected constructor(
    deploymentParams: string | W3.TX.TxParams | object,
    ctorParams?: {_secret: BN | number, _wellKnown: BN | number, _array: BN[] | number[]},
    w3?: W3,
    link?: SoltsiceContract[]
  ) {
      // tslint:disable-next-line:max-line-length
      super(
        w3,
        DummyContract.artifacts,
        ctorParams ? [ctorParams!._secret, ctorParams!._wellKnown, ctorParams!._array] : [],
        deploymentParams,
        link
      );
  }
  /*
    Contract methods
  */
  
  // tslint:disable-next-line:max-line-length
  // tslint:disable-next-line:variable-name
  public array(_0: BN | number, txParams?: W3.TX.TxParams): Promise<BN> {
    return new Promise((resolve, reject) => {
      this._instance.array
        .call(_0, txParams || this._sendParams)
        .then((res: any) => resolve(res))
        .catch((err: any) => reject(err));
    });
  }
  
  // tslint:disable-next-line:member-ordering
  public renounceOwnership = Object.assign(
      // tslint:disable-next-line:max-line-length
      // tslint:disable-next-line:variable-name
      ( txParams?: W3.TX.TxParams, privateKey?: string): Promise<W3.TX.TransactionResult> => {
          if (!privateKey) {
            return new Promise((resolve, reject) => {
              this._instance.renounceOwnership( txParams || this._sendParams)
                .then((res: any) => resolve(res))
                .catch((err: any) => reject(err));
            });
          } else {
            // tslint:disable-next-line:max-line-length
            return this.w3.sendSignedTransaction(this.address, privateKey, this._instance.renounceOwnership.request().params[0].data, txParams || this._sendParams, undefined)
              .then(txHash => {
                return this.waitTransactionReceipt(txHash);
              });
          }
      },
      {
        // tslint:disable-next-line:max-line-length
        // tslint:disable-next-line:variable-name
        sendTransaction: Object.assign(( txParams?: W3.TX.TxParams): Promise<string> => {
              return new Promise((resolve, reject) => {
                this._instance.renounceOwnership.sendTransaction( txParams || this._sendParams)
                  .then((res: any) => resolve(res))
                  .catch((err: any) => reject(err));
              });
            },
            {
              // tslint:disable-next-line:max-line-length
              // tslint:disable-next-line:variable-name
              sendSigned: ( privateKey: string, txParams?: W3.TX.TxParams, nonce?: number): Promise<string> => {
                // tslint:disable-next-line:max-line-length
                return this.w3.sendSignedTransaction(this.address, privateKey, this._instance.renounceOwnership.request().params[0].data, txParams || this._sendParams, nonce);
              }
            }
        )
      },
      {
        // tslint:disable-next-line:max-line-length
        // tslint:disable-next-line:variable-name
        data: (): Promise<string> => {
          return new Promise((resolve, reject) => {
            resolve(this._instance.renounceOwnership.request().params[0].data);
          });
        }
      },
      {
        // tslint:disable-next-line:max-line-length
        // tslint:disable-next-line:variable-name
        estimateGas: (): Promise<number> => {
          return new Promise((resolve, reject) => {
            this._instance.renounceOwnership.estimateGas().then((g: any) => resolve(g)).catch((err: any) => reject(err));
          });
        }
      });
  
  // tslint:disable-next-line:max-line-length
  // tslint:disable-next-line:variable-name
  public owner( txParams?: W3.TX.TxParams): Promise<string> {
    return new Promise((resolve, reject) => {
      this._instance.owner
        .call( txParams || this._sendParams)
        .then((res: any) => resolve(res))
        .catch((err: any) => reject(err));
    });
  }
  
  // tslint:disable-next-line:max-line-length
  // tslint:disable-next-line:variable-name
  public isOwner( txParams?: W3.TX.TxParams): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this._instance.isOwner
        .call( txParams || this._sendParams)
        .then((res: any) => resolve(res))
        .catch((err: any) => reject(err));
    });
  }
  
  // tslint:disable-next-line:max-line-length
  // tslint:disable-next-line:variable-name
  public wellKnown( txParams?: W3.TX.TxParams): Promise<BN> {
    return new Promise((resolve, reject) => {
      this._instance.wellKnown
        .call( txParams || this._sendParams)
        .then((res: any) => resolve(res))
        .catch((err: any) => reject(err));
    });
  }
  
  // tslint:disable-next-line:member-ordering
  public transferOwnership = Object.assign(
      // tslint:disable-next-line:max-line-length
      // tslint:disable-next-line:variable-name
      (newOwner: string, txParams?: W3.TX.TxParams, privateKey?: string): Promise<W3.TX.TransactionResult> => {
          if (!privateKey) {
            return new Promise((resolve, reject) => {
              this._instance.transferOwnership(newOwner, txParams || this._sendParams)
                .then((res: any) => resolve(res))
                .catch((err: any) => reject(err));
            });
          } else {
            // tslint:disable-next-line:max-line-length
            return this.w3.sendSignedTransaction(this.address, privateKey, this._instance.transferOwnership.request(newOwner).params[0].data, txParams || this._sendParams, undefined)
              .then(txHash => {
                return this.waitTransactionReceipt(txHash);
              });
          }
      },
      {
        // tslint:disable-next-line:max-line-length
        // tslint:disable-next-line:variable-name
        sendTransaction: Object.assign((newOwner: string, txParams?: W3.TX.TxParams): Promise<string> => {
              return new Promise((resolve, reject) => {
                this._instance.transferOwnership.sendTransaction(newOwner, txParams || this._sendParams)
                  .then((res: any) => resolve(res))
                  .catch((err: any) => reject(err));
              });
            },
            {
              // tslint:disable-next-line:max-line-length
              // tslint:disable-next-line:variable-name
              sendSigned: (newOwner: string, privateKey: string, txParams?: W3.TX.TxParams, nonce?: number): Promise<string> => {
                // tslint:disable-next-line:max-line-length
                return this.w3.sendSignedTransaction(this.address, privateKey, this._instance.transferOwnership.request(newOwner).params[0].data, txParams || this._sendParams, nonce);
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
            this._instance.transferOwnership.estimateGas(newOwner).then((g: any) => resolve(g)).catch((err: any) => reject(err));
          });
        }
      });
  
  // tslint:disable-next-line:max-line-length
  // tslint:disable-next-line:variable-name
  public getPrivate( txParams?: W3.TX.TxParams): Promise<BN> {
    return new Promise((resolve, reject) => {
      this._instance.getPrivate
        .call( txParams || this._sendParams)
        .then((res: any) => resolve(res))
        .catch((err: any) => reject(err));
    });
  }
  
  // tslint:disable-next-line:member-ordering
  public setPrivate = Object.assign(
      // tslint:disable-next-line:max-line-length
      // tslint:disable-next-line:variable-name
      (_newValue: BN | number, txParams?: W3.TX.TxParams, privateKey?: string): Promise<W3.TX.TransactionResult> => {
          if (!privateKey) {
            return new Promise((resolve, reject) => {
              this._instance.setPrivate(_newValue, txParams || this._sendParams)
                .then((res: any) => resolve(res))
                .catch((err: any) => reject(err));
            });
          } else {
            // tslint:disable-next-line:max-line-length
            return this.w3.sendSignedTransaction(this.address, privateKey, this._instance.setPrivate.request(_newValue).params[0].data, txParams || this._sendParams, undefined)
              .then(txHash => {
                return this.waitTransactionReceipt(txHash);
              });
          }
      },
      {
        // tslint:disable-next-line:max-line-length
        // tslint:disable-next-line:variable-name
        sendTransaction: Object.assign((_newValue: BN | number, txParams?: W3.TX.TxParams): Promise<string> => {
              return new Promise((resolve, reject) => {
                this._instance.setPrivate.sendTransaction(_newValue, txParams || this._sendParams)
                  .then((res: any) => resolve(res))
                  .catch((err: any) => reject(err));
              });
            },
            {
              // tslint:disable-next-line:max-line-length
              // tslint:disable-next-line:variable-name
              sendSigned: (_newValue: BN | number, privateKey: string, txParams?: W3.TX.TxParams, nonce?: number): Promise<string> => {
                // tslint:disable-next-line:max-line-length
                return this.w3.sendSignedTransaction(this.address, privateKey, this._instance.setPrivate.request(_newValue).params[0].data, txParams || this._sendParams, nonce);
              }
            }
        )
      },
      {
        // tslint:disable-next-line:max-line-length
        // tslint:disable-next-line:variable-name
        data: (_newValue: BN | number): Promise<string> => {
          return new Promise((resolve, reject) => {
            resolve(this._instance.setPrivate.request(_newValue).params[0].data);
          });
        }
      },
      {
        // tslint:disable-next-line:max-line-length
        // tslint:disable-next-line:variable-name
        estimateGas: (_newValue: BN | number): Promise<number> => {
          return new Promise((resolve, reject) => {
            this._instance.setPrivate.estimateGas(_newValue).then((g: any) => resolve(g)).catch((err: any) => reject(err));
          });
        }
      });
  
  // tslint:disable-next-line:max-line-length
  // tslint:disable-next-line:variable-name
  public getPublic( txParams?: W3.TX.TxParams): Promise<BN> {
    return new Promise((resolve, reject) => {
      this._instance.getPublic
        .call( txParams || this._sendParams)
        .then((res: any) => resolve(res))
        .catch((err: any) => reject(err));
    });
  }
  
  // tslint:disable-next-line:member-ordering
  public setPublic = Object.assign(
      // tslint:disable-next-line:max-line-length
      // tslint:disable-next-line:variable-name
      (_newValue: BN | number, txParams?: W3.TX.TxParams, privateKey?: string): Promise<W3.TX.TransactionResult> => {
          if (!privateKey) {
            return new Promise((resolve, reject) => {
              this._instance.setPublic(_newValue, txParams || this._sendParams)
                .then((res: any) => resolve(res))
                .catch((err: any) => reject(err));
            });
          } else {
            // tslint:disable-next-line:max-line-length
            return this.w3.sendSignedTransaction(this.address, privateKey, this._instance.setPublic.request(_newValue).params[0].data, txParams || this._sendParams, undefined)
              .then(txHash => {
                return this.waitTransactionReceipt(txHash);
              });
          }
      },
      {
        // tslint:disable-next-line:max-line-length
        // tslint:disable-next-line:variable-name
        sendTransaction: Object.assign((_newValue: BN | number, txParams?: W3.TX.TxParams): Promise<string> => {
              return new Promise((resolve, reject) => {
                this._instance.setPublic.sendTransaction(_newValue, txParams || this._sendParams)
                  .then((res: any) => resolve(res))
                  .catch((err: any) => reject(err));
              });
            },
            {
              // tslint:disable-next-line:max-line-length
              // tslint:disable-next-line:variable-name
              sendSigned: (_newValue: BN | number, privateKey: string, txParams?: W3.TX.TxParams, nonce?: number): Promise<string> => {
                // tslint:disable-next-line:max-line-length
                return this.w3.sendSignedTransaction(this.address, privateKey, this._instance.setPublic.request(_newValue).params[0].data, txParams || this._sendParams, nonce);
              }
            }
        )
      },
      {
        // tslint:disable-next-line:max-line-length
        // tslint:disable-next-line:variable-name
        data: (_newValue: BN | number): Promise<string> => {
          return new Promise((resolve, reject) => {
            resolve(this._instance.setPublic.request(_newValue).params[0].data);
          });
        }
      },
      {
        // tslint:disable-next-line:max-line-length
        // tslint:disable-next-line:variable-name
        estimateGas: (_newValue: BN | number): Promise<number> => {
          return new Promise((resolve, reject) => {
            this._instance.setPublic.estimateGas(_newValue).then((g: any) => resolve(g)).catch((err: any) => reject(err));
          });
        }
      });
  
  // tslint:disable-next-line:member-ordering
  public ArrayTypesTest = Object.assign(
      // tslint:disable-next-line:max-line-length
      // tslint:disable-next-line:variable-name
      (_array: BN[] | number[], txParams?: W3.TX.TxParams, privateKey?: string): Promise<W3.TX.TransactionResult> => {
          if (!privateKey) {
            return new Promise((resolve, reject) => {
              this._instance.ArrayTypesTest(_array, txParams || this._sendParams)
                .then((res: any) => resolve(res))
                .catch((err: any) => reject(err));
            });
          } else {
            // tslint:disable-next-line:max-line-length
            return this.w3.sendSignedTransaction(this.address, privateKey, this._instance.ArrayTypesTest.request(_array).params[0].data, txParams || this._sendParams, undefined)
              .then(txHash => {
                return this.waitTransactionReceipt(txHash);
              });
          }
      },
      {
        // tslint:disable-next-line:max-line-length
        // tslint:disable-next-line:variable-name
        sendTransaction: Object.assign((_array: BN[] | number[], txParams?: W3.TX.TxParams): Promise<string> => {
              return new Promise((resolve, reject) => {
                this._instance.ArrayTypesTest.sendTransaction(_array, txParams || this._sendParams)
                  .then((res: any) => resolve(res))
                  .catch((err: any) => reject(err));
              });
            },
            {
              // tslint:disable-next-line:max-line-length
              // tslint:disable-next-line:variable-name
              sendSigned: (_array: BN[] | number[], privateKey: string, txParams?: W3.TX.TxParams, nonce?: number): Promise<string> => {
                // tslint:disable-next-line:max-line-length
                return this.w3.sendSignedTransaction(this.address, privateKey, this._instance.ArrayTypesTest.request(_array).params[0].data, txParams || this._sendParams, nonce);
              }
            }
        )
      },
      {
        // tslint:disable-next-line:max-line-length
        // tslint:disable-next-line:variable-name
        data: (_array: BN[] | number[]): Promise<string> => {
          return new Promise((resolve, reject) => {
            resolve(this._instance.ArrayTypesTest.request(_array).params[0].data);
          });
        }
      },
      {
        // tslint:disable-next-line:max-line-length
        // tslint:disable-next-line:variable-name
        estimateGas: (_array: BN[] | number[]): Promise<number> => {
          return new Promise((resolve, reject) => {
            this._instance.ArrayTypesTest.estimateGas(_array).then((g: any) => resolve(g)).catch((err: any) => reject(err));
          });
        }
      });
  
  // tslint:disable-next-line:max-line-length
  // tslint:disable-next-line:variable-name
  public funcArrayInArguments(_array: string[], txParams?: W3.TX.TxParams): Promise<string[]> {
    return new Promise((resolve, reject) => {
      this._instance.funcArrayInArguments
        .call(_array, txParams || this._sendParams)
        .then((res: any) => resolve(res))
        .catch((err: any) => reject(err));
    });
  }
  
}
