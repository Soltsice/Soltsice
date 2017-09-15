
import { default as contract } from 'truffle-contract';
import { BigNumber } from 'bignumber.js';
import { Web3 } from '..';

/**
 * MultiSigWallet API
 */
export class MultiSigWallet {
    public address: string;
    private web3: Web3;
    private instance: Promise<any>;
    constructor(
        web3: Web3,
        deploymentParams?: string | Web3.TC.TxParams,
        ctorParams?: {_owners: string[], _required: BigNumber}
    ) {
        if (typeof deploymentParams === 'string' && !Web3.isValidAddress(deploymentParams as string)) {
            throw 'Invalid deployed contract address';
        }

        this.web3 = web3;
        let tokenArtifacts = require('../../../contracts/MultiSigWallet.json');

        let Contract = contract(tokenArtifacts);
        Contract.setProvider(web3.currentProvider);

        if (typeof deploymentParams !== 'string') {
            Contract.defaults(deploymentParams);
        }

        let instance = new Promise((resolve, reject) => {
            if (typeof deploymentParams === 'string' && Web3.isValidAddress(deploymentParams)) {
                console.log('USING DEPLOYED: ', 'MultiSigWallet');
                this.address = deploymentParams!;
                this.instance = Contract.at(this.address).then((inst) => {
                    resolve(inst);
                }).catch((err) => {
                    reject(err);
                });
            } else {
                console.log('NEW CONTRACT: ', 'MultiSigWallet');
                // tslint:disable-next-line:max-line-length
                this.instance = Contract.new([ctorParams!._owners, ctorParams!._required] as Web3.TC.ContractDataType[]).then((inst) => {
                    console.log('NEW ADDRESS', inst.address);
                    resolve(inst);
                }).catch((err) => {
                    reject(err);
                });
            }
        });

        this.instance = instance;
    }

    /*
        Contract methods
    */
    
    // tslint:disable-next-line:variable-name
    owners(_0: BigNumber): Promise<string> {
        return new Promise((resolve, reject) => {
            this.instance.then((inst) => {
                inst.owners
                    .call(_0)
                    .then((res) => resolve(res))
                    .catch((err) => reject(err));
            });
        });
    }
    
    // tslint:disable-next-line:variable-name
    removeOwner(owner: string): Promise<void> {
        return new Promise((resolve, reject) => {
            this.instance.then((inst) => {
                inst.removeOwner(owner)
                    .then((res) => resolve(res))
                    .catch((err) => reject(err));
            });
        });
    }
    
    // tslint:disable-next-line:variable-name
    revokeConfirmation(transactionId: BigNumber): Promise<void> {
        return new Promise((resolve, reject) => {
            this.instance.then((inst) => {
                inst.revokeConfirmation(transactionId)
                    .then((res) => resolve(res))
                    .catch((err) => reject(err));
            });
        });
    }
    
    // tslint:disable-next-line:variable-name
    isOwner(_0: string): Promise<boolean> {
        return new Promise((resolve, reject) => {
            this.instance.then((inst) => {
                inst.isOwner
                    .call(_0)
                    .then((res) => resolve(res))
                    .catch((err) => reject(err));
            });
        });
    }
    
    // tslint:disable-next-line:variable-name
    confirmations(_0: BigNumber, _1: string): Promise<boolean> {
        return new Promise((resolve, reject) => {
            this.instance.then((inst) => {
                inst.confirmations
                    .call(_0, _1)
                    .then((res) => resolve(res))
                    .catch((err) => reject(err));
            });
        });
    }
    
    // tslint:disable-next-line:variable-name
    getTransactionCount(pending: boolean, executed: boolean): Promise<BigNumber> {
        return new Promise((resolve, reject) => {
            this.instance.then((inst) => {
                inst.getTransactionCount
                    .call(pending, executed)
                    .then((res) => resolve(res))
                    .catch((err) => reject(err));
            });
        });
    }
    
    // tslint:disable-next-line:variable-name
    addOwner(owner: string): Promise<void> {
        return new Promise((resolve, reject) => {
            this.instance.then((inst) => {
                inst.addOwner(owner)
                    .then((res) => resolve(res))
                    .catch((err) => reject(err));
            });
        });
    }
    
    // tslint:disable-next-line:variable-name
    isConfirmed(transactionId: BigNumber): Promise<boolean> {
        return new Promise((resolve, reject) => {
            this.instance.then((inst) => {
                inst.isConfirmed
                    .call(transactionId)
                    .then((res) => resolve(res))
                    .catch((err) => reject(err));
            });
        });
    }
    
