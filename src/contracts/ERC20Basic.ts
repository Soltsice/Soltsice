
import { BigNumber } from 'bignumber.js';
import { W3, SoltsiceContract } from '..';

/**
 * ERC20Basic API
 */
export class ERC20Basic extends SoltsiceContract {
    constructor(
        deploymentParams: string | W3.TC.TxParams | object,
        ctorParams?: {},
        web3?: W3,
    ) {
        // tslint:disable-next-line:max-line-length
        super(
            web3,
            require('../artifacts/ERC20Basic.json'), 
            ctorParams ? [] : [], 
            deploymentParams
        );
    }

    /*
        Contract methods
    */
    
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
    
    // tslint:disable-next-line:variable-name
    public balanceOf(who: string): Promise<BigNumber> {
        return new Promise((resolve, reject) => {
            this._instance.then((inst) => {
                inst.balanceOf
                    .call(who)
                    .then((res) => resolve(res))
                    .catch((err) => reject(err));
            });
        });
    }
    
    public get transfer() {
        let call = (to: string, value: BigNumber): Promise<W3.TC.TransactionResult> => {
            return new Promise((resolve, reject) => {
                this._instance.then((inst) => {
                    inst.transfer(to, value)
                        .then((res) => resolve(res))
                        .catch((err) => reject(err));
                });
            })
        };
        let data = (to: string, value: BigNumber): Promise<string> => {
            return new Promise((resolve, reject) => {
                this._instance.then((inst) => {
                    resolve(inst.transfer.request(to, value).params[0].data);
                });
            });
        };
        let method = Object.assign(call, { data: data });
        return method;
    }


    
}
