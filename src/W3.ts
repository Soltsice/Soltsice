// typings originally from https://github.com/ethereum/web3.js/pull/897
// and https://github.com/0xProject/web3-typescript-typings
import Web3JS from 'web3';
import { Eth } from 'web3-eth';
import { Utils } from 'web3-utils';
import * as net from 'net';
import { Web3ModuleOptions, TransactionReceipt, Log as W3Log } from 'web3-core';
import { provider } from 'web3-providers';
// import { TxParams } from 'truffle-contract';
import * as EthJsUtils from 'ethereumjs-util';
import { BN } from 'ethereumjs-util';

export { Web3ModuleOptions, TransactionReceipt } from 'web3-core';
export { provider } from 'web3-providers';
export { Eth } from 'web3-eth';
export { Utils } from 'web3-utils';
export { TxParams, Transaction } from 'truffle-contract';
export { BN } from 'ethereumjs-util';

// tslint:disable:member-ordering
// tslint:disable:max-line-length

/**
 * Strongly-types wrapper over web3.js with additional helper methods.
 */
export class W3 {
  private static _default: W3;
  // private _globalWeb3;
  private _netId: string;
  private _netNode: Promise<string>;
  private _defaultTimeout: number = 240000;
  private readonly _web3: Web3JS;
  s;
  /**
   * Default W3 instance that is used as a fallback when such an instance is not provided to a constructor.
   * You must set it explicitly via W3.default setter. Use an empty `new W3()` constructor to get an instance that
   * automatically resolves to a global web3 instance `window['web3']` provided by e.g. MIST/Metamask or connects
   * to the default 8545 port if no global instance is present.
   */
  public static get default(): W3 {
    if (W3._default) {
      return W3._default;
    }
    throw 'Default W3 instance is not set. Use W3.default setter.';
  }

  /**
   * Set default W3 instance.
   */
  public static set default(w3: W3) {
    W3._default = w3;
  }

  /** Default timeout in seconds. */
  public get defaultTimeout(): number {
    return this._defaultTimeout / 1000;
  }

  public set defaultTimeout(defaultTimeout: number) {
    if (defaultTimeout && defaultTimeout > 240) {
      this._defaultTimeout = defaultTimeout;
    } else {
      throw new Error('Bad defaultTimeout value.');
    }
  }

  private static providerOrDefault(p?: provider): provider {
    if (p) {
      console.log('Using a Web3JS provider from constructor.');
      return p;
    }

    if (typeof p === 'undefined') {
      if (
        (Web3JS.providers as any).givenProvider ||
        (typeof window !== 'undefined' &&
          // tslint:disable-next-line: no-string-literal
          typeof window['web3'] !== 'undefined' &&
          // tslint:disable-next-line: no-string-literal
          typeof window['web3'].currentProvider !== 'undefined')
      ) {
        console.log('Using an injected Web3JS provider.');
        // tslint:disable-next-line: no-string-literal
        return (Web3JS.providers as any).givenProvider || window['web3'].currentProvider;
      } else {
        // set the provider you want from Web3.providers
        if (typeof window === 'undefined' || window.location.protocol !== 'https:') {
          console.log('Cannot find an injected web3 provider. Using HttpProvider(http://localhost:8545).');
          return new Web3JS.providers.HttpProvider('http://localhost:8545');
        } else {
          // tslint:disable-next-line:max-line-length
          console.log(
            'Cannot find an injected Web3JS provider. Running on https, will not try to access localhost at 8545'
          );
        }
      }
    }

    throw 'Cannot resolve default Web3JS provider. Please add it to constructor.';
  }

  // tslint:disable-next-line: no-shadowed-variable
  constructor(provider?: provider, net?: net.Socket, options?: Web3ModuleOptions) {
    this._web3 = new Web3JS(W3.providerOrDefault(provider), net, options);

    // var s = this._web3.currentProvider.send;

    // (this._web3.currentProvider as any).send = ( method: string, parameters: any[]) => {
    //   console.log('INTERCEPTED MESSAGE: ' + method);
    //   return s(method, parameters);
    // }

    this.updateNetworkInfo();
  }

  /** Request netid string from ctor or after provider change */
  private updateNetworkInfo(netid?: string): void {
    if (!netid) {
      this.networkId.then(nid => (this._netId = '' + nid));
    } else {
      this._netId = netid;
    }

    this._netNode = new Promise((resolve, reject) =>
      (this.eth as any).getNodeInfo((error, result) => (error ? reject(error) : resolve(result)))
    );
  }

