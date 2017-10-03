
import { BigNumber } from 'bignumber.js';
import { W3, SoltsiceContract } from '..';

/**
 * BasicToken API
 */
export class BasicToken extends SoltsiceContract {
    constructor(
        deploymentParams: string | W3.TC.TxParams | object,
        ctorParams?: {},
        web3?: W3,
        link?: SoltsiceContract[]
    ) {
        // tslint:disable-next-line:max-line-length
        super(
            web3,
            require('../artifacts/BasicToken.json'),
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
    public totalSupply(): Promise<BigNumber> {
        return new Promise((resolve, reject) => {
            this._instance.then((inst) => {
                inst.totalSupply
                    .call()
                    .then((res) => resolve(res))
                    .catch((err) => reject(err));
            });
        });
    }
    
    // tslint:disable-next-line:max-line-length
    // tslint:disable-next-line:variable-name
    public balanceOf(_owner: string): Promise<BigNumber> {
        return new Promise((resolve, reject) => {
            this._instance.then((inst) => {
                inst.balanceOf
                    .call(_owner)
                    .then((res) => resolve(res))
                    .catch((err) => reject(err));
            });
        });
    }
    
    public get transfer() {
        // tslint:disable-next-line:max-line-length
        // tslint:disable-next-line:variable-name
        let ___call = (_to: string, _value: BigNumber, txParams?: W3.TC.TxParams): Promise<W3.TC.TransactionResult> => {
            txParams = txParams || this._sendParams;
            return new Promise((resolve, reject) => {
                this._instance.then((inst) => {
                    inst.transfer(_to, _value, txParams)
                        .then((res) => resolve(res))
                        .catch((err) => reject(err));
                });
            });
        };
        // tslint:disable-next-line:max-line-length
        // tslint:disable-next-line:variable-name
        let ___tx = (_to: string, _value: BigNumber, txParams?: W3.TC.TxParams): Promise<string> => {
            txParams = txParams || this._sendParams;
            return new Promise((resolve, reject) => {
                this._instance.then((inst) => {
                    inst.transfer.sendTransaction(_to, _value, txParams)
                        .then((res) => resolve(res))
                        .catch((err) => reject(err));
                });
            });
        };
        // tslint:disable-next-line:max-line-length
        // tslint:disable-next-line:variable-name
        let ___data = (_to: string, _value: BigNumber): Promise<string> => {
            return new Promise((resolve, reject) => {
                this._instance.then((inst) => {
                    resolve(inst.transfer.request(_to, _value).params[0].data);
                });
            });
        };
        // tslint:disable-next-line:max-line-length
        // tslint:disable-next-line:variable-name
        let ___gas = (_to: string, _value: BigNumber): Promise<number> => {
            return new Promise((resolve, reject) => {
                this._instance.then((inst) => {
                    inst.transfer.estimateGas(_to, _value).then((g) => resolve(g));
                });
            });
        };
        let method = Object.assign(___call, { data: ___data }, {estimateGas: ___gas}, {sendTransaction: ___tx});
        return method;
    }
    
}
