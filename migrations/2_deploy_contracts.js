var ConvertLib = artifacts.require("./ConvertLib.sol");
var MetaCoin = artifacts.require("./MetaCoin.sol");
var DummyContract = artifacts.require("./DummyContract.sol");
var DummyToken = artifacts.require("./DummyToken.sol");

module.exports = function(deployer) {
  deployer.deploy(ConvertLib);
  deployer.link(ConvertLib, MetaCoin);
  deployer.deploy(MetaCoin);
  deployer.deploy(DummyContract, 123, 456);
  deployer.deploy(DummyToken, '0xd7126c8c920800706f826df0772d792343cfecca');
};