  /** True if current node name contains TestRPC string */
  public get isTestRPC(): Promise<boolean> {
    return this._netNode.then(node => {
      return node.toLowerCase().includes('test') || node.toLowerCase().includes('ganache');
    });
  }

  public get eth(): Eth {
    return this._web3.eth;
  }

  public get utils(): Utils {
    return this._web3.utils;
  }

  /** Get network ID. */
  public get networkId(): Promise<number> {
    return new Promise((resolve, reject) =>
      this.eth.net.getId((error, result) => {
        if (error) {
          return reject(error);
        }
        if (result + '' !== this._netId) {
          this.updateNetworkInfo(result + '');
        }
        return resolve(result);
      })
    );
  }

  /** Set web3 provider and update network info asynchronously. */
  public setProvider(provider: provider, net?: net.Socket) {
    const result = this._web3.setProvider(provider);
    this.updateNetworkInfo();
    return result;
  }

  /** Send raw JSON RPC request to the current provider. */
  public send(method: string, parameters: any[]): Promise<any> {
    if(typeof method !== "string"){
      throw 'Method must be a string';
    }
    console.log('SEND METHOD: ' + method);
    return this._web3.currentProvider.send(method, parameters);
  }

  /** Returns the time of the last mined block in seconds. */
  public async getLatestTime(): Promise<number> {
    const block = await this.eth.getBlock('latest');
    return block.timestamp;
  }

  /** Async unlock while web3.js only has sync version. This function uses `personal_unlockAccount` RPC message that is not available in some web3 providers. */
  public async unlockAccount(address: string, password: string, duration?: number): Promise<boolean> {
    return this.send('personal_unlockAccount', [address, password, duration || 10]).then(async r => {
      return <boolean>r;
    });
  }

  /** Sign using eth.sign but with prefix as personal_sign */
  public async ethSignRaw(hex: string, account: string): Promise<string> {
    // NOTE geth already adds the prefix to eth.sign, no need to do so manually
    // hex = hex.replace('0x', '');
    // let prefix = '\x19Ethereum Signed Message:\n' + (hex.length / 2);
    // let message = this.web3.toHex(prefix) + hex;
    return new Promise<string>((resolve, reject) => {
      this.eth.sign(account, hex, (err, res) => {
        if (err) {
          reject(err);
        }
        resolve(res);
      });
    });
  }

  /** Sign a message */
  public async sign(message: string, account: string, password?: string): Promise<string> {
    message = W3.toHex(message);
    return this.signRaw(message, account, password);
  }

  /** Message already as hex */
  public async signRaw(message: any, account: string, password?: string): Promise<string> {
    console.log('signRaw MESSAGE', message);
    return this.send('personal_sign', password ? [message, account, password] : [message, account]).then(async r => {
      return <string>r;
    });
  }

  /** True if current web3 provider is from MetaMask. */
  public get isMetaMask() {
    try {
      return (this._web3.currentProvider as any).isMetaMask ? true : false;
    } catch {
      return false;
    }
  }

  public get currentProvider() {
    return this._web3.currentProvider;
  }

  public get defaultAccount() {
    return this._web3.defaultAccount;
  }

  public set defaultAccount(value) {
    this._web3.defaultAccount = value;
  }

  /**
   * Get the numbers of transactions sent from this address.
   * @param account The address to get the numbers of transactions from.
   * @param defaultBlock (optional) If you pass this parameter it will not use the default block set with.
   */
  public async getTransactionCount(account: string | null, defaultBlock?: number | string): Promise<number> {
    account = account || this._web3.defaultAccount;
    if (!account) {
      throw new Error('No default account set to call getTransactionCount without a given account address');
    }

    return new Promise<number>((resolve, reject) => {
      this.eth.getTransactionCount(account!, defaultBlock as any, (e, r) => {
        if (e) {
          reject(e);
        } else {
          resolve(r);
        }
      });
    });
  }

