
import { BigNumber } from 'bignumber.js';
import { W3, SoltsiceContract } from '..';

/**
 * MintableToken API
 */
export class MintableToken extends SoltsiceContract {
    constructor(
        deploymentParams: string | W3.TC.TxParams | object,
        ctorParams?: {},
        web3?: W3,
    ) {
        // tslint:disable-next-line:max-line-length
        super(
            web3,
            require('../artifacts/MintableToken.json'), 
            ctorParams ? [] : [], 
            deploymentParams
        );
    }

    /*
        Contract methods
    */
    
    // tslint:disable-next-line:variable-name
    public mintingFinished(): Promise<boolean> {
        return new Promise((resolve, reject) => {
            this._instance.then((inst) => {
                inst.mintingFinished
                    .call()
                    .then((res) => resolve(res))
                    .catch((err) => reject(err));
            });
        });
    }
    
    public get approve() {
        let call = (_spender: string, _value: BigNumber): Promise<W3.TC.TransactionResult> => {
            return new Promise((resolve, reject) => {
                this._instance.then((inst) => {
                    inst.approve(_spender, _value)
                        .then((res) => resolve(res))
                        .catch((err) => reject(err));
                });
            })
        };
        let data = (_spender: string, _value: BigNumber): Promise<string> => {
            return new Promise((resolve, reject) => {
                this._instance.then((inst) => {
                    resolve(inst.approve.request(_spender, _value).params[0].data);
                });
            });
        };
        let method = Object.assign(call, { data: data });
        return method;
    }


    
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
    
    public get transferFrom() {
        let call = (_from: string, _to: string, _value: BigNumber): Promise<W3.TC.TransactionResult> => {
            return new Promise((resolve, reject) => {
                this._instance.then((inst) => {
                    inst.transferFrom(_from, _to, _value)
                        .then((res) => resolve(res))
                        .catch((err) => reject(err));
                });
            })
        };
        let data = (_from: string, _to: string, _value: BigNumber): Promise<string> => {
            return new Promise((resolve, reject) => {
                this._instance.then((inst) => {
                    resolve(inst.transferFrom.request(_from, _to, _value).params[0].data);
                });
            });
        };
        let method = Object.assign(call, { data: data });
        return method;
    }


    
    public get mint() {
        let call = (_to: string, _amount: BigNumber): Promise<W3.TC.TransactionResult> => {
            return new Promise((resolve, reject) => {
                this._instance.then((inst) => {
                    inst.mint(_to, _amount)
                        .then((res) => resolve(res))
                        .catch((err) => reject(err));
                });
            })
        };
        let data = (_to: string, _amount: BigNumber): Promise<string> => {
            return new Promise((resolve, reject) => {
                this._instance.then((inst) => {
                    resolve(inst.mint.request(_to, _amount).params[0].data);
                });
            });
        };
        let method = Object.assign(call, { data: data });
        return method;
    }


    
    public get decreaseApproval() {
        let call = (_spender: string, _subtractedValue: BigNumber): Promise<W3.TC.TransactionResult> => {
            return new Promise((resolve, reject) => {
                this._instance.then((inst) => {
                    inst.decreaseApproval(_spender, _subtractedValue)
                        .then((res) => resolve(res))
                        .catch((err) => reject(err));
                });
            })
        };
        let data = (_spender: string, _subtractedValue: BigNumber): Promise<string> => {
            return new Promise((resolve, reject) => {
                this._instance.then((inst) => {
                    resolve(inst.decreaseApproval.request(_spender, _subtractedValue).params[0].data);
                });
            });
        };
        let method = Object.assign(call, { data: data });
        return method;
    }


    
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
    
    public get finishMinting() {
        let call = (): Promise<W3.TC.TransactionResult> => {
            return new Promise((resolve, reject) => {
                this._instance.then((inst) => {
                    inst.finishMinting()
                        .then((res) => resolve(res))
                        .catch((err) => reject(err));
                });
            })
        };
        let data = (): Promise<string> => {
            return new Promise((resolve, reject) => {
                this._instance.then((inst) => {
                    resolve(inst.finishMinting.request().params[0].data);
                });
            });
        };
        let method = Object.assign(call, { data: data });
        return method;
    }


    
    // tslint:disable-next-line:variable-name
    public owner(): Promise<string> {
        return new Promise((resolve, reject) => {
            this._instance.then((inst) => {
                inst.owner
                    .call()
                    .then((res) => resolve(res))
                    .catch((err) => reject(err));
            });
        });
    }
    
    public get transfer() {
        let call = (_to: string, _value: BigNumber): Promise<W3.TC.TransactionResult> => {
            return new Promise((resolve, reject) => {
                this._instance.then((inst) => {
                    inst.transfer(_to, _value)
                        .then((res) => resolve(res))
                        .catch((err) => reject(err));
                });
            })
        };
        let data = (_to: string, _value: BigNumber): Promise<string> => {
            return new Promise((resolve, reject) => {
                this._instance.then((inst) => {
                    resolve(inst.transfer.request(_to, _value).params[0].data);
                });
            });
        };
        let method = Object.assign(call, { data: data });
        return method;
    }


    
    public get increaseApproval() {
        let call = (_spender: string, _addedValue: BigNumber): Promise<W3.TC.TransactionResult> => {
            return new Promise((resolve, reject) => {
                this._instance.then((inst) => {
                    inst.increaseApproval(_spender, _addedValue)
                        .then((res) => resolve(res))
                        .catch((err) => reject(err));
                });
            })
        };
        let data = (_spender: string, _addedValue: BigNumber): Promise<string> => {
            return new Promise((resolve, reject) => {
                this._instance.then((inst) => {
                    resolve(inst.increaseApproval.request(_spender, _addedValue).params[0].data);
                });
            });
        };
        let method = Object.assign(call, { data: data });
        return method;
    }


    
    // tslint:disable-next-line:variable-name
    public allowance(_owner: string, _spender: string): Promise<BigNumber> {
        return new Promise((resolve, reject) => {
            this._instance.then((inst) => {
                inst.allowance
                    .call(_owner, _spender)
                    .then((res) => resolve(res))
                    .catch((err) => reject(err));
            });
        });
    }
    
    public get transferOwnership() {
        let call = (newOwner: string): Promise<W3.TC.TransactionResult> => {
            return new Promise((resolve, reject) => {
                this._instance.then((inst) => {
                    inst.transferOwnership(newOwner)
                        .then((res) => resolve(res))
                        .catch((err) => reject(err));
                });
            })
        };
        let data = (newOwner: string): Promise<string> => {
            return new Promise((resolve, reject) => {
                this._instance.then((inst) => {
                    resolve(inst.transferOwnership.request(newOwner).params[0].data);
                });
            });
        };
        let method = Object.assign(call, { data: data });
        return method;
    }


    
}
