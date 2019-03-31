
import { W3, SoltsiceContract } from '..';

/**
 * WalletBasic API
 */
export class WalletBasic extends SoltsiceContract {

  public static get artifacts() { return require('../artifacts/WalletBasic.json'); }

  public static get bytecodeHash() {
    // we need this before ctor, but artifacts are static and we cannot pass it to the base class, so need to generate
    let artifacts = WalletBasic.artifacts;
    if (!artifacts || !artifacts.bytecode) {
        return undefined;
    }
    let hash = W3.sha3(JSON.stringify(artifacts.bytecode));
    return hash;
  }

  // tslint:disable-next-line:max-line-length
  public static async new(deploymentParams: W3.TX.TxParams, ctorParams?: {}, w3?: W3, link?: SoltsiceContract[], privateKey?: string): Promise<WalletBasic> {
    w3 = w3 || W3.default;
    if (!privateKey) {
      let contract = new WalletBasic(deploymentParams, ctorParams, w3, link);
      await contract._instancePromise;
      return contract;
    } else {
      let data = WalletBasic.newData(ctorParams, w3);
      let txHash = await w3.sendSignedTransaction(W3.zeroAddress, privateKey, data, deploymentParams);
      let txReceipt = await w3.waitTransactionReceipt(txHash);
      let rawAddress = txReceipt.contractAddress!;
      let contract = await WalletBasic.at(rawAddress, w3);
      return contract;
    }
  }

  public static async at(address: string | object, w3?: W3): Promise<WalletBasic> {
    let contract = new WalletBasic(address, undefined, w3, undefined);
    await contract._instancePromise;
    return contract;
  }

  public static async deployed(w3?: W3): Promise<WalletBasic> {
    let contract = new WalletBasic('', undefined, w3, undefined);
    await contract._instancePromise;
    return contract;
  }

  // tslint:disable-next-line:max-line-length
  public static newData(ctorParams?: {}, w3?: W3): string {
    // tslint:disable-next-line:max-line-length
    let data = SoltsiceContract.newDataImpl(w3, WalletBasic.artifacts, ctorParams ? [] : []);
    return data;
  }

  protected constructor(
    deploymentParams: string | W3.TX.TxParams | object,
    ctorParams?: {},
    w3?: W3,
    link?: SoltsiceContract[]
  ) {
      // tslint:disable-next-line:max-line-length
      super(
        w3,
        WalletBasic.artifacts,
        ctorParams ? [] : [],
        deploymentParams,
        link
      );
  }
  /*
    Contract methods
  */
  
  // tslint:disable-next-line:max-line-length
  // tslint:disable-next-line:variable-name
  public isOwner(owner: string, txParams?: W3.TX.TxParams): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this._instance.isOwner
        .call(owner, txParams || this._sendParams)
        .then((res: any) => resolve(res))
        .catch((err: any) => reject(err));
    });
  }
  
}
