import contract = require('truffle-contract');
import { W3 } from './W3';
import SolidityCoder = require("web3/lib/solidity/coder.js");

/**
 * CustomContract API
 */
export class SoltsiceContract {
    public address: string;
    public transactionHash: string;
    protected w3: W3;
    protected _Contract: any;
    /** Truffle-contract instance. Use it if Soltsice doesn't support some features yet */
    protected _instance: Promise<any>;
    protected _sendParams: W3.TC.TxParams;
    protected constructor(
        web3?: W3,
        tokenArtifacts?: any,
        constructorParams?: W3.TC.ContractDataType[],
        deploymentParams?: string | W3.TC.TxParams | object,
        link?: SoltsiceContract[]
    ) {
        if (!deploymentParams) {
            throw 'Generated classes must require deploymentParams in their ctor (TODO refactor this parent ctor)'
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
        })


        let instance = new Promise(async (resolve, reject) => {
            await linkage;
            let accounts = await this.w3.accounts;
            if (accounts && accounts.length > 0) {
                this._sendParams = W3.TC.txParamsDefaultSend(accounts[0]);
            }
            if (typeof deploymentParams === 'string') {
                console.log('USING DEPLOYED: ', this.constructor.name);
                this.address = deploymentParams!;
                this._Contract.at(this.address).then((inst) => {
                    this.address = inst.address;
                    this.transactionHash = inst.transactionHash;
                    resolve(inst);
                }).catch((err) => {
                    reject(err);
                });
            } else if (instanceOfTxParams(deploymentParams)) {
                console.log('NEW CONTRACT: ', this.constructor.name);
                this._Contract.new(...constructorParams!, deploymentParams).then((inst) => {
                    console.log('NEW ADDRESS', inst.address);
                    this.address = inst.address;
                    this.transactionHash = inst.transactionHash;
                    resolve(inst);
                }).catch((err) => {
                    reject(err);
                });
            } else {
                this.address = deploymentParams['address'];
                resolve(deploymentParams);
            }
        });

        this._instance = instance;
    }

    public async link(contract: SoltsiceContract) {
        this._Contract.Link(await contract.instance);
    }

    get instance(): Promise<any> { return this._instance };

    /** Send a transaction to the fallback function */
    public async sendTransaction(txParams: W3.TC.TxParams): Promise<W3.TC.TransactionResult> {
        let instance = await this.instance;
        return instance.sendTransaction(txParams);
    }

    public async parseLogs(receipt: W3.TransactionReceipt) {
        let logs = receipt.logs;

        let inst = await this.instance;
        let abi = inst.abi;

        return logs!.map((log) => {
            let event: any = null;

            for (var i = 0; i < abi.length; i++) {
                var item = abi[i];
                if (item.type != "event") continue;
                var signature = item.name + "(" + item.inputs.map(function (input) { return input.type; }).join(",") + ")";
                var hash = this.w3.web3.sha3(signature);
                if (hash == log.topics![0]) {
                    event = item;
                    break;
                }
            }

            if (event != null) {
                var inputs = event.inputs!.map(function (input) { return input.type; });
                var data = SolidityCoder.decodeParams(inputs, log.data!.replace("0x", ""));
                return data;
            } else {
                return undefined;
            }

        }).filter(d => d);
    }



}
