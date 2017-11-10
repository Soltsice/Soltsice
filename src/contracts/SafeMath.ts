
import { W3, SoltsiceContract } from '..';

/**
 * SafeMath API
 */
export class SafeMath extends SoltsiceContract {
    static get Artifacts() { return require('../artifacts/SafeMath.json'); }

    static get BytecodeHash() {
        // we need this before ctor, but artifacts are static and we cannot pass it to the base class, so need to generate
        let artifacts = SafeMath.Artifacts;
        if (!artifacts || !artifacts.bytecode) {
            return undefined;
        }
        let hash = W3.sha3(JSON.stringify(artifacts.bytecode));
        return hash;
    }

    constructor(
        deploymentParams: string | W3.TC.TxParams | object,
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
