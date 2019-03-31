/**
 * @jest-environment node
 */
import contract = require('truffle-contract'); // TODO rename to truffleContract
import { W3, TransactionReceipt } from './W3';

// import * as AbiCoder from 'web3-eth-abi';
// console.log('ABI CODER: ' + AbiCoder);
// const SolidityCoder = AbiCoder();

/**
 * Base contract for all Soltsice contracts
 */
export class SoltsiceContract {
  public static silent: boolean = false;
  public transactionHash: Promise<string>;
  public w3: W3;
  protected _Contract: any;
  /** Truffle-contract instance. Use it if Soltsice doesn't support some features yet */
  protected _instance: any;
  protected _instancePromise: Promise<any>;
  protected _sendParams: W3.TX.TxParams;

  protected static newDataImpl(w3?: W3, tokenArtifacts?: any, constructorParams?: W3.TX.ContractDataType[]): string {
    if (!w3) {
      w3 = W3.default;
    }
    let ct = new w3.eth.Contract(tokenArtifacts.abi);
    console.log('PARAMS: ' + JSON.stringify(constructorParams));
    let deploy = ct.deploy({ data: tokenArtifacts.bytecode, arguments: constructorParams });
    let data = deploy.encodeABI();
    return data;
  }

  protected constructor(
    web3?: W3,
    tokenArtifacts?: any,
    constructorParams?: W3.TX.ContractDataType[],
    deploymentParams?: string | W3.TX.TxParams | object,
    link?: SoltsiceContract[]
  ) {
    if (!web3) {
      web3 = W3.default;
    }
    this.w3 = web3;

    if (
      typeof deploymentParams === 'string' &&
      deploymentParams !== '' &&
      !W3.isValidAddress(deploymentParams as string)
    ) {
      throw 'Invalid deployed contract address';
    }

    this._Contract = contract(tokenArtifacts);
    const bytecode = this._Contract.bytecode;
    this._Contract.setProvider(web3.currentProvider);

    function instanceOfTxParams(obj: any): obj is W3.TX.TxParams {
      return 'from' in obj && 'gas' in obj && 'gasPrice' in obj && 'value' in obj;
    }

    let linkage = new Promise<any>(async (resolve, reject) => {
      // TODO take bytecode from TC, deploy with Web3
      if (link && link.length > 0) {
        let network = +(await this.w3.networkId);
        this._Contract.setNetwork(network);
        link.forEach(async element => {
          let inst = await element._instancePromise;
          this._Contract.link(element._Contract.contractName, inst.address);
        });
      }
      resolve(true);
    });

    let instance = new Promise<any>(async (resolve, reject) => {
      await linkage;
      if (this.w3.defaultAccount) {
        this._sendParams = W3.TX.txParamsDefaultSend(this.w3.defaultAccount);
        if ((await this.w3.networkId) !== 1) {
          this._sendParams.gasPrice = 20000000000; // 20 Gwei, tests are too slow with the 2 Gwei default one
        }
      }

      let useDeployed = async () => {
        let network = +(await this.w3.networkId);
        this._Contract.setNetwork(network);
        this._Contract
          .deployed()
          .then((inst: any) => {
            this.transactionHash = inst.transactionHash;
            if (!SoltsiceContract.silent) {
              console.log('SOLTSICE: USING DEPLOYED CONTRACT', this.constructor.name, ' at ', deploymentParams!);
            }
            resolve(inst);
          })
          .catch((err: any) => {
            reject(err);
          });
      };

      let useExisting = (address: string) => {
        if (!SoltsiceContract.silent) {
          console.log('SOLTSICE: USING EXISTING CONTRACT', this.constructor.name, ' at ', deploymentParams!);
        }
        this._Contract
          .at(address)
          .then(inst => {
            this.transactionHash = inst.transactionHash;
            resolve(inst);
          })
          .catch(err => {
            reject(err);
          });
      };

      if (!deploymentParams) {
        useDeployed();
      } else if (typeof deploymentParams === 'string') {
        useExisting(deploymentParams!);
      } else if (instanceOfTxParams(deploymentParams)) {
        const bytecode = this._Contract.bytecode;
        const options = {
          from: deploymentParams.from,
          gasPrice: deploymentParams.gasPrice.toString(),
          gas: deploymentParams.gas as number, // TODO what a mess here! Drop or sync TxParams for ContractOption?
          data: bytecode
        };
        const ct = new this.w3.eth.Contract(tokenArtifacts.abi); //, undefined, options);
        const deploy = ct.deploy({ data: tokenArtifacts.bytecode, arguments: constructorParams });
        const gasEstimate = await deploy.estimateGas();
        deploy
          .send({
            from: deploymentParams.from,
            gas: deploymentParams.gas as number,

            gasPrice: deploymentParams.gasPrice.toString()
          })
          .on('error', error => {
            console.log(error);
          })
          .on('transactionHash', transactionHash => {
            console.log(transactionHash);
          })
          .on('receipt', receipt => {
            console.log(receipt.contractAddress); // contains the new contract address
          })
          .on('confirmation', (confirmationNumber, receipt) => {
            console.log(confirmationNumber);
          })
          // this._Contract
          //   .new(...constructorParams!, deploymentParams)
          .then(inst => {
            if (!SoltsiceContract.silent) {
              console.log('SOLTSICE: DEPLOYED NEW CONTRACT ', this.constructor.name, ' at ', inst.options.address);
            }
            this.transactionHash = (inst as any).transactionHash;
            resolve(inst);
          })
          .catch(err => {
            reject(err);
          });
      } else if ((<any>deploymentParams).address && typeof (<any>deploymentParams).address === 'string') {
        // support any object with address property
        useExisting((<any>deploymentParams).address);
      }
    });

    this._instancePromise = instance.then(i => {
      this._instance = i;
      return i;
    });
  }

