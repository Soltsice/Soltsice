import { W3, SoltsiceContract, testAccounts } from '../src'
import { BigNumber } from 'bignumber.js';
import * as assert from 'assert';

export class DummyToken extends SoltsiceContract {
    constructor(
        web3: W3,
        constructorParams: W3.TC.ContractDataType[],
        deploymentParams?: string | W3.TC.TxParams
    ) {
        super(web3, '../build/contracts/DummyToken.json', constructorParams, deploymentParams)
    }

    /*
        Contract methods
    */

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
}

contract('DummyToken', function (accounts) {
    it("Total supply should be 1400000 * 1e18", function () {
        var DummyContractInstance = new DummyToken(W3.Default, [testAccounts[0]], W3.TC.txParamsDefaultDeploy(testAccounts[0]));
        return DummyContractInstance.totalSupply().then(function (value) {
            assert.equal(value, 1400000 * 1e18, "value was not 1400000 * 1e18");
        });
    });
});
