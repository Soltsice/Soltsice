var ConvertLib = artifacts.require("./ConvertLib.sol");
var MetaCoin = artifacts.require("./MetaCoin.sol");
var DummyContract = artifacts.require("./DummyContract.sol");
var DBrainToken = artifacts.require("./DBrainToken.sol");

module.exports = function(deployer) {
  deployer.deploy(ConvertLib);
  deployer.link(ConvertLib, MetaCoin);
  deployer.deploy(MetaCoin);
  deployer.deploy(DummyContract, 123, 456);
  deployer.deploy(DBrainToken, '0x3709dd98e7cb36c84daf6df739c321c59c106331');
};