  /**
   * Sends a raw signed transaction and returns tx hash. Use waitTransactionReceipt method on w3 or a contract to get a tx receipt.
   * @param to Target contract address or zero address (W3.zeroAddress) to deploy a new contract.
   * @param privateKey Private key hex string prefixed with 0x.
   * @param data Payload data.
   * @param txParams Tx parameters.
   * @param nonce Nonce override if needed to replace a pending transaction.
   */
  public async sendSignedTransaction(
    to: string,
    privateKey: string,
    data?: string,
    txParams?: W3.TX.TxParams,
    nonce?: number
  ): Promise<string> {
    if (!to || !W3.isValidAddress(to)) {
      throw new Error('To address is not set in sendSignedTransaction');
    }
    if (!privateKey) {
      throw new Error('PrivateKey is not set in sendSignedTransaction');
    }

    txParams = txParams || W3.TX.txParamsDefaultSend(this._web3.defaultAccount!);

    nonce = nonce || (await this.getTransactionCount(txParams.from));

    let EthereumTx = W3.TX.getEthereumjsTx();

    let pb = W3.EthUtils.toBuffer(privateKey);

    let nid = +(this._netId || (await this.networkId));

    const signedTxParams = {
      nonce: W3.toHex(nonce),
      gasPrice: W3.toHex(txParams.gasPrice),
      gasLimit: W3.toHex(txParams.gas),
      to: to,
      value: W3.toHex(txParams.value),
      data: data,
      chainId: nid
    };

    if (W3.zeroAddress === to) {
      delete signedTxParams.to;
    }

    const tx = new EthereumTx(signedTxParams);
    tx.sign(pb);
    const serializedTx = tx.serialize();
    const raw = `0x${serializedTx.toString('hex')}`;

    return new Promise<string>((resolve, reject) => {
      this.eth.sendSignedTransaction(raw, (e, r) => {
        if (e) {
          reject(e);
        } else {
          resolve(r);
        }
      });
    });
  }

  /**
   * Returns the receipt of a transaction by transaction hash. Retries for up to 240 seconds.
   * @param hashString The transaction hash.
   * @param timeoutSeconds Timeout in seconds, must be above 240 or ignored.
   */
  public async waitTransactionReceipt(hashString: string, timeoutSeconds?: number): Promise<TransactionReceipt> {
    return new Promise<TransactionReceipt>((accept, reject) => {
      var timeout = timeoutSeconds && timeoutSeconds > 240 ? timeoutSeconds * 1000 : this._defaultTimeout;
      var start = new Date().getTime();
      let makeAttempt = () => {
        this.eth.getTransactionReceipt(hashString, (err, receipt) => {
          if (err) {
            return reject(err);
          }

          if (receipt != null) {
            return accept(receipt);
          }

          if (timeout > 0 && new Date().getTime() - start > timeout) {
            return reject(
              new Error('Transaction ' + hashString + " wasn't processed in " + timeout / 1000 + ' seconds!')
            );
          }

          setTimeout(makeAttempt, 1000);
        });
      };

      makeAttempt();
    });
  }
}

export namespace W3 {
  /** Type alias for Ethereum address. */
  export type address = string;

  /** Type alias for bytes string. */
  export type bytes = string;

  /** Hex zero address. */
  export const zeroAddress: string = '0x0000000000000000000000000000000000000000';

  /** Check if Ethereum address is in valid format. */
  export function isValidAddress(addr: address): boolean {
    return W3.EthUtils.isValidAddress(addr);
  }

  /** Utf8 package. */
  export let Utf8: any = require('utf8');

  /**
   * Convert value to hex with optional left padding. If a string is already a hex it will be converted to lower case.
   * @param value Value to convert to hex
   * @param size Size of number in bits (8 for int8, 16 for uint16, etc)
   */
  export function toHex(value: number | string | BN, stripPrefix?: boolean, size?: number): string {
    const HEX_CHAR_SIZE = 4;
    if (typeof value === 'string') {
      if (size) {
        throw new Error('W3.toHex: using optional size argument with strings is not supported');
      }
      if (!value.startsWith('0x')) {
        // non-hex string
        return W3.utf8ToHex(value, stripPrefix);
      } else {
        let lowerCase = value.toLowerCase();
        return stripPrefix ? lowerCase.slice(2) : lowerCase;
      }
    }

    let hexWithPrefix: string;
    if ((value as any).isBN) {
      let bn = value as BN;

      let hex = bn.toString(16);
      hexWithPrefix = bn.lt(new BN(0)) ? '-0x' + hex.substr(1) : '0x' + hex;
    } else {
      hexWithPrefix = EthUtils.bufferToHex(EthUtils.toBuffer(value as any));
    }

    // numbers, big numbers, and hex strings
    if (size) {
      // tslint:disable-next-line:no-bitwise
      let hexNoPrefix = hexWithPrefix.slice(2);
      // tslint:disable-next-line:no-bitwise
      let leftPadded = W3.leftPad(hexNoPrefix, size / HEX_CHAR_SIZE, value < 0 ? 'F' : '0');
      return stripPrefix ? leftPadded : '0x' + leftPadded;
    } else {
      // tslint:disable-next-line:no-bitwise
      return stripPrefix ? hexWithPrefix.slice(2) : hexWithPrefix;
    }
  }

