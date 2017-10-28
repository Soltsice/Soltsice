
import { W3, SoltsiceContract } from '..';

/**
 * SafeMath API
 */
export class SafeMath extends SoltsiceContract {
    static get Artifacts() { return require('../artifacts/SafeMath.json'); }
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
