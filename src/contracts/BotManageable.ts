
    import { BigNumber } from 'bignumber.js';
import { W3, SoltsiceContract } from '..';

/**
 * BotManageable API
 */
export class BotManageable extends SoltsiceContract {

  public static get artifacts() { return require('../artifacts/BotManageable.json'); }

  public static get bytecodeHash() {
    // we need this before ctor, but artifacts are static and we cannot pass it to the base class, so need to generate
    let artifacts = BotManageable.artifacts;
    if (!artifacts || !artifacts.bytecode) {
        return undefined;
    }
    let hash = W3.sha3(JSON.stringify(artifacts.bytecode));
    return hash;
  }

  // tslint:disable-next-line:max-line-length
  public static async new(deploymentParams: W3.TX.TxParams, ctorParams?: {_wallet: string}, w3?: W3, link?: SoltsiceContract[], privateKey?: string): Promise<BotManageable> {
    w3 = w3 || W3.default;
    if (!privateKey) {
      let contract = new BotManageable(deploymentParams, ctorParams, w3, link);
      await contract._instancePromise;
      return contract;
    } else {
      let data = BotManageable.newData(ctorParams, w3);
      let txHash = await w3.sendSignedTransaction(W3.zeroAddress, privateKey, data, deploymentParams);
      let txReceipt = await w3.waitTransactionReceipt(txHash);
      let rawAddress = txReceipt.contractAddress!;
      let contract = await BotManageable.at(rawAddress, w3);
      return contract;
    }
  }

  public static async at(address: string | object, w3?: W3): Promise<BotManageable> {
    let contract = new BotManageable(address, undefined, w3, undefined);
    await contract._instancePromise;
    return contract;
  }

  public static async deployed(w3?: W3): Promise<BotManageable> {
    let contract = new BotManageable('', undefined, w3, undefined);
    await contract._instancePromise;
    return contract;
  }

  // tslint:disable-next-line:max-line-length
  public static newData(ctorParams?: {_wallet: string}, w3?: W3): string {
    // tslint:disable-next-line:max-line-length
    let data = SoltsiceContract.newDataImpl(w3, BotManageable.artifacts, ctorParams ? [ctorParams!._wallet] : []);
    return data;
  }

  protected constructor(
    deploymentParams: string | W3.TX.TxParams | object,
    ctorParams?: {_wallet: string},
    w3?: W3,
    link?: SoltsiceContract[]
  ) {
      // tslint:disable-next-line:max-line-length
      super(
        w3,
        BotManageable.artifacts,
        ctorParams ? [ctorParams!._wallet] : [],
        deploymentParams,
        link
      );
  }
  /*
    Contract methods
  */
  
