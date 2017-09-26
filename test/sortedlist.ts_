import { SortedList } from '../src/contracts';
import { W3, testAccounts } from '../src';
import { BigNumber } from 'bignumber.js';
import * as assert from 'assert';

contract('DummyContract', function (accounts) {
  it("Could iterate sorted list", async function () {
    var sl = new SortedList(W3.TC.txParamsDefaultDeploy(testAccounts[0]));
    let value = await sl.iterate();
    console.log('VALUE: ', value.toFormat(0));
    assert.equal(true, value.equals(new BigNumber(123 * 1000)), "should have interated 1k times over 123");
  });
});  
