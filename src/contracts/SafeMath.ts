
import { W3, SoltsiceContract } from '..';

/**
 * SafeMath API
 */
export class SafeMath extends SoltsiceContract {
    public static get Artifacts() { return require('../artifacts/SafeMath.json'); }

    public static get BytecodeHash() {
        // we need this before ctor, but artifacts are static and we cannot pass it to the base class, so need to generate
        let artifacts = SafeMath.Artifacts;
        if (!artifacts || !artifacts.bytecode) {
            return undefined;
        }
        let hash = W3.sha3(JSON.stringify(artifacts.bytecode));
        return hash;
    }

    // tslint:disable-next-line:max-line-length
    public static async New(deploymentParams: W3.TX.TxParams, ctorParams?: {}, w3?: W3, link?: SoltsiceContract[], privateKey?: string): Promise<SafeMath> {
        w3 = w3 || W3.Default;
        if (!privateKey) {
            let contract = new SafeMath(deploymentParams, ctorParams, w3, link);
            await contract._instancePromise;
            return contract;
        } else {
            let data = SafeMath.NewData(ctorParams, w3);
            let txHash = await w3.sendSignedTransaction(W3.zeroAddress, privateKey, data, deploymentParams);
            let txReceipt = await w3.waitTransactionReceipt(txHash);
            let rawAddress = txReceipt.contractAddress;
            let contract = await SafeMath.At(rawAddress, w3);
            return contract;
        }
    }

    public static async At(address: string | object, w3?: W3): Promise<SafeMath> {
        let contract = new SafeMath(address, undefined, w3, undefined);
        await contract._instancePromise;
        return contract;
    }

    public static async Deployed(w3?: W3): Promise<SafeMath> {
        let contract = new SafeMath('', undefined, w3, undefined);
        await contract._instancePromise;
        return contract;
    }

    // tslint:disable-next-line:max-line-length
    public static NewData(ctorParams?: {}, w3?: W3): string {
        // tslint:disable-next-line:max-line-length
        let data = SoltsiceContract.NewDataImpl(w3, SafeMath.Artifacts, ctorParams ? [] : []);
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
            SafeMath.Artifacts,
            ctorParams ? [] : [],
            deploymentParams,
            link
        );
    }
    /*
        Contract methods
    */
    
}