  // tslint:disable-next-line:max-line-length
  // tslint:disable-next-line:variable-name
  public isOwner(_address: string, txParams?: W3.TX.TxParams): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this._instance.isOwner
        .call(_address, txParams || this._sendParams)
        .then((res: any) => resolve(res))
        .catch((err: any) => reject(err));
    });
  }
  
  // tslint:disable-next-line:member-ordering
  public unpause = Object.assign(
      // tslint:disable-next-line:max-line-length
      // tslint:disable-next-line:variable-name
      ( txParams?: W3.TX.TxParams, privateKey?: string): Promise<W3.TX.TransactionResult> => {
          if (!privateKey) {
            return new Promise((resolve, reject) => {
              this._instance.unpause( txParams || this._sendParams)
                .then((res: any) => resolve(res))
                .catch((err: any) => reject(err));
            });
          } else {
            // tslint:disable-next-line:max-line-length
            return this.w3.sendSignedTransaction(this.address, privateKey, this._instance.unpause.request().params[0].data, txParams || this._sendParams, undefined)
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
                this._instance.unpause.sendTransaction( txParams || this._sendParams)
                  .then((res: any) => resolve(res))
                  .catch((err: any) => reject(err));
              });
            },
            {
              // tslint:disable-next-line:max-line-length
              // tslint:disable-next-line:variable-name
              sendSigned: ( privateKey: string, txParams?: W3.TX.TxParams, nonce?: number): Promise<string> => {
                // tslint:disable-next-line:max-line-length
                return this.w3.sendSignedTransaction(this.address, privateKey, this._instance.unpause.request().params[0].data, txParams || this._sendParams, nonce);
              }
            }
        )
      },
      {
        // tslint:disable-next-line:max-line-length
        // tslint:disable-next-line:variable-name
        data: (): Promise<string> => {
          return new Promise((resolve, reject) => {
            resolve(this._instance.unpause.request().params[0].data);
          });
        }
      },
      {
        // tslint:disable-next-line:max-line-length
        // tslint:disable-next-line:variable-name
        estimateGas: (): Promise<number> => {
          return new Promise((resolve, reject) => {
            this._instance.unpause.estimateGas().then((g: any) => resolve(g)).catch((err: any) => reject(err));
          });
        }
      });
  
  // tslint:disable-next-line:max-line-length
  // tslint:disable-next-line:variable-name
  public wallet( txParams?: W3.TX.TxParams): Promise<string> {
    return new Promise((resolve, reject) => {
      this._instance.wallet
        .call( txParams || this._sendParams)
        .then((res: any) => resolve(res))
        .catch((err: any) => reject(err));
    });
  }
  
  // tslint:disable-next-line:max-line-length
  // tslint:disable-next-line:variable-name
  public paused( txParams?: W3.TX.TxParams): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this._instance.paused
        .call( txParams || this._sendParams)
        .then((res: any) => resolve(res))
        .catch((err: any) => reject(err));
    });
  }
  
  // tslint:disable-next-line:member-ordering
  public pause = Object.assign(
      // tslint:disable-next-line:max-line-length
      // tslint:disable-next-line:variable-name
      ( txParams?: W3.TX.TxParams, privateKey?: string): Promise<W3.TX.TransactionResult> => {
          if (!privateKey) {
            return new Promise((resolve, reject) => {
              this._instance.pause( txParams || this._sendParams)
                .then((res: any) => resolve(res))
                .catch((err: any) => reject(err));
            });
          } else {
            // tslint:disable-next-line:max-line-length
            return this.w3.sendSignedTransaction(this.address, privateKey, this._instance.pause.request().params[0].data, txParams || this._sendParams, undefined)
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
                this._instance.pause.sendTransaction( txParams || this._sendParams)
                  .then((res: any) => resolve(res))
                  .catch((err: any) => reject(err));
              });
            },
            {
              // tslint:disable-next-line:max-line-length
              // tslint:disable-next-line:variable-name
              sendSigned: ( privateKey: string, txParams?: W3.TX.TxParams, nonce?: number): Promise<string> => {
                // tslint:disable-next-line:max-line-length
                return this.w3.sendSignedTransaction(this.address, privateKey, this._instance.pause.request().params[0].data, txParams || this._sendParams, nonce);
              }
            }
        )
      },
      {
        // tslint:disable-next-line:max-line-length
        // tslint:disable-next-line:variable-name
        data: (): Promise<string> => {
          return new Promise((resolve, reject) => {
            resolve(this._instance.pause.request().params[0].data);
          });
        }
      },
      {
        // tslint:disable-next-line:max-line-length
        // tslint:disable-next-line:variable-name
        estimateGas: (): Promise<number> => {
          return new Promise((resolve, reject) => {
            this._instance.pause.estimateGas().then((g: any) => resolve(g)).catch((err: any) => reject(err));
          });
        }
      });
  
  // tslint:disable-next-line:member-ordering
  public enableBot = Object.assign(
      // tslint:disable-next-line:max-line-length
      // tslint:disable-next-line:variable-name
      (_botAddress: string, txParams?: W3.TX.TxParams, privateKey?: string): Promise<W3.TX.TransactionResult> => {
          if (!privateKey) {
            return new Promise((resolve, reject) => {
              this._instance.enableBot(_botAddress, txParams || this._sendParams)
                .then((res: any) => resolve(res))
                .catch((err: any) => reject(err));
            });
          } else {
            // tslint:disable-next-line:max-line-length
            return this.w3.sendSignedTransaction(this.address, privateKey, this._instance.enableBot.request(_botAddress).params[0].data, txParams || this._sendParams, undefined)
              .then(txHash => {
                return this.waitTransactionReceipt(txHash);
              });
          }
      },
      {
        // tslint:disable-next-line:max-line-length
        // tslint:disable-next-line:variable-name
        sendTransaction: Object.assign((_botAddress: string, txParams?: W3.TX.TxParams): Promise<string> => {
              return new Promise((resolve, reject) => {
                this._instance.enableBot.sendTransaction(_botAddress, txParams || this._sendParams)
                  .then((res: any) => resolve(res))
                  .catch((err: any) => reject(err));
              });
            },
            {
              // tslint:disable-next-line:max-line-length
              // tslint:disable-next-line:variable-name
              sendSigned: (_botAddress: string, privateKey: string, txParams?: W3.TX.TxParams, nonce?: number): Promise<string> => {
                // tslint:disable-next-line:max-line-length
                return this.w3.sendSignedTransaction(this.address, privateKey, this._instance.enableBot.request(_botAddress).params[0].data, txParams || this._sendParams, nonce);
              }
            }
        )
      },
      {
        // tslint:disable-next-line:max-line-length
        // tslint:disable-next-line:variable-name
        data: (_botAddress: string): Promise<string> => {
          return new Promise((resolve, reject) => {
            resolve(this._instance.enableBot.request(_botAddress).params[0].data);
          });
        }
      },
      {
        // tslint:disable-next-line:max-line-length
        // tslint:disable-next-line:variable-name
        estimateGas: (_botAddress: string): Promise<number> => {
          return new Promise((resolve, reject) => {
            this._instance.enableBot.estimateGas(_botAddress).then((g: any) => resolve(g)).catch((err: any) => reject(err));
          });
        }
      });
  
  // tslint:disable-next-line:member-ordering
  public disableBot = Object.assign(
      // tslint:disable-next-line:max-line-length
      // tslint:disable-next-line:variable-name
      (_botAddress: string, _fromTimeStampSeconds: BigNumber | number, txParams?: W3.TX.TxParams, privateKey?: string): Promise<W3.TX.TransactionResult> => {
          if (!privateKey) {
            return new Promise((resolve, reject) => {
              this._instance.disableBot(_botAddress, _fromTimeStampSeconds, txParams || this._sendParams)
                .then((res: any) => resolve(res))
                .catch((err: any) => reject(err));
            });
          } else {
            // tslint:disable-next-line:max-line-length
            return this.w3.sendSignedTransaction(this.address, privateKey, this._instance.disableBot.request(_botAddress, _fromTimeStampSeconds).params[0].data, txParams || this._sendParams, undefined)
              .then(txHash => {
                return this.waitTransactionReceipt(txHash);
              });
          }
      },
      {
        // tslint:disable-next-line:max-line-length
        // tslint:disable-next-line:variable-name
        sendTransaction: Object.assign((_botAddress: string, _fromTimeStampSeconds: BigNumber | number, txParams?: W3.TX.TxParams): Promise<string> => {
              return new Promise((resolve, reject) => {
                this._instance.disableBot.sendTransaction(_botAddress, _fromTimeStampSeconds, txParams || this._sendParams)
                  .then((res: any) => resolve(res))
                  .catch((err: any) => reject(err));
              });
            },
            {
              // tslint:disable-next-line:max-line-length
              // tslint:disable-next-line:variable-name
              sendSigned: (_botAddress: string, _fromTimeStampSeconds: BigNumber | number, privateKey: string, txParams?: W3.TX.TxParams, nonce?: number): Promise<string> => {
                // tslint:disable-next-line:max-line-length
                return this.w3.sendSignedTransaction(this.address, privateKey, this._instance.disableBot.request(_botAddress, _fromTimeStampSeconds).params[0].data, txParams || this._sendParams, nonce);
              }
            }
        )
      },
      {
        // tslint:disable-next-line:max-line-length
        // tslint:disable-next-line:variable-name
        data: (_botAddress: string, _fromTimeStampSeconds: BigNumber | number): Promise<string> => {
          return new Promise((resolve, reject) => {
            resolve(this._instance.disableBot.request(_botAddress, _fromTimeStampSeconds).params[0].data);
          });
        }
      },
      {
        // tslint:disable-next-line:max-line-length
        // tslint:disable-next-line:variable-name
        estimateGas: (_botAddress: string, _fromTimeStampSeconds: BigNumber | number): Promise<number> => {
          return new Promise((resolve, reject) => {
            this._instance.disableBot.estimateGas(_botAddress, _fromTimeStampSeconds).then((g: any) => resolve(g)).catch((err: any) => reject(err));
          });
        }
      });
  
  // tslint:disable-next-line:max-line-length
  // tslint:disable-next-line:variable-name
  public isBot(_botAddress: string, txParams?: W3.TX.TxParams): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this._instance.isBot
        .call(_botAddress, txParams || this._sendParams)
        .then((res: any) => resolve(res))
        .catch((err: any) => reject(err));
    });
  }
  
  // tslint:disable-next-line:max-line-length
  // tslint:disable-next-line:variable-name
  public isBotAt(_botAddress: string, _atTimeStampSeconds: BigNumber | number, txParams?: W3.TX.TxParams): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this._instance.isBotAt
        .call(_botAddress, _atTimeStampSeconds, txParams || this._sendParams)
        .then((res: any) => resolve(res))
        .catch((err: any) => reject(err));
    });
  }
  
}