  public get address(): string {
    return this._instance.address;
  }

  public get instance(): any {
    return this._instance;
  }

  /** Default tx params for sending transactions. */
  public get sendTxParams() {
    return this._sendParams;
  }

  /** Send a transaction to the fallback function */
  public async sendTransaction(txParams?: W3.TX.TxParams): Promise<W3.TX.TransactionResult> {
    txParams = txParams || this._sendParams;
    if (!txParams) {
      throw new Error('Default tx parameters are not set.');
    }
    let instance = await this.instance;
    return instance.sendTransaction(txParams);
  }

  public async parseLogs(logs: W3.Log[]): Promise<W3.EventLog[]> {
    let inst = await this.instance;
    let abi = inst.abi;

    return logs!
      .map(log => {
        let logABI: any = null;
        let signature: string | null = null;
        for (let i = 0; i < abi.length; i++) {
          let item = abi[i];
          if (item.type !== 'event') {
            continue;
          }
          // tslint:disable-next-line:max-line-length
          signature =
            item.name +
            '(' +
            item.inputs
              .map(function(input: any) {
                return input.type;
              })
              .join(',') +
            ')';
          let hash = this.w3.utils.sha3(signature);
          if (hash === log.topics![0]) {
            logABI = item;
            break;
          }
        }
        if (logABI != null) {
          // Adapted from truffle-contract
          let copy = Object.assign({}, log);

          let decode = (fullABI, indexed, data) => {
            let _inputs = fullABI.inputs.filter(function(input: any) {
              return input.indexed === indexed;
            });

            let partial = {
              inputs: _inputs,
              name: fullABI.name,
              type: fullABI.type,
              anonymous: fullABI.anonymous
            };

            let types = partial.inputs.map(x => x.type);
            let params = this.w3.eth.abi.decodeParameters(types, data);
            let temp = {};

            for (let index = 0; index < _inputs.length; index++) {
              temp[_inputs[index].name] = params[index];
            }

            return temp;
          };

          let argTopics = logABI.anonymous ? copy.topics : copy.topics!.slice(1);
          let indexedData = argTopics!
            .map(function(topics: string) {
              return topics.slice(2);
            })
            .join('');
          // tslint:disable-next-line:max-line-length
          let indexedParams = decode(logABI, true, indexedData);

          let notIndexedData = copy.data!.replace('0x', '');
          // tslint:disable-next-line:max-line-length
          let notIndexedParams = decode(logABI, false, notIndexedData);

          copy.event = logABI.name;

          copy.args = logABI.inputs.reduce(function(acc: any, current: any) {
            let val = indexedParams[current.name];

            if (val === undefined) {
              val = notIndexedParams[current.name];
            }

            acc[current.name] = val;
            return acc;
          }, {});

          // TODO delete, we now use BN
          // Object.keys(copy.args).forEach(function (key: any) {
          //     let val = copy.args[key];

          //     // We have BN. Convert it to BigNumber
          //     if (val.constructor.isBN) {
          //         copy.args[key] = web3.toBigNumber('0x' + val.toString(16));
          //     }
          // });

          // fill interface for EventLogs
          (copy as any).signature = signature;
          (copy as any).returnValues = copy.args;
          (copy as any).raw = { data: copy.data || '', topics: copy.topics || [] };

          // These are optional on Log interface, keep them
          // delete copy.data;
          // delete copy.topics;

          return copy;
        } else {
          return undefined;
        }
      })
      .filter(d => d) as W3.EventLog[];
  }

