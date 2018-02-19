
import { BigNumber } from 'bignumber.js';
import { W3, SoltsiceContract } from '..';

/**
 * ArrayTypesTest API
 */
export class ArrayTypesTest extends SoltsiceContract {
    public static get Artifacts() { return require('../artifacts/ArrayTypesTest.json'); }

    public static get BytecodeHash() {
        // we need this before ctor, but artifacts are static and we cannot pass it to the base class, so need to generate
        let artifacts = ArrayTypesTest.Artifacts;
        if (!artifacts || !artifacts.bytecode) {
            return undefined;
        }
        let hash = W3.sha3(JSON.stringify(artifacts.bytecode));
        return hash;
    }

    // tslint:disable-next-line:max-line-length
    public static async New(deploymentParams: W3.TX.TxParams, ctorParams?: {_array: BigNumber[] | number[]}, w3?: W3, link?: SoltsiceContract[]): Promise<ArrayTypesTest> {
        let contract = new ArrayTypesTest(deploymentParams, ctorParams, w3, link);
        await contract._instancePromise;
        return contract;
    }

    public static async At(address: string | object, w3?: W3): Promise<ArrayTypesTest> {
        let contract = new ArrayTypesTest(address, undefined, w3, undefined);
        await contract._instancePromise;
        return contract;
    }

    public static async Deployed(w3?: W3): Promise<ArrayTypesTest> {
        let contract = new ArrayTypesTest('', undefined, w3, undefined);
        await contract._instancePromise;
        return contract;
    }

    // tslint:disable-next-line:max-line-length
    public static NewData(ctorParams?: {_array: BigNumber[] | number[]}, w3?: W3): string {
        // tslint:disable-next-line:max-line-length
        let data = SoltsiceContract.NewDataImpl(w3, ArrayTypesTest.Artifacts, ctorParams ? [ctorParams!._array] : []);
        return data;
    }

    protected constructor(
        deploymentParams: string | W3.TX.TxParams | object,
        ctorParams?: {_array: BigNumber[] | number[]},
        w3?: W3,
        link?: SoltsiceContract[]
    ) {
        // tslint:disable-next-line:max-line-length
        super(
            w3,
            ArrayTypesTest.Artifacts,
            ctorParams ? [ctorParams!._array] : [],
            deploymentParams,
            link
        );
    }
    /*
        Contract methods
    */
    
    // tslint:disable-next-line:max-line-length
    // tslint:disable-next-line:variable-name
    public array(_0: BigNumber | number, txParams?: W3.TX.TxParams): Promise<BigNumber> {
        return new Promise((resolve, reject) => {
            this._instance.array
                .call(_0, txParams || this._sendParams)
                .then((res) => resolve(res))
                .catch((err) => reject(err));
        });
    }
    
    // tslint:disable-next-line:max-line-length
    // tslint:disable-next-line:variable-name
    public funcArrayInArguments(_array: string[], txParams?: W3.TX.TxParams): Promise<string[]> {
        return new Promise((resolve, reject) => {
            this._instance.funcArrayInArguments
                .call(_array, txParams || this._sendParams)
                .then((res) => resolve(res))
                .catch((err) => reject(err));
        });
    }
    
}
