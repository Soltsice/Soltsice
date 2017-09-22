import { DummyToken } from '../src/contracts'
import { W3, testAccounts } from '../src'
import * as assert from 'assert';

contract('DummyToken', function (accounts) {
    it("Total supply should be 1400000 * 1e18", function () {
        var DummyContractInstance = new DummyToken(W3.Default, W3.TC.txParamsDefaultDeploy(testAccounts[0]), {_multisig: testAccounts[0]});
        return DummyContractInstance.totalSupply().then(function (value) {
            assert.equal(value, 1400000 * 1e18, "value was not 1400000 * 1e18");
        });
    });
});