  public async parseReceipt(receipt: TransactionReceipt): Promise<W3.Log[]> {
    if (!receipt.logs) {
      return [];
    }
    return this.parseLogs(receipt.logs as W3.Log[]);
  }

  /** Get transaction result by hash. Returns receipt + parsed logs. */
  public getTransactionResult(txHash: string): Promise<W3.TX.TransactionResult> {
    return new Promise<W3.TX.TransactionResult>((resolve, reject) => {
      this.w3.eth.getTransactionReceipt(txHash, async (err, receipt) => {
        if (err) {
          reject(err);
        } else {
          if (!receipt) {
            reject('Receipt is falsy, transaction does not exists or was not mined yet.');
          } else {
            try {
              let result: W3.TX.TransactionResult = {} as W3.TX.TransactionResult;
              result.tx = receipt.transactionHash;
              result.receipt = receipt;
              result.logs = await this.parseReceipt(receipt);
              resolve(result);
            } catch (e) {
              reject({ error: e, description: 'Unhandled exception' });
            }
          }
        }
      });
    });
  }

  public async waitTransactionReceipt(hashString: string): Promise<W3.TX.TransactionResult> {
    return new Promise<W3.TX.TransactionResult>((accept, reject) => {
      var timeout = this.w3.defaultTimeout * 1000;
      var start = new Date().getTime();
      let makeAttempt = () => {
        this.w3.eth.getTransactionReceipt(hashString, async (err, receipt) => {
          if (err) {
            return reject(err);
          }

          if (receipt != null) {
            try {
              let result: W3.TX.TransactionResult = {} as W3.TX.TransactionResult;
              result.tx = receipt.transactionHash;
              result.receipt = receipt;
              result.logs = await this.parseReceipt(receipt);
              accept(result);
            } catch (e) {
              reject({ error: e, description: 'Unhandled exception' });
            }
          }

          if (timeout > 0 && new Date().getTime() - start > timeout) {
            return reject(
              new Error(
                'Transaction ' +
                  hashString +
                  " wasn't processed in " +
                  timeout / 1000 +
                  ' seconds! You may increase the w3.defaultTimeout property on w3 instance.'
              )
            );
          }

          setTimeout(makeAttempt, 1000);
        });
      };

      makeAttempt();
    });
  }

  public async newFilter(fromBlock: number, toBlock?: number): Promise<number> {
    let toBlock1 = toBlock ? this.w3.utils.fromDecimal(toBlock) : 'latest';
    let filter = await this.w3
      .send('eth_newFilter', [
        {
          fromBlock: this.w3.utils.fromDecimal(fromBlock),
          toBlock: toBlock1,
          address: await this.address
        }
      ])
      .then(async r => {
        return r as number;
      });
    return this.w3.utils.toBN(filter).toNumber(); // filter
  }

