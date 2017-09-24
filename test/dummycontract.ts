import { DummyContract } from '../src/contracts'
import { BigNumber } from 'bignumber.js'
var dummyContract = artifacts.require("./DummyContract.sol");

contract('DummyContract', function(accounts) {
  it("should have initial private value from deployer", function() {
    return dummyContract.deployed().then(async function (instance) {
      // typed contract could be initiated with an instance supplied by Truffle
      let dummy = new DummyContract(instance);
      let pr = await dummy.getPrivate();
      assert.equal(pr, 123, "123 wasn't in the private value");
      await dummy.setPrivate(new BigNumber(123456));
      pr = await dummy.getPrivate();
      assert.equal(pr, 123456, "123456 wasn't in the private value");
    });
  });
 
  it("should have initial public value from deployer", function() {
    return dummyContract.deployed().then(async function (instance) {
      let dummy = new DummyContract(instance);
      let value = await dummy.getPublic();
      assert.equal(value, 456, "456 wasn't in the public value");
    });
  });

});
