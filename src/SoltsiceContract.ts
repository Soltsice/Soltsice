import contract = require('truffle-contract');
import { W3 } from './';
import SolidityCoder = require('web3/lib/solidity/coder.js');

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
        let ct = w3.web3.eth.contract(tokenArtifacts.abi);
        let data = ct.new.getData(...constructorParams!, { data: tokenArtifacts.bytecode });
        return data;
    }

    protected constructor(web3?: W3,
        tokenArtifacts?: any,
        constructorParams?: W3.TX.ContractDataType[],
        deploymentParams?: string | W3.TX.TxParams | object,
        link?: SoltsiceContract[]) {
        if (!web3) {
            web3 = W3.default;
        }
        this.w3 = web3;

        if (typeof deploymentParams === 'string' && deploymentParams !== '' && !W3.isValidAddress(deploymentParams as string)) {
            throw 'Invalid deployed contract address';
        }

        this._Contract = contract(tokenArtifacts);
        this._Contract.setProvider(web3.currentProvider);

        function instanceOfTxParams(obj: any): obj is W3.TX.TxParams {
            return 'from' in obj && 'gas' in obj && 'gasPrice' in obj && 'value' in obj;
        }

        let linkage = new Promise<any>(async (resolve, reject) => {
            if (link && link.length > 0) {
                let network = +(await this.w3.networkId);
                this._Contract.setNetwork(network);
                link.forEach(async element => {
                    let inst = await element._instancePromise;
                    this._Contract.link(element._Contract.contractName, inst.address);
                });
                resolve(true);
            } else {
                resolve(true);
            }
        });

        let instance = new Promise<any>(async (resolve, reject) => {
            await linkage;
            if (this.w3.defaultAccount) {
                this._sendParams = W3.TX.txParamsDefaultSend(this.w3.defaultAccount);
                if (await this.w3.networkId !== '1') {
                    this._sendParams.gasPrice = 20000000000; // 20 Gwei, tests are too slow with the 2 Gwei default one
                }
            }

            let useDeployed = async () => {
                let network = +(await this.w3.networkId);
                this._Contract.setNetwork(network);
                this._Contract.deployed().then((inst: any) => {
                    this.transactionHash = inst.transactionHash;
                    if (!SoltsiceContract.silent) {
                        console.log('SOLTSICE: USING DEPLOYED CONTRACT', this.constructor.name, ' at ', deploymentParams!);
                    }
                    resolve(inst);
                }).catch((err: any) => {
                    reject(err);
                });
            };

            let useExisting = (address: string) => {
                if (!SoltsiceContract.silent) {
                    console.log('SOLTSICE: USING EXISTING CONTRACT', this.constructor.name, ' at ', deploymentParams!);
                }
                this._Contract.at(address).then((inst) => {
                    this.transactionHash = inst.transactionHash;
                    resolve(inst);
                }).catch((err) => {
                    reject(err);
                });
            };

            if (!deploymentParams) {
                useDeployed();
            } else if (typeof deploymentParams === 'string') {
                useExisting(deploymentParams!);
            } else if (instanceOfTxParams(deploymentParams)) {
                this._Contract.new(...constructorParams!, deploymentParams).then((inst) => {
                    if (!SoltsiceContract.silent) {
                        console.log('SOLTSICE: DEPLOYED NEW CONTRACT ', this.constructor.name, ' at ', inst.address);
                    }
                    this.transactionHash = inst.transactionHash;
                    resolve(inst);
                }).catch((err) => {
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

    public async parseLogs(logs: W3.Log[]): Promise<W3.Log[]> {
        let web3 = this.w3;
        let inst = await this.instance;
        let abi = inst.abi;

        return logs!.map((log) => {
            let logABI: any = null;

            for (let i = 0; i < abi.length; i++) {
                let item = abi[i];
                if (item.type !== 'event') {
                    continue;
                }
                // tslint:disable-next-line:max-line-length
                let signature = item.name + '(' + item.inputs.map(function (input: any) { return input.type; }).join(',') + ')';
                let hash = this.w3.web3.sha3(signature);
                if (hash === log.topics![0]) {
                    logABI = item;
                    break;
                }
            }
            if (logABI != null) {
                // Adapted from truffle-contract
                let copy = Object.assign({}, log);

                let decode = (fullABI, indexed, data) => {
                    let _inputs = fullABI.inputs.filter(function (input: any) {
                        return input.indexed === indexed;
                    });

                    let partial = {
                        inputs: _inputs,
                        name: fullABI.name,
                        type: fullABI.type,
                        anonymous: fullABI.anonymous
                    };

                    let types = partial.inputs.map(x => x.type);
                    let params = SolidityCoder.decodeParams(types, data);
                    let temp = {};

                    for (let index = 0; index < _inputs.length; index++) {
                        temp[_inputs[index].name] = params[index];
                    }

                    return temp;
                };

                let argTopics = logABI.anonymous ? copy.topics : copy.topics!.slice(1);
                let indexedData = argTopics!.map(function (topics: string) { return topics.slice(2); }).join('');
                // tslint:disable-next-line:max-line-length
                let indexedParams = decode(logABI, true, indexedData);

                let notIndexedData = copy.data!.replace('0x', '');
                // tslint:disable-next-line:max-line-length
                let notIndexedParams = decode(logABI, false, notIndexedData);

                copy.event = logABI.name;

                copy.args = logABI.inputs.reduce(function (acc: any, current: any) {
                    let val = indexedParams[current.name];

                    if (val === undefined) {
                        val = notIndexedParams[current.name];
                    }

                    acc[current.name] = val;
                    return acc;
                }, {});

                Object.keys(copy.args).forEach(function (key: any) {
                    let val = copy.args[key];

                    // We have BN. Convert it to BigNumber
                    if (val.constructor.isBN) {
                        copy.args[key] = web3.toBigNumber('0x' + val.toString(16));
                    }
                });

                delete copy.data;
                delete copy.topics;

                return copy;

            } else {
                return undefined;
            }

        }).filter(d => d) as W3.Log[];
    }

    public async parseReceipt(receipt: W3.TransactionReceipt): Promise<W3.Log[]> {
        if (!receipt.logs) {
            return [];
        }
        return this.parseLogs(receipt.logs);
    }

    /** Get transaction result by hash. Returns receipt + parsed logs. */
    public getTransactionResult(txHash: string): Promise<W3.TX.TransactionResult> {
        return new Promise<W3.TX.TransactionResult>((resolve, reject) => {
            this.w3.web3.eth.getTransactionReceipt(txHash, async (err, receipt) => {
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
            var timeout = 240000;
            var start = new Date().getTime();
            let makeAttempt = () => {
                this.w3.web3.eth.getTransactionReceipt(hashString, async (err, receipt) => {
                    if (err) { return reject(err); }

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
                        return reject(new Error('Transaction ' + hashString + ' wasn\'t processed in ' + (timeout / 1000) + ' seconds!'));
                    }

                    setTimeout(makeAttempt, 1000);
                });
            };

            makeAttempt();
        });
    }

    public async newFilter(fromBlock: number, toBlock?: number): Promise<number> {
        let toBlock1 = toBlock ? this.w3.fromDecimal(toBlock) : 'latest';
        const id = 'W3:' + W3.getNextCounter();
        let filter = await this.w3.sendRPC({
            jsonrpc: '2.0',
            method: 'eth_newFilter',
            params: [{
                'fromBlock': this.w3.fromDecimal(fromBlock),
                'toBlock': toBlock1,
                'address': await this.address
            }],
            id: id,
        }).then(async r => {
            if (r.error) {
                throw 'Cannot set filter';
            }
            return r.result as number;
        });
        return this.w3.toBigNumber(filter).toNumber(); // filter
    }

    public async uninstallFilter(filter: number): Promise<boolean> {
        const id = 'W3:' + W3.getNextCounter();
        let ret = await this.w3.sendRPC({
            jsonrpc: '2.0',
            method: 'eth_uninstallFilter',
            params: [this.w3.fromDecimal(filter)],
            id: id,
        }).then(async r => {
            if (r.error) {
                throw 'Cannot uninstall filter';
            }
            return r.result as boolean;
        });
        return ret;
    }

    public async getFilterChanges(filter: number): Promise<W3.Log[]> {
        const id = 'W3:' + W3.getNextCounter();

        let logs = this.w3.sendRPC({
            jsonrpc: '2.0',
            method: 'eth_getFilterChanges',
            params: [this.w3.fromDecimal(filter)],
            id: id,
        }).then(async r => {
            if (r.error) {
                console.log('FILTER ERR: ', r);
                return [];
            }
            console.log('FILTER: ', r);
            let parsed = await this.parseLogs(r.result as W3.Log[]);
            return parsed;
        });
        return logs;
    }

    public async getFilterLogs(filter: number): Promise<W3.Log[]> {
        const id = 'W3:' + W3.getNextCounter();

        let logs = this.w3.sendRPC({
            jsonrpc: '2.0',
            method: 'eth_getFilterLogs',
            params: [this.w3.fromDecimal(filter)],
            id: id,
        }).then(async r => {
            if (r.error) {
                return [];
            }
            let parsed = await this.parseLogs(r.result as W3.Log[]);
            return parsed;
        });
        return logs;
    }

    /** Get all events starting from the given block number. */
    public async getLogs(fromBlock?: number, toBlock?: number, eventName?: string, filter?: object): Promise<W3.Log[]> {

        if (!fromBlock) {
            fromBlock = await this.w3.blockNumber;
        }

        if (toBlock && toBlock < fromBlock) {
            throw new Error('toBlock is less than FromBlock');
        }

        let toBlock1 = toBlock ? this.w3.fromDecimal(toBlock) : 'latest';

        if (eventName) {
            if (filter) {
                console.warn('Unused filter parameter without event name.');
            }
            return new Promise<W3.Log[]>(async (resolve, reject) => {
                (await this.instance).allEvents({ fromBlock: fromBlock, toBlock: toBlock1 }).get((error, log) => {
                    if (error) {
                        reject(error);
                    }
                    resolve(log);
                });
            });
        } else {
            filter = filter || {};
            return new Promise<W3.Log[]>(async (resolve, reject) => {
                (await this.instance)[eventName!](filter, { fromBlock: fromBlock, toBlock: toBlock1 }).get((error, log) => {
                    if (error) {
                        reject(error);
                    }
                    resolve(log);
                });
            });
        }
    }

    public allEvents(fromBlock?: number, eventName?: string, filter?: object, cancellationToken?: W3.CancellationToken) {

        filter = filter || {};

        if (eventName) {
            throw new Error('not implemented yet');
        }

        let th = this;

        let i = async function* () {
            if (!fromBlock) {
                fromBlock = await th.w3.blockNumber;
            }

            let lastUsedFromBlock = fromBlock;
            while (!cancellationToken || !cancellationToken.cancelled) {
                let logs = await th.getLogs(lastUsedFromBlock, undefined, eventName, filter);
                if (logs && logs.length > 0) {
                    yield* logs;
                    lastUsedFromBlock = logs[logs.length - 1].blockNumber;
                }

                let newBlock = 0;
                // always first loop
                while (true) {
                    newBlock = await th.w3.blockNumber;
                    if (newBlock > lastUsedFromBlock) {
                        // GT doesn't guarantee than newBlock = lastUsedFromBlock + 1, due to some delays it could be greater by more than 1
                        lastUsedFromBlock = lastUsedFromBlock + 1;
                        break;
                    }
                    // wait 3 seconds, approx. half new block period
                    await new Promise(resolve => setTimeout(resolve, 3000));
                }
            }
        };
        return i();
    }

    // tslint:disable-next-line:member-ordering
    public static Events = class {
        public contract: SoltsiceContract;
        constructor(c: SoltsiceContract) {
            this.contract = c;
        }
        public MyEvent(fromBlock?: number, filter?: object, cancellationToken?: W3.CancellationToken) {
            // usage:
            // for await (const x of await this.events.MyEvent(...)) {
            //     console.log(x);
            // }
            return this.contract.allEvents(fromBlock, 'MyEvent', filter, cancellationToken);
        }

        public MyEvent1(fromBlock?: number, filter?: object, cancellationToken?: W3.CancellationToken) {
            // usage:
            // for await (const x of await this.events.MyEvent(...)) {
            //     console.log(x);
            // }
            return this.contract.allEvents(fromBlock, 'MyEvent', filter, cancellationToken);
        }
        public MyEvent2(fromBlock?: number, filter?: object, cancellationToken?: W3.CancellationToken) {
            // usage:
            // for await (const x of await this.events.MyEvent(...)) {
            //     console.log(x);
            // }
            return this.contract.allEvents(fromBlock, 'MyEvent', filter, cancellationToken);
        }
        public MyEvent3(fromBlock?: number, filter?: object, cancellationToken?: W3.CancellationToken) {
            // usage:
            // for await (const x of await this.events.MyEvent(...)) {
            //     console.log(x);
            // }
            return this.contract.allEvents(fromBlock, 'MyEvent', filter, cancellationToken);
        }
        public MyEvent4(fromBlock?: number, filter?: object, cancellationToken?: W3.CancellationToken) {
            // usage:
            // for await (const x of await this.events.MyEvent(...)) {
            //     console.log(x);
            // }
            return this.contract.allEvents(fromBlock, 'MyEvent', filter, cancellationToken);
        }
        public MyEvent5(fromBlock?: number, filter?: object, cancellationToken?: W3.CancellationToken) {
            // usage:
            // for await (const x of await this.events.MyEvent(...)) {
            //     console.log(x);
            // }
            return this.contract.allEvents(fromBlock, 'MyEvent', filter, cancellationToken);
        }
        public MyEvent6(fromBlock?: number, filter?: object, cancellationToken?: W3.CancellationToken) {
            // usage:
            // for await (const x of await this.events.MyEvent(...)) {
            //     console.log(x);
            // }
            return this.contract.allEvents(fromBlock, 'MyEvent', filter, cancellationToken);
        }
        public MyEvent7(fromBlock?: number, filter?: object, cancellationToken?: W3.CancellationToken) {
            // usage:
            // for await (const x of await this.events.MyEvent(...)) {
            //     console.log(x);
            // }
            return this.contract.allEvents(fromBlock, 'MyEvent', filter, cancellationToken);
        }
        public MyEvent8(fromBlock?: number, filter?: object, cancellationToken?: W3.CancellationToken) {
            // usage:
            // for await (const x of await this.events.MyEvent(...)) {
            //     console.log(x);
            // }
            return this.contract.allEvents(fromBlock, 'MyEvent', filter, cancellationToken);
        }
        public MyEvent9(fromBlock?: number, filter?: object, cancellationToken?: W3.CancellationToken) {
            // usage:
            // for await (const x of await this.events.MyEvent(...)) {
            //     console.log(x);
            // }
            return this.contract.allEvents(fromBlock, 'MyEvent', filter, cancellationToken);
        }
        public MyEvent10(fromBlock?: number, filter?: object, cancellationToken?: W3.CancellationToken) {
            // usage:
            // for await (const x of await this.events.MyEvent(...)) {
            //     console.log(x);
            // }
            return this.contract.allEvents(fromBlock, 'MyEvent', filter, cancellationToken);
        }

    };

    // tslint:disable-next-line:member-ordering
    private _events = new SoltsiceContract.Events(this);

    public get events() { return this._events; }

}