  /** String left pad. Same as the notorious left-pad package as a single function. */
  export function leftPad(str: string, len: number, ch: any) {
    // the notorious 12-lines npm package
    str = String(str);
    var i = -1;
    if (!ch && ch !== 0) {
      ch = ' ';
    }
    len = len - str.length;
    while (++i < len) {
      str = ch + str;
    }
    return str;
  }

  /** Utf8 to hex convertor. */
  export function utf8ToHex(str: string, stripPrefix?: boolean): string {
    // this is from web3 1.0

    str = W3.Utf8.encode(str);
    let hex = '';

    // remove \u0000 padding from either side
    str = str.replace(/^(?:\u0000)*/, '');
    str = str
      .split('')
      .reverse()
      .join('');
    str = str.replace(/^(?:\u0000)*/, '');
    str = str
      .split('')
      .reverse()
      .join('');

    for (let i = 0; i < str.length; i++) {
      let code = str.charCodeAt(i);
      // if (code !== 0) {
      let n = code.toString(16);
      hex += n.length < 2 ? '0' + n : n;
      // }
    }

    return stripPrefix ? hex : '0x' + hex;
  }

  /** Ethereumjs-util package. */
  export let EthUtils = EthJsUtils;

  /** Creates SHA-3 hash of the input. */
  export function sha3(a: Buffer | Array<any> | string | number, bits?: number): string {
    return EthUtils.bufferToHex(EthUtils.keccak(a, bits));
  }

  /** Creates SHA256 hash of the input. */
  export function sha256(a: Buffer | Array<any> | string | number): string {
    return EthUtils.bufferToHex(EthUtils.sha256(a));
  }

  /** ECDSA sign. */
  export function sign(message: any, privateKey: string): bytes {
    let mb = W3.EthUtils.toBuffer(message);
    let pb = W3.EthUtils.toBuffer(privateKey);
    let personalHash = W3.EthUtils.hashPersonalMessage(mb);
    let signature = W3.EthUtils.ecsign(personalHash, pb);
    let rpcSignature = W3.EthUtils.toRpcSig(signature.v, signature.r, signature.s);
    return rpcSignature;
  }

  /** ECDSA public key recovery from signature. */
  export function ecrecover(message: string, signature: string): address {
    let mb = W3.EthUtils.toBuffer(message);
    let sigObject = W3.EthUtils.fromRpcSig(signature);
    let personalHash = W3.EthUtils.hashPersonalMessage(mb);
    let recoveredPubKeyBuffer = W3.EthUtils.ecrecover(personalHash, sigObject.v, sigObject.r, sigObject.s);
    let recoveredAddress = W3.EthUtils.pubToAddress(recoveredPubKeyBuffer);
    let addr = W3.EthUtils.bufferToHex(recoveredAddress);
    return addr;
  }

  let _keythereum: any;
  /**
   * Get Keythereum instance. https://github.com/ethereumjs/keythereum
   */
  export function getKeythereum() {
    if (_keythereum) {
      return _keythereum;
    }
    // tslint:disable-next-line:no-string-literal
    if (typeof window !== 'undefined' && typeof window['keythereum'] !== 'undefined') {
      // tslint:disable-next-line:no-string-literal
      _keythereum = window['keythereum'];
    } else {
      _keythereum = require('keythereum');
    }
    return _keythereum;
  }

  /** Truffle Contract */
  export namespace TX {
    /** Standard transaction parameters. */
    export interface TxParams {
      from: address;
      gas: number | BN;
      gasPrice: number | BN;
      value: number | BN;
    }

