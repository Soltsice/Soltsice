// typings originally from https://github.com/ethereum/web3.js/pull/897
// and https://github.com/0xProject/web3-typescript-typings
import { JsonRPCRequest, JsonRPCResponse } from './jsonrpc';
import { BigNumber } from 'bignumber.js'; // TODO change to BN
import Web3JS = require('web3');

// W3 is the only class wrapper over JS object, others are interfaces
// cannot just cast from JS, but ctor does some standard logic to resolve web3
// so we do not need cast but could just use new W3()

/** Convert number or hex string to BigNumber */
export function toBN(value: number): BigNumber {
  // TODO BN.js
  return new BigNumber(value);
}

// tslint:disable:member-ordering
// tslint:disable:max-line-length

/**
 * Strongly-types wrapper over web3.js with additional helper methods.
 */
export class W3 {
  private static _counter: number = 0;
  private static _default: W3;
  private _globalWeb3;
  private _netId: string;
  private _netNode: Promise<string>;
  private _defaultAccount: string;
  private _defaultTimeout: number = 240000;

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

  /** Get Global W3 incrementing counter. Starts with zero.  */
  public static getNextCounter(): number {
    // node is single-threaded
    // same provider in two W3 instances is OK, counter will be unique accross them
    let value = W3._counter;
    W3._counter++;
    return value;
  }

  /** Web3 providers. */
  public static providers: W3.Providers = Web3JS.providers;

  /** Current Web3 provider. */
  public get currentProvider(): W3.Provider {
    return this.web3 ? this.web3.currentProvider : undefined;
  }

  /** Convert number or hex string to BigNumber */
  public toBigNumber(value: number | string): BigNumber {
    return this.web3.toBigNumber(value);
  }

  /** Converts a number or number string to its HEX representation. */
  public fromDecimal(value: number | string): string {
    return this.web3.fromDecimal(value);
  }

  /**
   * web3.js untyped instance created with a resolved or given in ctor provider, if any.
   */
  public web3;

  /** Default account for sending transactions without explicit txParams. */
  public get defaultAccount(): string {
    return this._defaultAccount;
  }

