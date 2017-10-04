import contract = require('truffle-contract');
import { W3 } from './W3';
import SolidityCoder = require('web3/lib/solidity/coder.js');

/**
 * Base contract for all Soltsice contracts
 */
export class SoltsiceContract {
    public static Silent: boolean = false;
    public transactionHash: Promise<string>;
    protected web3: W3;
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
        this.web3 = web3;
        this._Contract = contract(tokenArtifacts);
        this._Contract.setProvider(web3.currentProvider);

        function instanceOfTxParams(obj: any): obj is W3.TC.TxParams {
            return 'from' in obj && 'gas' in obj && 'gasPrice' in obj && 'value' in obj;
        }

        let linkage = new Promise<any>(async (resolve, reject) => {
            if (link && link.length > 0) {
                let network = +(await this.web3.networkId);
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
            let accounts = await this.web3.accounts;
            if (accounts && accounts.length > 0) {
                this._sendParams = W3.TC.txParamsDefaultSend(accounts[0]);
            }

            let useDeployed = (address: string) => {
                if (!SoltsiceContract.Silent) {
                    console.log('SOLTSICE: DEPLOYED CONTRACT', this.constructor.name, ' at ', deploymentParams!);
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
                        console.log('SOLTSICE: NEW CONTRACT ', this.constructor.name, ' at ', inst.address);
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

        let inst = await this.instance;
        let abi = inst.abi;

        return logs!.map((log) => {
            let event: any = null;

            for (var i = 0; i < abi.length; i++) {
                var item = abi[i];
                if (item.type !== 'event') {
                    continue;
                }
                // tslint:disable-next-line:max-line-length
                var signature = item.name + '(' + item.inputs.map(function (input: any) { return input.type; }).join(',') + ')';
                var hash = this.web3.web3.sha3(signature);
                if (hash === log.topics![0]) {
                    event = item;
                    break;
                }
            }

            if (event != null) {
                var inputs = event.inputs!.map(function (input: any) { return input.type; });
                var data = SolidityCoder.decodeParams(inputs, log.data!.replace('0x', ''));
                let args: any = {};
                for (var index = 0; index < event.inputs.length; index++) {
                    args[event.inputs[index].name] = data[index];
                }

                let result: W3.Log = Object.assign({}, log);
                result.event = event.name;
                result.args = args;
                delete result.data;
                delete result.topics;
                return result;

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
            this.web3.eth.getTransactionReceipt(txHash, async (err, receipt) => {
                if (err) {
                    reject(err);
                } else {
                    let result: W3.TC.TransactionResult = {} as W3.TC.TransactionResult;
                    result.tx = receipt.transactionHash;
                    result.receipt = receipt;
                    result.logs = await this.parseReceipt(receipt);
                    resolve(result);
                }
            });
        });
    }

    public async newFilter(fromBlock: number, toBlock?: number): Promise<number> {
        let toBlock1 = toBlock ? this.web3.fromDecimal(toBlock) : 'latest';
        const id = 'W3:' + W3.NextCounter();
        let filter = await this.web3.sendRPC({
            jsonrpc: '2.0',
            method: 'eth_newFilter',
            params: [{
                'fromBlock': this.web3.fromDecimal(fromBlock),
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
        return this.web3.toBigNumber(filter).toNumber(); // filter
    }

    public async uninstallFilter(filter: number): Promise<boolean> {
        const id = 'W3:' + W3.NextCounter();
        let ret = await this.web3.sendRPC({
            jsonrpc: '2.0',
            method: 'eth_uninstallFilter',
            params: [this.web3.fromDecimal(filter)],
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

        let logs = this.web3.sendRPC({
            jsonrpc: '2.0',
            method: 'eth_getFilterChanges',
            params: [this.web3.fromDecimal(filter)],
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

        let logs = this.web3.sendRPC({
            jsonrpc: '2.0',
            method: 'eth_getFilterLogs',
            params: [this.web3.fromDecimal(filter)],
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

        let toBlock1 = toBlock ? this.web3.fromDecimal(toBlock) : 'latest';

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