    export type ContractDataType = BN | number | string | boolean | BN[] | number[] | string[];

    export interface TransactionResult {
      /** Transaction hash. */
      tx: string;
      receipt: TransactionReceipt;
      /** This array has decoded events, while reseipt.logs has raw logs when returned from TC transaction */
      logs: Log[];
    }

    /** 4500000 gas @ 2 Gwei */
    export function txParamsDefaultDeploy(from: address, gas?: number, gasPrice?: number): TxParams {
      if (gasPrice && gasPrice > 40000000000) {
        throw new Error(
          `Given gasPrice ${gasPrice} is above 40Gwei (our default is 2 Gwei, common value for fast transactions is 20Gwei), this could be costly. Construct txParams manually if you know what you are doing.`
        );
      }
      if (gas && gas > 4500000) {
        throw new Error(`Given gas ${gas} is too large and could exceed block size.`);
      }

      return {
        from: from,
        gas: gas || 4500000,
        gasPrice: gasPrice || 2000000000, // 2 Gwei, not 20
        value: 0
      };
    }

    /** 50000 gas @ 2 Gwei */
    export function txParamsDefaultSend(from: address, gas?: number, gasPrice?: number): TxParams {
      if (gasPrice && gasPrice > 40000000000) {
        throw new Error(
          `Given gasPrice ${gasPrice} is above 40Gwei (our default is 2 Gwei, common value for fast transactions is 20Gwei), this could be costly. Construct txParams manually if you know what you are doing.`
        );
      }
      if (gas && gas > 500000) {
        throw new Error(
          `Given gas ${gas} is too large for a normal transaction (>500k). Use txParamsDefaultDeploy or construct params manually.`
        );
      }

      return {
        from: from,
        gas: gas || 50000,
        gasPrice: gasPrice || 2000000000, // 2 Gwei, not 20
        value: 0
      };
    }

    let _ethereumjsTx: any;
    export function getEthereumjsTx() {
      if (_ethereumjsTx) {
        return _ethereumjsTx;
      }
      // tslint:disable-next-line:no-string-literal
      if (typeof window !== 'undefined' && typeof window['ethereumjs-tx'] !== 'undefined') {
        // tslint:disable-next-line:no-string-literal
        _ethereumjsTx = window['ethereumjs-tx'];
      } else {
        _ethereumjsTx = require('ethereumjs-tx');
      }
      return _ethereumjsTx;
    }
  }

  export type ABIDataTypes = 'uint256' | 'boolean' | 'string' | 'bytes' | string; // TODO complete list

  export interface ABIDefinition {
    constant?: boolean;
    payable?: boolean;
    anonymous?: boolean;
    inputs?: Array<{ name: string; type: ABIDataTypes; indexed?: boolean }>;
    name?: string;
    outputs?: Array<{ name: string; type: ABIDataTypes }>;
    type: 'function' | 'constructor' | 'event' | 'fallback';
  }

  export interface Account {
    address: string;
    privateKey: string;
    publicKey: string;
  }

  export const duration = {
    seconds: function(val: number) {
      return val;
    },
    minutes: function(val: number) {
      return val * this.seconds(60);
    },
    hours: function(val: number) {
      return val * this.minutes(60);
    },
    days: function(val: number) {
      return val * this.hours(24);
    },
    weeks: function(val: number) {
      return val * this.days(7);
    },
    years: function(val: number) {
      return val * this.days(365);
    }
  };

  /** Transaction log entry. */
  export interface Log extends W3Log {
    address: string;
    logIndex: number;
    transactionIndex: number;
    transactionHash: string;
    blockHash: string;
    blockNumber: number;

    /** true when the log was removed, due to a chain reorganization. false if its a valid log. */
    removed?: boolean;

    data: string;
    topics: Array<string | string[]>;

    /** Event name decoded by Truffle-contract */
    event?: string;

    /** Truffle-contract returns this as 'mined' */
    type?: string;

    /** Args passed to a Truffle-contract method */
    args?: any;
  }

  export interface EventLog extends Log {
    event: string;

    // from parent Log
    // address: string;
    // logIndex: number;
    // transactionIndex: number;
    // transactionHash: string;
    // blockHash: string;
    // blockNumber: number;

    returnValues: any;
    signature: string | null;
    raw?: { data: string; topics: any[] };
  }
}
