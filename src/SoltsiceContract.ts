import contract = require('truffle-contract');
import { W3 } from './W3';
import SolidityCoder = require('web3/lib/solidity/coder.js');

/**
 * Base contract for all Soltsice contracts
 */
export class SoltsiceContract {
    public static Silent: boolean = false;
    public transactionHash: Promise<string>;
    public artifactsHash: Promise<string>;
    public w3: W3;
    protected _Contract: any;
    /** Truffle-contract instance. Use it if Soltsice doesn't support some features yet */
    protected _instance: Promise<any>;
    protected _sendParams: W3.TC.TxParams;

    protected constructor(web3?: W3,
        tokenArtifacts?: any,
        constructorParams?: W3.TC.ContractDataType[],
        deploymentParams?: string | W3.TC.TxParams | object,
        link?: SoltsiceContract[]) {
        if (!deploymentParams) {
            throw 'Generated classes must require deploymentParams in their ctor (TODO refactor this parent ctor)';
        }
        if (typeof deploymentParams === 'string' && !W3.isValidAddress(deploymentParams as string)) {
            throw 'Invalid deployed contract address';
        }
        if (!web3) {
            web3 = W3.Default;
        }
        this.w3 = web3;

        this._Contract = contract(tokenArtifacts);
        this._Contract.setProvider(web3.currentProvider);

        function instanceOfTxParams(obj: any): obj is W3.TC.TxParams {
            return 'from' in obj && 'gas' in obj && 'gasPrice' in obj && 'value' in obj;
        }

        let linkage = new Promise<any>(async (resolve, reject) => {
            if (link && link.length > 0) {
                let network = +(await this.w3.networkId);
                this._Contract.setNetwork(network);
                link.forEach(async element => {
                    let inst = await element._instance;
                    this._Contract.link(element._Contract.contractName, inst.address);
                });
                resolve(true);
            } else {
                resolve(true);
            }
        });

        let instance = new Promise(async (resolve, reject) => {
            await linkage;
            let accounts = await this.w3.accounts;
            if (accounts && accounts.length > 0) {
                this._sendParams = W3.TC.txParamsDefaultSend(accounts[0]);
            }

            let useDeployed = (address: string) => {
                if (!SoltsiceContract.Silent) {
                    console.log('SOLTSICE: USING EXISTING CONTRACT', this.constructor.name, ' at ', deploymentParams!);
                }
                this._Contract.at(address).then((inst) => {
                    this.transactionHash = inst.transactionHash;
                    resolve(inst);
                }).catch((err) => {
                    reject(err);
                });
            };
            if (typeof deploymentParams === 'string') {
                useDeployed(deploymentParams!);
            } else if (instanceOfTxParams(deploymentParams)) {
                this._Contract.new(...constructorParams!, deploymentParams).then((inst) => {
                    if (!SoltsiceContract.Silent) {
                        console.log('SOLTSICE: DEPLOYED NEW CONTRACT ', this.constructor.name, ' at ', inst.address);
                    }
                    this.transactionHash = inst.transactionHash;
                    resolve(inst);
                }).catch((err) => {
                    reject(err);
                });
            } else if ((<any>deploymentParams).address && typeof (<any>deploymentParams).address === 'string') {
                // support any object with address property
                useDeployed((<any>deploymentParams).address);
            }
        });

        this._instance = instance;
    }

    public async link(libraryContract: SoltsiceContract) {
        this._Contract.Link(await libraryContract.instance);
    }

    get address(): Promise<string> {
        return this._instance.then(i => i.address);
    }

    get instance(): Promise<any> {
        return this._instance;
    }

    /** Send a transaction to the fallback function */
    public async sendTransaction(txParams: W3.TC.TxParams): Promise<W3.TC.TransactionResult> {
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

                Object.keys(copy.args).forEach(function(key: any) {
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
    public getTransactionResult(txHash: string): Promise<W3.TC.TransactionResult> {
        return new Promise<W3.TC.TransactionResult>((resolve, reject) => {
            this.w3.eth.getTransactionReceipt(txHash, async (err, receipt) => {
                if (err) {
                    reject(err);
                } else {
                    if (!receipt) {
                        reject('Receipt is falsy, transaction does not exists or was not mined yet.');
                    } else {
                        try {
                            let result: W3.TC.TransactionResult = {} as W3.TC.TransactionResult;
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

    public async newFilter(fromBlock: number, toBlock?: number): Promise<number> {
        let toBlock1 = toBlock ? this.w3.fromDecimal(toBlock) : 'latest';
        const id = 'W3:' + W3.NextCounter();
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
        const id = 'W3:' + W3.NextCounter();
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
        const id = 'W3:' + W3.NextCounter();

        let logs = this.w3.sendRPC({
            jsonrpc: '2.0',
            method: 'eth_getFilterChanges',
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

    public async getFilterLogs(filter: number): Promise<W3.Log[]> {
        const id = 'W3:' + W3.NextCounter();

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

    public async getLogs(fromBlock: number, toBlock?: number): Promise<W3.Log[]> {

        let toBlock1 = toBlock ? this.w3.fromDecimal(toBlock) : 'latest';

        return new Promise<W3.Log[]>(async (resolve, reject) => {
            (await this.instance).allEvents({ fromBlock: fromBlock, toBlock: toBlock1 }).get((error, log) => {
                if (error) {
                    reject(error);
                }
                resolve(log);
            });
        });

    }

}
