var DummyContract = artifacts.require("./DummyContract.sol");

contract('DummyContract', function(accounts) {
  it("should have initial private value from deployer", function() {
    return DummyContract.deployed().then(function(instance) {
      return instance.getPrivate.call();
    }).then(function (value) {
      assert.equal(value, 123, "123 wasn't in the private value");
    });
  });
 
  it("should have initial public value from deployer", function() {
    return DummyContract.deployed().then(function(instance) {
      return instance.getPublic.call();
    }).then(function (value) {
      assert.equal(value, 456, "456 wasn't in the public value");
    });
  });

});