    // tslint:disable-next-line:variable-name
    getConfirmationCount(transactionId: BigNumber): Promise<BigNumber> {
        return new Promise((resolve, reject) => {
            this.instance.then((inst) => {
                inst.getConfirmationCount
                    .call(transactionId)
                    .then((res) => resolve(res))
                    .catch((err) => reject(err));
            });
        });
    }
    
    // tslint:disable-next-line:variable-name
    transactions(_0: BigNumber): Promise<any> {
        return new Promise((resolve, reject) => {
            this.instance.then((inst) => {
                inst.transactions
                    .call(_0)
                    .then((res) => resolve(res))
                    .catch((err) => reject(err));
            });
        });
    }
    
    // tslint:disable-next-line:variable-name
    getOwners(): Promise<string[]> {
        return new Promise((resolve, reject) => {
            this.instance.then((inst) => {
                inst.getOwners
                    .call()
                    .then((res) => resolve(res))
                    .catch((err) => reject(err));
            });
        });
    }
    
    // tslint:disable-next-line:variable-name
    getTransactionIds(from: BigNumber, to: BigNumber, pending: boolean, executed: boolean): Promise<BigNumber> {
        return new Promise((resolve, reject) => {
            this.instance.then((inst) => {
                inst.getTransactionIds
                    .call(from, to, pending, executed)
                    .then((res) => resolve(res))
                    .catch((err) => reject(err));
            });
        });
    }
    
    // tslint:disable-next-line:variable-name
    getConfirmations(transactionId: BigNumber): Promise<string[]> {
        return new Promise((resolve, reject) => {
            this.instance.then((inst) => {
                inst.getConfirmations
                    .call(transactionId)
                    .then((res) => resolve(res))
                    .catch((err) => reject(err));
            });
        });
    }
    
    // tslint:disable-next-line:variable-name
    transactionCount(): Promise<BigNumber> {
        return new Promise((resolve, reject) => {
            this.instance.then((inst) => {
                inst.transactionCount
                    .call()
                    .then((res) => resolve(res))
                    .catch((err) => reject(err));
            });
        });
    }
    
    // tslint:disable-next-line:variable-name
    changeRequirement(_required: BigNumber): Promise<void> {
        return new Promise((resolve, reject) => {
            this.instance.then((inst) => {
                inst.changeRequirement(_required)
                    .then((res) => resolve(res))
                    .catch((err) => reject(err));
            });
        });
    }
    
    // tslint:disable-next-line:variable-name
    confirmTransaction(transactionId: BigNumber): Promise<void> {
        return new Promise((resolve, reject) => {
            this.instance.then((inst) => {
                inst.confirmTransaction(transactionId)
                    .then((res) => resolve(res))
                    .catch((err) => reject(err));
            });
        });
    }
    
    // tslint:disable-next-line:variable-name
    submitTransaction(destination: string, value: BigNumber, data: string): Promise<BigNumber> {
        return new Promise((resolve, reject) => {
            this.instance.then((inst) => {
                inst.submitTransaction(destination, value, data)
                    .then((res) => resolve(res))
                    .catch((err) => reject(err));
            });
        });
    }
    
    // tslint:disable-next-line:variable-name
    MAX_OWNER_COUNT(): Promise<BigNumber> {
        return new Promise((resolve, reject) => {
            this.instance.then((inst) => {
                inst.MAX_OWNER_COUNT
                    .call()
                    .then((res) => resolve(res))
                    .catch((err) => reject(err));
            });
        });
    }
    
    // tslint:disable-next-line:variable-name
    required(): Promise<BigNumber> {
        return new Promise((resolve, reject) => {
            this.instance.then((inst) => {
                inst.required
                    .call()
                    .then((res) => resolve(res))
                    .catch((err) => reject(err));
            });
        });
    }
    
    // tslint:disable-next-line:variable-name
    replaceOwner(owner: string, newOwner: string): Promise<void> {
        return new Promise((resolve, reject) => {
            this.instance.then((inst) => {
                inst.replaceOwner(owner, newOwner)
                    .then((res) => resolve(res))
                    .catch((err) => reject(err));
            });
        });
    }
    
    // tslint:disable-next-line:variable-name
    executeTransaction(transactionId: BigNumber): Promise<void> {
        return new Promise((resolve, reject) => {
            this.instance.then((inst) => {
                inst.executeTransaction(transactionId)
                    .then((res) => resolve(res))
                    .catch((err) => reject(err));
            });
        });
    }
    
}