  public async uninstallFilter(filter: number): Promise<boolean> {
    let ret = await this.w3.send('eth_uninstallFilter', [this.w3.utils.fromDecimal(filter)]).then(async r => {
      return r as boolean;
    });
    return ret;
  }

  public async getFilterChanges(filter: number): Promise<W3.Log[]> {
    let logs = this.w3.send('eth_getFilterChanges', [this.w3.utils.fromDecimal(filter)]).then(async r => {
      console.log('FILTER: ', r);
      let parsed = await this.parseLogs(r as W3.Log[]);
      return parsed;
    });
    return logs;
  }

  public async getFilterLogs(filter: number): Promise<W3.Log[]> {
    let logs = this.w3.send('eth_getFilterLogs', [this.w3.utils.fromDecimal(filter)]).then(async r => {
      let parsed = await this.parseLogs(r as W3.Log[]);
      return parsed;
    });
    return logs;
  }

  /** Get all events starting from the given block number. */
  public async getEventLogs(
    fromBlock?: number,
    toBlock?: number,
    eventName?: string,
    filter?: object
  ): Promise<W3.EventLog[]> {
    let fromBlock1 = fromBlock || 0;

    let toBlock1 = toBlock ? this.w3.utils.fromDecimal(toBlock) : 'latest';

    let topics: string[] = [];

    if (!eventName) {
      if (filter) {
        console.warn('Unused filter parameter without event name.');
      }
    } else {
      filter = filter || {};
      // encode filter params using web3 implementation detail, must use public method from web3 1.0 later
      topics = this.instance[eventName](filter).options.topics;
    }

    // Need to call manually in web3 0.20.x
    // https://github.com/ethereum/web3.js/issues/879#issuecomment-304164245
    let rpcResponse = await this.w3.send('eth_getLogs', [
      {
        fromBlock: this.w3.utils.fromDecimal(fromBlock1),
        toBlock: toBlock1,
        address: this.address,
        topics: topics
      }
    ]);

    let parsed = (await this.parseLogs(rpcResponse as W3.Log[])) as W3.EventLog[];

    return parsed;
  }

  ///////////// EVENTS PLAYGROUND BELOW ////////////////////

  // public allEvents(fromBlock?: number, eventName?: string, filter?: object, cancellationToken?: W3.CancellationToken) {

  //     filter = filter || {};

  //     if (eventName) {
  //         throw new Error('not implemented yet');
  //     }

  //     let th = this;

  //     let i = async function* () {
  //         if (!fromBlock) {
  //             fromBlock = await th.w3.blockNumber;
  //         }

  //         let lastUsedFromBlock = fromBlock;
  //         while (!cancellationToken || !cancellationToken.cancelled) {
  //             let logs = await th.getLogs(lastUsedFromBlock, undefined, eventName, filter);
  //             if (logs && logs.length > 0) {
  //                 yield* logs;
  //                 lastUsedFromBlock = logs[logs.length - 1].blockNumber;
  //             }

  //             let newBlock = 0;
  //             // always first loop
  //             while (true) {
  //                 newBlock = await th.w3.blockNumber;
  //                 if (newBlock > lastUsedFromBlock) {
  //                     // GT doesn't guarantee than newBlock = lastUsedFromBlock + 1, due to some delays it could be greater by more than 1
  //                     lastUsedFromBlock = lastUsedFromBlock + 1;
  //                     break;
  //                 }
  //                 // wait 3 seconds, approx. half new block period
  //                 await new Promise(resolve => setTimeout(resolve, 3000));
  //             }
  //         }
  //     };
  //     return i();
  // }

  // // tslint:disable-next-line:member-ordering
  // public static Events = class {
  //     public contract: SoltsiceContract;
  //     constructor(c: SoltsiceContract) {
  //         this.contract = c;
  //     }
  //     public MyEvent(fromBlock?: number, filter?: object, cancellationToken?: W3.CancellationToken) {
  //         // usage:
  //         // for await (const x of await this.events.MyEvent(...)) {
  //         //     console.log(x);
  //         // }
  //         return this.contract.allEvents(fromBlock, 'MyEvent', filter, cancellationToken);
  //     }

