
import { BigNumber } from 'bignumber.js';
import { W3, SoltsiceContract } from '..';

/**
 * VestedToken API
 */
export class VestedToken extends SoltsiceContract {
    constructor(
        web3: W3,
        constructorParams: W3.TC.ContractDataType[],
        deploymentParams?: string | W3.TC.TxParams
    ) {
        super(web3, '../../build/contracts/VestedToken.json', constructorParams, deploymentParams)
    }

    /*
        Contract methods
    */
    
    // tslint:disable-next-line:variable-name
    tokenGrantsCount(_holder: string): Promise<BigNumber> {
        return new Promise((resolve, reject) => {
            this.instance.then((inst) => {
                inst.tokenGrantsCount
                    .call(_holder)
                    .then((res) => resolve(res))
                    .catch((err) => reject(err));
            });
        });
    }
    
    // tslint:disable-next-line:variable-name
    approve(_spender: string, _value: BigNumber): Promise<boolean> {
        return new Promise((resolve, reject) => {
            this.instance.then((inst) => {
                inst.approve(_spender, _value)
                    .then((res) => resolve(res))
                    .catch((err) => reject(err));
            });
        });
    }
    
    // tslint:disable-next-line:variable-name
    totalSupply(): Promise<BigNumber> {
        return new Promise((resolve, reject) => {
            this.instance.then((inst) => {
                inst.totalSupply
                    .call()
                    .then((res) => resolve(res))
                    .catch((err) => reject(err));
            });
        });
    }
    
    // tslint:disable-next-line:variable-name
    transferFrom(_from: string, _to: string, _value: BigNumber): Promise<boolean> {
        return new Promise((resolve, reject) => {
            this.instance.then((inst) => {
                inst.transferFrom(_from, _to, _value)
                    .then((res) => resolve(res))
                    .catch((err) => reject(err));
            });
        });
    }
    
    // tslint:disable-next-line:variable-name
    grants(_0: string, _1: BigNumber): Promise<any> {
        return new Promise((resolve, reject) => {
            this.instance.then((inst) => {
                inst.grants
                    .call(_0, _1)
                    .then((res) => resolve(res))
                    .catch((err) => reject(err));
            });
        });
    }
    
    // tslint:disable-next-line:variable-name
    tokenGrant(_holder: string, _grantId: BigNumber): Promise<any> {
        return new Promise((resolve, reject) => {
            this.instance.then((inst) => {
                inst.tokenGrant
                    .call(_holder, _grantId)
                    .then((res) => resolve(res))
                    .catch((err) => reject(err));
            });
        });
    }
    
    // tslint:disable-next-line:variable-name
    decreaseApproval(_spender: string, _subtractedValue: BigNumber): Promise<boolean> {
        return new Promise((resolve, reject) => {
            this.instance.then((inst) => {
                inst.decreaseApproval(_spender, _subtractedValue)
                    .then((res) => resolve(res))
                    .catch((err) => reject(err));
            });
        });
    }
    
    // tslint:disable-next-line:variable-name
    lastTokenIsTransferableDate(holder: string): Promise<BigNumber> {
        return new Promise((resolve, reject) => {
            this.instance.then((inst) => {
                inst.lastTokenIsTransferableDate
                    .call(holder)
                    .then((res) => resolve(res))
                    .catch((err) => reject(err));
            });
        });
    }
    
    // tslint:disable-next-line:variable-name
    balanceOf(_owner: string): Promise<BigNumber> {
        return new Promise((resolve, reject) => {
            this.instance.then((inst) => {
                inst.balanceOf
                    .call(_owner)
                    .then((res) => resolve(res))
                    .catch((err) => reject(err));
            });
        });
    }
    
    // tslint:disable-next-line:variable-name
    grantVestedTokens(_to: string, _value: BigNumber, _start: BigNumber, _cliff: BigNumber, _vesting: BigNumber, _revokable: boolean, _burnsOnRevoke: boolean): Promise<void> {
        return new Promise((resolve, reject) => {
            this.instance.then((inst) => {
                inst.grantVestedTokens(_to, _value, _start, _cliff, _vesting, _revokable, _burnsOnRevoke)
                    .then((res) => resolve(res))
                    .catch((err) => reject(err));
            });
        });
    }
    
    // tslint:disable-next-line:variable-name
    transfer(_to: string, _value: BigNumber): Promise<boolean> {
        return new Promise((resolve, reject) => {
            this.instance.then((inst) => {
                inst.transfer(_to, _value)
                    .then((res) => resolve(res))
                    .catch((err) => reject(err));
            });
        });
    }
    
    // tslint:disable-next-line:variable-name
    transferableTokens(holder: string, time: BigNumber): Promise<BigNumber> {
        return new Promise((resolve, reject) => {
            this.instance.then((inst) => {
                inst.transferableTokens
                    .call(holder, time)
                    .then((res) => resolve(res))
                    .catch((err) => reject(err));
            });
        });
    }
    
    // tslint:disable-next-line:variable-name
    increaseApproval(_spender: string, _addedValue: BigNumber): Promise<boolean> {
        return new Promise((resolve, reject) => {
            this.instance.then((inst) => {
                inst.increaseApproval(_spender, _addedValue)
                    .then((res) => resolve(res))
                    .catch((err) => reject(err));
            });
        });
    }
    
    // tslint:disable-next-line:variable-name
    allowance(_owner: string, _spender: string): Promise<BigNumber> {
        return new Promise((resolve, reject) => {
            this.instance.then((inst) => {
                inst.allowance
                    .call(_owner, _spender)
                    .then((res) => resolve(res))
                    .catch((err) => reject(err));
            });
        });
    }
    
    // tslint:disable-next-line:variable-name
    calculateVestedTokens(tokens: BigNumber, time: BigNumber, start: BigNumber, cliff: BigNumber, vesting: BigNumber): Promise<BigNumber> {
        return new Promise((resolve, reject) => {
            this.instance.then((inst) => {
                inst.calculateVestedTokens
                    .call(tokens, time, start, cliff, vesting)
                    .then((res) => resolve(res))
                    .catch((err) => reject(err));
            });
        });
    }
    
    // tslint:disable-next-line:variable-name
    revokeTokenGrant(_holder: string, _grantId: BigNumber): Promise<void> {
        return new Promise((resolve, reject) => {
            this.instance.then((inst) => {
                inst.revokeTokenGrant(_holder, _grantId)
                    .then((res) => resolve(res))
                    .catch((err) => reject(err));
            });
        });
    }
    
}
