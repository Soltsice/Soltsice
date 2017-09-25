import { DummyToken } from '../src/contracts'
import { W3, testAccounts } from '../src'
import * as assert from 'assert';

contract('DummyToken', function (accounts) {
    it("Total supply should be 1400000 * 1e18", async function () {
        var DummyContractInstance = new DummyToken(W3.TC.txParamsDefaultDeploy(testAccounts[0]), {_multisig: testAccounts[0]});
        let value = await DummyContractInstance.totalSupply();
        assert.equal(value, 1400000 * 1e18, "value was not 1400000 * 1e18");
    });
});