  //     public MyEvent1(fromBlock?: number, filter?: object, cancellationToken?: W3.CancellationToken) {
  //         // usage:
  //         // for await (const x of await this.events.MyEvent(...)) {
  //         //     console.log(x);
  //         // }
  //         return this.contract.allEvents(fromBlock, 'MyEvent', filter, cancellationToken);
  //     }
  //     public MyEvent2(fromBlock?: number, filter?: object, cancellationToken?: W3.CancellationToken) {
  //         // usage:
  //         // for await (const x of await this.events.MyEvent(...)) {
  //         //     console.log(x);
  //         // }
  //         return this.contract.allEvents(fromBlock, 'MyEvent', filter, cancellationToken);
  //     }
  //     public MyEvent3(fromBlock?: number, filter?: object, cancellationToken?: W3.CancellationToken) {
  //         // usage:
  //         // for await (const x of await this.events.MyEvent(...)) {
  //         //     console.log(x);
  //         // }
  //         return this.contract.allEvents(fromBlock, 'MyEvent', filter, cancellationToken);
  //     }
  //     public MyEvent4(fromBlock?: number, filter?: object, cancellationToken?: W3.CancellationToken) {
  //         // usage:
  //         // for await (const x of await this.events.MyEvent(...)) {
  //         //     console.log(x);
  //         // }
  //         return this.contract.allEvents(fromBlock, 'MyEvent', filter, cancellationToken);
  //     }
  //     public MyEvent5(fromBlock?: number, filter?: object, cancellationToken?: W3.CancellationToken) {
  //         // usage:
  //         // for await (const x of await this.events.MyEvent(...)) {
  //         //     console.log(x);
  //         // }
  //         return this.contract.allEvents(fromBlock, 'MyEvent', filter, cancellationToken);
  //     }
  //     public MyEvent6(fromBlock?: number, filter?: object, cancellationToken?: W3.CancellationToken) {
  //         // usage:
  //         // for await (const x of await this.events.MyEvent(...)) {
  //         //     console.log(x);
  //         // }
  //         return this.contract.allEvents(fromBlock, 'MyEvent', filter, cancellationToken);
  //     }
  //     public MyEvent7(fromBlock?: number, filter?: object, cancellationToken?: W3.CancellationToken) {
  //         // usage:
  //         // for await (const x of await this.events.MyEvent(...)) {
  //         //     console.log(x);
  //         // }
  //         return this.contract.allEvents(fromBlock, 'MyEvent', filter, cancellationToken);
  //     }
  //     public MyEvent8(fromBlock?: number, filter?: object, cancellationToken?: W3.CancellationToken) {
  //         // usage:
  //         // for await (const x of await this.events.MyEvent(...)) {
  //         //     console.log(x);
  //         // }
  //         return this.contract.allEvents(fromBlock, 'MyEvent', filter, cancellationToken);
  //     }
  //     public MyEvent9(fromBlock?: number, filter?: object, cancellationToken?: W3.CancellationToken) {
  //         // usage:
  //         // for await (const x of await this.events.MyEvent(...)) {
  //         //     console.log(x);
  //         // }
  //         return this.contract.allEvents(fromBlock, 'MyEvent', filter, cancellationToken);
  //     }
  //     public MyEvent10(fromBlock?: number, filter?: object, cancellationToken?: W3.CancellationToken) {
  //         // usage:
  //         // for await (const x of await this.events.MyEvent(...)) {
  //         //     console.log(x);
  //         // }
  //         return this.contract.allEvents(fromBlock, 'MyEvent', filter, cancellationToken);
  //     }

  // };

  // // tslint:disable-next-line:member-ordering
  // private _events = new SoltsiceContract.Events(this);

  // public get events() { return this._events; }
}