  public set defaultAccount(defaultAccount: string) {
    this._defaultAccount = defaultAccount;
    this.web3.defaultAccount = defaultAccount;
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

  /**
   * Create a default Web3 instance - resolves to a global window['web3'] injected my MIST, MetaMask, etc
   * or to `localhost:8545` if not running on https.
   */
  constructor();
  /**
   * Create a W3 instance with a given provider.
   * @param provider web3.js provider.
   */
  constructor(provider?: W3.Provider);
  constructor(provider?: W3.Provider, defaultAccount?: string) {
    let tmpWeb3;
    if (typeof provider === 'undefined') {
      // tslint:disable-next-line:no-string-literal
      if (
        (typeof window !== 'undefined' &&
          typeof window['web3'] !== 'undefined' &&
          typeof window['web3'].currentProvider !== 'undefined') ||
        this._globalWeb3
      ) {
        // tslint:disable-next-line:no-string-literal
        this._globalWeb3 = window['web3'];
        // tslint:disable-next-line:no-string-literal
        tmpWeb3 = new Web3JS(this._globalWeb3.currentProvider);
        console.log('Using an injected web3 provider.');
      } else {
        // set the provider you want from Web3.providers
        if (typeof window === 'undefined' || window.location.protocol !== 'https:') {
          tmpWeb3 = new Web3JS(new Web3JS.providers.HttpProvider('http://localhost:8545'));
          console.log('Cannot find an injected web3 provider. Using HttpProvider(http://localhost:8545).');
        } else {
          // tslint:disable-next-line:max-line-length
          console.log(
            'Cannot find an injected web3 provider. Running on https, will not try to access localhost at 8545'
          );
        }
      }
    } else {
      // regardless if a web3 exists, we create a new one for a specific provider
      tmpWeb3 = new Web3JS(provider);
      console.log('Using a provider from constructor.');
    }
    if (!tmpWeb3.version.api.startsWith('0.20')) {
      throw 'Only web3 0.20.xx package is currently supported';
    }
    this.web3 = tmpWeb3;

    // set and override eth's default account with a given value or use eth's one if it is set
    if (defaultAccount) {
      // set property, that will also set this.web3.defaultAccount
      this.defaultAccount = defaultAccount;
    } else if (this.web3.defaultAccount) {
      // set private field directly
      this._defaultAccount = this.web3.defaultAccount;
    }

    this.updateNetworkInfo();
  }

  /** Request netid string from ctor or after provider change */
  private updateNetworkInfo(netid?: string): void {
    if (!netid) {
      this.networkId.then(nid => (this._netId = nid));
    } else {
      this._netId = netid;
    }

    this._netNode = new Promise((resolve, reject) =>
      this.web3.version.getNode((error, result) => (error ? reject(error) : resolve(result)))
    );
  }

  /*
    Below are frequently used functions that should not depend on web3 API (0.20 or 1.0).
    Will update them for web3 1.0 when truffle-contract support it without sendAsync error.
    */

  /** Returns a list of accounts the node controlst */
  public get accounts(): Promise<string[]> {
    return new Promise((resolve, reject) =>
      this.web3.eth.getAccounts((error, result) => (error ? reject(error) : resolve(result)))
    );
  }

  /** Web3.js version API */
  public get web3API(): string {
    return this.web3.version.api;
  }

  /** True if current web3.js version is 0.20.x. */
  public get isPre1API(): boolean {
    return this.web3API.startsWith('0.20.');
  }

  /** True if current node name contains TestRPC string */
  public get isTestRPC(): Promise<boolean> {
    return this._netNode.then(node => {
      return node.includes('TestRPC');
    });
  }

  /** Get network ID. */
  public get networkId(): Promise<string> {
    return new Promise((resolve, reject) =>
      this.web3.version.getNetwork((error, result) => {
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
  public setProvider(provider: W3.Provider) {
    this.web3.setProvider(provider);
    this.updateNetworkInfo();
  }

  /** Send raw JSON RPC request to the current provider. */
  public sendRPC(payload: JsonRPCRequest): Promise<JsonRPCResponse> {
    return new Promise((resolve, reject) => {
      if (this.isPre1API) {
        this.web3.currentProvider.sendAsync(payload, (e, r) => {
          if (e) {
            reject(e);
          } else {
            resolve(r);
          }
        });
      } else {
        this.web3.currentProvider.send(payload, (e, r) => {
          if (e) {
            reject(e);
          } else {
            resolve(r);
          }
        });
      }
    });
  }

  /** Returns the time of the last mined block in seconds. */
  public get latestTime(): Promise<number> {
    return new Promise((resolve, reject) => {
      if (this.isPre1API) {
        this.web3.eth.getBlock('latest', (err, res) => {
          if (err) {
            reject(err);
          } else {
            resolve(res.timestamp as number);
          }
        });
      } else {
        reject('web3 1.0 support is not implemented');
      }
    });
  }

  /** Returns the current block number */
  public get blockNumber(): Promise<number> {
    // getBlockNumber(callback: (err: Error, blockNumber: number) => void): void;
    return new Promise((resolve, reject) => {
      if (this.isPre1API) {
        this.web3.eth.getBlockNumber((err, res) => {
          if (err) {
            reject(err);
          } else {
            resolve(res as number);
          }
        });
      } else {
        reject('web3 1.0 support is not implemented');
      }
    });
  }

  /** Async unlock while web3.js only has sync version. This function uses `personal_unlockAccount` RPC message that is not available in some web3 providers. */
  public async unlockAccount(address: string, password: string, duration?: number): Promise<boolean> {
    const id = 'W3:' + W3.getNextCounter();
    return this.sendRPC({
      jsonrpc: '2.0',
      method: 'personal_unlockAccount',
      params: [address, password, duration || 10],
      id: id
    }).then(async r => {
      if (r.error) {
        return false;
      }
      return <boolean>r.result;
    });
  }

  /** Get account balance */
  public async getBalance(address: string): Promise<BigNumber> {
    return new Promise<BigNumber>((resolve, reject) => {
      this.web3.eth.getBalance(address, (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result as BigNumber);
        }
      });
    });
  }

  /** Sign using eth.sign but with prefix as personal_sign */
  public async ethSignRaw(hex: string, account: string): Promise<string> {
    // NOTE geth already adds the prefix to eth.sign, no need to do so manually
    // hex = hex.replace('0x', '');
    // let prefix = '\x19Ethereum Signed Message:\n' + (hex.length / 2);
    // let message = this.web3.toHex(prefix) + hex;
    return new Promise<string>((resolve, reject) => {
      this.web3.eth.sign(account, hex, (err, res) => {
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
    const id = 'W3:' + W3.getNextCounter();
    console.log('signRaw MESSAGE', message);
    return this.sendRPC({
      jsonrpc: '2.0',
      method: 'personal_sign',
      params: password ? [message, account, password] : [message, account],
      id: id
    }).then(async r => {
      if (r.error) {
        console.log('ERROR:', r.error);
        throw new Error(r.error.message);
      }
      return <string>r.result;
    });
  }

  /** True if current web3 provider is from MetaMask. */
  public get isMetaMask() {
    try {
      return this.web3.currentProvider.isMetaMask ? true : false;
    } catch {
      return false;
    }
  }

  /**
   * Get the numbers of transactions sent from this address.
   * @param account The address to get the numbers of transactions from.
   * @param defaultBlock (optional) If you pass this parameter it will not use the default block set with.
   */
  public async getTransactionCount(account?: string, defaultBlock?: number | string): Promise<number> {
    account = account || this.defaultAccount;
    if (!account) {
      throw new Error('No default account set to call getTransactionCount without a given account address');
    }

    return new Promise<number>((resolve, reject) => {
      this.web3.eth.getTransactionCount(account, defaultBlock, (e, r) => {
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
    if (!this.isPre1API) {
      throw new Error('Web3.js v.1.0 is not supported yet');
    }
    if (!to || !W3.isValidAddress(to)) {
      throw new Error('To address is not set in sendSignedTransaction');
    }
    if (!privateKey) {
      throw new Error('PrivateKey is not set in sendSignedTransaction');
    }

    txParams = txParams || W3.TX.txParamsDefaultSend(this.defaultAccount);

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
      this.web3.eth.sendRawTransaction(raw, (e, r) => {
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
  public async waitTransactionReceipt(hashString: string, timeoutSeconds?: number): Promise<W3.TransactionReceipt> {
    return new Promise<W3.TransactionReceipt>((accept, reject) => {
      var timeout = timeoutSeconds && timeoutSeconds > 240 ? timeoutSeconds * 1000 : this._defaultTimeout;
      var start = new Date().getTime();
      let makeAttempt = () => {
        this.web3.eth.getTransactionReceipt(hashString, (err, receipt) => {
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
  export function toHex(value: number | string | BigNumber, stripPrefix?: boolean, size?: number): string {
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
    if ((value as any).isBigNumber) {
      let bn = value as BigNumber;
      let hex = bn.toString(16);
      hexWithPrefix = bn.lessThan(0) ? '-0x' + hex.substr(1) : '0x' + hex;
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
  export let EthUtils: W3.EthUtils = require('ethereumjs-util');

  /** Creates SHA-3 hash of the input. */
  export function sha3(a: Buffer | Array<any> | string | number, bits?: number): string {
    return EthUtils.bufferToHex(EthUtils.sha3(a, bits));
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
      gas: number | BigNumber;
      gasPrice: number | BigNumber;
      value: number | BigNumber;
    }

    export type ContractDataType = BigNumber | number | string | boolean | BigNumber[] | number[] | string[];

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

  export interface Provider {
    sendAsync(payload: JsonRPCRequest, callback: (err: Error, result: JsonRPCResponse) => void): void;
  }

  // export interface Provider {
  //     send(payload: JsonRPCRequest, callback: (e: Error, val: JsonRPCResponse) => void);
  // }

  export interface WebsocketProvider extends Provider {}
  export interface HttpProvider extends Provider {}
  export interface IpcProvider extends Provider {}
  export interface Providers {
    WebsocketProvider: new (host: string, timeout?: number) => WebsocketProvider;
    HttpProvider: new (host: string, timeout?: number) => HttpProvider;
    IpcProvider: new (path: string, net: any) => IpcProvider;
  }

  // tslint:disable-next-line:max-line-length
  export type Unit =
    | 'kwei'
    | 'femtoether'
    | 'babbage'
    | 'mwei'
    | 'picoether'
    | 'lovelace'
    | 'qwei'
    | 'nanoether'
    | 'shannon'
    | 'microether'
    | 'szabo'
    | 'nano'
    | 'micro'
    | 'milliether'
    | 'finney'
    | 'milli'
    | 'ether'
    | 'kether'
    | 'grand'
    | 'mether'
    | 'gether'
    | 'tether';

  export type BlockType = 'latest' | 'pending' | 'genesis' | number;

  export interface BatchRequest {
    add(request: Request): void;
    execute(): void;
  }
  export interface Iban {}

  export interface Utils {
    BN: BigNumber; // TODO only static-definition
    isBN(obj: any): boolean;
    isBigNumber(obj: any): boolean;
    isAddress(obj: any): boolean;
    isHex(obj: any): boolean;
    asciiToHex(val: string): string;
    hexToAscii(val: string): string;
    bytesToHex(val: number[]): string;
    numberToHex(val: number | BigNumber): string;
    checkAddressChecksum(address: string): boolean;
    fromAscii(val: string): string;
    fromDecimal(val: string | number | BigNumber): string;
    fromUtf8(val: string): string;
    fromWei(val: string | number | BigNumber, unit: Unit): string | BigNumber;
    hexToBytes(val: string): number[];
    hexToNumber(val: string | number | BigNumber): number;
    hexToNumberString(val: string | number | BigNumber): string;
    hexToString(val: string): string;
    hexToUtf8(val: string): string;
    keccak256(val: string): string;
    leftPad(str: string, chars: number, sign: string): string;
    padLeft(str: string, chars: number, sign: string): string;
    rightPad(str: string, chars: number, sign: string): string;
    padRight(str: string, chars: number, sign: string): string;
    sha3(val: string, val2?: string, val3?: string, val4?: string, val5?: string): string;
    soliditySha3(val: string): string;
    randomHex(bytes: number): string;
    stringToHex(val: string): string;
    toAscii(hex: string): string;
    toBN(obj: any): BigNumber;
    toChecksumAddress(val: string): string;
    toDecimal(val: any): number;
    toHex(val: any): string;
    toUtf8(val: any): string;
    toWei(val: string | number | BigNumber, unit: Unit): string | BigNumber;
    // tslint:disable-next-line:member-ordering
    unitMap: any;
  }

  /**
   * https://github.com/ethereumjs/ethereumjs-util/blob/master/docs/index.md
   */
  export interface EthUtils {
    /** BN.js */
    BN: BigNumber;
    /** Adds "0x" to a given String if it does not already start with "0x". */
    addHexPrefix(str: string): string;
    /** Converts a Buffer or Array to JSON. */
    baToJSON(ba: Buffer | Array<any>): any;
    bufferToHex(buf: Buffer): string;
    bufferToInt(buf: Buffer): number;
    ecrecover(msgHash: Buffer, v: number, r: Buffer, s: Buffer): Buffer;
    ecsign(msgHash: Buffer, privateKey: Buffer): any;
    fromRpcSig(sig: string): any;
    fromSigned(num: Buffer): any; // TODO BN
    generateAddress(from: Buffer, nonce: Buffer): Buffer;
    hashPersonalMessage(message: Buffer): Buffer;
    importPublic(publicKey: Buffer): Buffer;
    isValidAddress(address: string): boolean;
    isValidChecksumAddress(address: Buffer): boolean;
    isValidPrivate(privateKey: Buffer): boolean;
    isValidPublic(privateKey: Buffer, sanitize: boolean): any;
    isValidSignature(v: number, r: Buffer, s: Buffer, homestead?: boolean): any;

    privateToAddress(privateKey: Buffer): Buffer;
    pubToAddress(privateKey: Buffer, sanitize?: boolean): Buffer;

    sha256(a: Buffer | Array<any> | string | number): Buffer;

    /** Keccak[bits] */
    sha3(a: Buffer | Array<any> | string | number, bits?: number): Buffer;

    SHA3_NULL: Buffer;
    SHA3_NULL_S: string;

    toBuffer(v: any): Buffer;
    toChecksumAddress(address: string): string;

    toRpcSig(v: number, r: Buffer, s: Buffer): string;

    privateToPublic(privateKey: Buffer): Buffer;

    zeros(bytes: number): Buffer;
  }

  export type Callback<T> = (error: Error, result: T) => void;

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

  export interface CompileResult {
    code: string;
    info: {
      source: string;
      language: string;
      languageVersion: string;
      compilerVersion: string;
      abiDefinition: Array<ABIDefinition>;
    };
    userDoc: { methods: object };
    developerDoc: { methods: object };
  }

  export interface Transaction {
    hash: string;
    nonce: number;
    blockHash: string;
    blockNumber: number;
    transactionIndex: number;
    from: string;
    to: string;
    value: string;
    gasPrice: string;
    gas: number;
    input: string;
    v?: string;
    r?: string;
    s?: string;
  }

  export interface TransactionReceipt {
    transactionHash: string;
    transactionIndex: number;
    blockHash: string;
    blockNumber: number;
    from: string;
    to: string;
    contractAddress: string;
    cumulativeGasUsed: number;
    gasUsed: number;
    logs?: Log[];
    events?: {
      [eventName: string]: EventLog;
    };
  }

  export interface BlockHeader {
    number: number;
    hash: string;
    parentHash: string;
    nonce: string;
    sha3Uncles: string;
    logsBloom: string;
    transactionRoot: string;
    stateRoot: string;
    receiptRoot: string;
    miner: string;
    extraData: string;
    gasLimit: number;
    gasUsed: number;
    timestamp: number;
  }

  export interface Block extends BlockHeader {
    transactions: Array<Transaction>;
    size: number;
    difficulty: number;
    totalDifficulty: number;
    uncles: Array<string>;
  }

  export interface Logs {
    fromBlock?: number;
    address?: string;
    topics?: Array<string | string[]>;
  }

  /** Transaction log entry. */
  export interface Log {
    address: string;
    logIndex: number;
    transactionIndex: number;
    transactionHash: string;
    blockHash: string;
    blockNumber: number;

    /** true when the log was removed, due to a chain reorganization. false if its a valid log. */
    removed?: boolean;

    data?: string;
    topics?: Array<string>;

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

  export interface Subscribe<T> {
    subscription: {
      id: string;
      subscribe(callback?: Callback<Subscribe<T>>): Subscribe<T>;
      unsubscribe(callback?: Callback<boolean>): void | boolean;
      // tslint:disable-next-line:member-ordering
      arguments: object;
    };
    /*  on(type: "data" , handler:(data:Transaction)=>void): void
          on(type: "changed" , handler:(data:Logs)=>void): void
          on(type: "error" , handler:(data:Error)=>void): void
          on(type: "block" , handler:(data:BlockHeader)=>void): void
          */
    on(type: 'data', handler: (data: T) => void): void;
    on(type: 'changed', handler: (data: T) => void): void;
    on(type: 'error', handler: (data: Error) => void): void;
  }

  export interface Account {
    address: string;
    privateKey: string;
    publicKey: string;
  }

  export interface PrivateKey {
    address: string;
    Crypto: {
      cipher: string;
      ciphertext: string;
      cipherparams: {
        iv: string;
      };
      kdf: string;
      kdfparams: {
        dklen: number;
        n: number;
        p: number;
        r: number;
        salt: string;
      };
      mac: string;
    };
    id: string;
    version: number;
  }

  export interface Signature {
    message: string;
    hash: string;
    r: string;
    s: string;
    v: string;
  }
  export interface Tx {
    nonce?: string | number;
    chainId?: string | number;
    from?: string;
    to?: string;
    data?: string;
    value?: string | number;
    gas?: string | number;
    gasPrice?: string | number;
  }

  export interface ContractOptions {
    address: string;
    jsonInterface: ABIDefinition[];
    from?: string;
    gas?: string | number | BigNumber;
    gasPrice?: number;
    data?: string;
  }

  export type PromiEventType = 'transactionHash' | 'receipt' | 'confirmation' | 'error';

  export interface PromiEvent<T> extends Promise<T> {
    once(type: 'transactionHash', handler: (receipt: string) => void): PromiEvent<T>;
    once(type: 'receipt', handler: (receipt: TransactionReceipt) => void): PromiEvent<T>;
    once(type: 'confirmation', handler: (confNumber: number, receipt: TransactionReceipt) => void): PromiEvent<T>;
    once(type: 'error', handler: (error: Error) => void): PromiEvent<T>;
    // tslint:disable-next-line:max-line-length
    once(
      type: 'error' | 'confirmation' | 'receipt' | 'transactionHash',
      handler: (error: Error | TransactionReceipt | string) => void
    ): PromiEvent<T>;
    on(type: 'transactionHash', handler: (receipt: string) => void): PromiEvent<T>;
    on(type: 'receipt', handler: (receipt: TransactionReceipt) => void): PromiEvent<T>;
    on(type: 'confirmation', handler: (confNumber: number, receipt: TransactionReceipt) => void): PromiEvent<T>;
    on(type: 'error', handler: (error: Error) => void): PromiEvent<T>;
    // tslint:disable-next-line:max-line-length
    on(
      type: 'error' | 'confirmation' | 'receipt' | 'transactionHash',
      handler: (error: Error | TransactionReceipt | string) => void
    ): PromiEvent<T>;
  }

  export interface EventEmitter {
    on(type: 'data', handler: (event: EventLog) => void): EventEmitter;
    on(type: 'changed', handler: (receipt: EventLog) => void): EventEmitter;
    on(type: 'error', handler: (error: Error) => void): EventEmitter;
    // tslint:disable-next-line:max-line-length
    on(type: 'error' | 'data' | 'changed', handler: (error: Error | TransactionReceipt | string) => void): EventEmitter;
  }

  export interface TransactionObject<T> {
    arguments: any[];
    call(tx?: Tx): Promise<T>;
    send(tx?: Tx): PromiEvent<T>;
    estimateGas(tx?: Tx): Promise<number>;
    encodeABI(): string;
  }

  export interface Contract {
    options: ContractOptions;
    methods: {
      [fnName: string]: (...args: any[]) => TransactionObject<any>;
    };
    deploy(options: { data: string; arguments: any[] }): TransactionObject<Contract>;
    // tslint:disable-next-line:member-ordering
    events: {
      [eventName: string]: (
        options?: {
          filter?: object;
          fromBlock?: BlockType;
          topics?: any[];
        },
        cb?: Callback<EventLog>
      ) => EventEmitter;
      // tslint:disable-next-line:max-line-length
      allEvents: (
        options?: { filter?: object; fromBlock?: BlockType; topics?: any[] },
        cb?: Callback<EventLog>
      ) => EventEmitter;
    };
  }

  export interface Eth {
    readonly defaultAccount: string;
    readonly defaultBlock: BlockType;
    BatchRequest: new () => BatchRequest;
    Iban: new (address: string) => Iban;
    Contract: new (
      jsonInterface: any[],
      address?: string,
      options?: {
        from?: string;
        gas?: string | number | BigNumber;
        gasPrice?: number;
        data?: string;
      }
    ) => Contract;
    abi: {
      decodeLog(inputs: object, hexString: string, topics: string[]): object;
      encodeParameter(type: string, parameter: any): string;
      encodeParameters(types: string[], paramaters: any[]): string;
      encodeEventSignature(name: string | object): string;
      encodeFunctionCall(jsonInterface: object, parameters: any[]): string;
      encodeFunctionSignature(name: string | object): string;
      decodeParameter(type: string, hex: string): any;
      decodeParameters(types: string[], hex: string): any;
    };
    accounts: {
      'new'(entropy?: string): Account;
      privateToAccount(privKey: string): Account;
      publicToAddress(key: string): string;
      // tslint:disable-next-line:max-line-length
      signTransaction(
        tx: Tx,
        privateKey: string,
        returnSignature?: boolean,
        cb?: (err: Error, result: string | Signature) => void
      ): Promise<string> | Signature;
      recoverTransaction(signature: string | Signature): string;
      sign(data: string, privateKey: string, returnSignature?: boolean): string | Signature;
      recover(signature: string | Signature): string;
      encrypt(privateKey: string, password: string): PrivateKey;
      decrypt(privateKey: PrivateKey, password: string): Account;
      // tslint:disable-next-line:member-ordering
      wallet: {
        'new'(numberOfAccounts: number, entropy: string): Account[];
        add(account: string | Account): any;
        remove(account: string | number): any;
        save(password: string, keyname?: string): string;
        load(password: string, keyname: string): any;
        clear(): any;
      };
    };
    call(callObject: Tx, defaultBloc?: BlockType, callBack?: Callback<string>): Promise<string>;
    clearSubscriptions(): boolean;
    subscribe(type: 'logs', options?: Logs, callback?: Callback<Subscribe<Log>>): Promise<Subscribe<Log>>;
    subscribe(type: 'syncing', callback?: Callback<Subscribe<any>>): Promise<Subscribe<any>>;
    // tslint:disable-next-line:max-line-length
    subscribe(type: 'newBlockHeaders', callback?: Callback<Subscribe<BlockHeader>>): Promise<Subscribe<BlockHeader>>;
    subscribe(
      type: 'pendingTransactions',
      callback?: Callback<Subscribe<Transaction>>
    ): Promise<Subscribe<Transaction>>;
    // tslint:disable-next-line:max-line-length
    subscribe(
      type: 'pendingTransactions' | 'newBlockHeaders' | 'syncing' | 'logs',
      options?: Logs,
      callback?: Callback<Subscribe<Transaction | BlockHeader | any>>
    ): Promise<Subscribe<Transaction | BlockHeader | any>>;

    unsubscribe(callBack: Callback<boolean>): void | boolean;
    // tslint:disable-next-line:member-ordering
    compile: {
      solidity(source: string, callback?: Callback<CompileResult>): Promise<CompileResult>;
      lll(source: string, callback?: Callback<CompileResult>): Promise<CompileResult>;
      serpent(source: string, callback?: Callback<CompileResult>): Promise<CompileResult>;
    };
    // tslint:disable-next-line:member-ordering
    currentProvider: Provider;
    estimateGas(tx: Tx, callback?: Callback<number>): Promise<number>;
    getAccounts(cb?: Callback<Array<string>>): Promise<Array<string>>;
    getBalance(address: string, defaultBlock?: BlockType, cb?: Callback<number>): Promise<number>;
    // tslint:disable-next-line:variable-name
    getBlock(number: BlockType, returnTransactionObjects?: boolean, cb?: Callback<Block>): Promise<Block>;
    getBlockNumber(callback?: Callback<number>): Promise<number>;
    // tslint:disable-next-line:variable-name
    getBlockTransactionCount(number: BlockType | string, cb?: Callback<number>): Promise<number>;
    // tslint:disable-next-line:variable-name
    getBlockUncleCount(number: BlockType | string, cb?: Callback<number>): Promise<number>;
    getCode(address: string, defaultBlock?: BlockType, cb?: Callback<string>): Promise<string>;
    getCoinbase(cb?: Callback<string>): Promise<string>;
    getCompilers(cb?: Callback<string[]>): Promise<string[]>;
    getGasPrice(cb?: Callback<number>): Promise<number>;
    getHashrate(cb?: Callback<number>): Promise<number>;
    getPastLogs(
      options: {
        fromBlock?: BlockType;
        toBlock?: BlockType;
        address: string;
        topics?: Array<string | Array<string>>;
      },
      cb?: Callback<Array<Log>>
    ): Promise<Array<Log>>;
    getProtocolVersion(cb?: Callback<string>): Promise<string>;
    getStorageAt(address: string, defaultBlock?: BlockType, cb?: Callback<string>): Promise<string>;
    getTransactionReceipt(hash: string, cb?: Callback<TransactionReceipt>): Promise<TransactionReceipt>;
    getTransaction(hash: string, cb?: Callback<Transaction>): Promise<Transaction>;
    getTransactionCount(address: string, defaultBlock?: BlockType, cb?: Callback<number>): Promise<number>;
    getTransactionFromBlock(block: BlockType, index: number, cb?: Callback<Transaction>): Promise<Transaction>;
    // tslint:disable-next-line:max-line-length
    getUncle(
      blockHashOrBlockNumber: BlockType | string,
      uncleIndex: number,
      returnTransactionObjects?: boolean,
      cb?: Callback<Block>
    ): Promise<Block>;
    getWork(cb?: Callback<Array<string>>): Promise<Array<string>>;
    // tslint:disable-next-line:member-ordering
    givenProvider: Provider;
    isMining(cb?: Callback<boolean>): Promise<boolean>;
    isSyncing(cb?: Callback<boolean>): Promise<boolean>;
    // tslint:disable-next-line:member-ordering
    net: Net;
    // tslint:disable-next-line:member-ordering
    personal: Personal;
    sendSignedTransaction(data: string, cb?: Callback<string>): PromiEvent<TransactionReceipt>;
    sendTransaction(tx: Tx, cb?: Callback<string>): PromiEvent<TransactionReceipt>;
    submitWork(nonce: string, powHash: string, digest: string, cb?: Callback<boolean>): Promise<boolean>;
    sign(address: string, dataToSign: string, cb?: Callback<string>): Promise<string>;
  }

  export interface SyncingState {
    startingBlock: number;
    currentBlock: number;
    highestBlock: number;
  }

  export type SyncingResult = false | SyncingState;

  export interface Version0 {
    api: string;
    network: string;
    node: string;
    ethereum: string;
    whisper: string;
    getNetwork(callback: (err: Error, networkId: string) => void): void;
    getNode(callback: (err: Error, nodeVersion: string) => void): void;
    getEthereum(callback: (err: Error, ethereum: string) => void): void;
    getWhisper(callback: (err: Error, whisper: string) => void): void;
  }

  export interface Net {}

  export interface Personal {
    newAccount(password: string, cb?: Callback<boolean>): Promise<boolean>;
    getAccounts(cb?: Callback<Array<string>>): Promise<Array<string>>;
    importRawKey();
    lockAccount();
    unlockAccount();
    sign();
  }

  export interface Shh {}

  export interface Bzz {}

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

  export interface CancellationToken {
    cancelled: boolean;
  }
}
