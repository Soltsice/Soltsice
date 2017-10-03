pragma solidity ^0.4.15;


import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/DummyContract.sol";


contract TestDummyContract {

    // function testDeployedValues() {
    //   uint expectedSecret = 123;
    //   uint expectedPublic = 456;

    //   //  DummyContract dummy = new DummyContract(expectedSecret, expectedPublic);
    //   DummyContract dummy = DummyContract(DeployedAddresses.DummyContract());

    //   Assert.equal(dummy.getPrivate(), expectedSecret, "Initial secret value must be 31415");

    //   Assert.equal(dummy.getPublic(), expectedPublic, "Initial secret value must be 27182");
    //   uint viaFiled = dummy.wellKnown();
    //   Assert.equal(viaFiled, expectedPublic, "Initial secret value must be 27182");

    // }

    function testProvidedValues() {
        uint expectedSecret = 31415;
        uint expectedPublic = 27182;

        DummyContract dummy = new DummyContract(expectedSecret, expectedPublic);


        Assert.equal(dummy.getPrivate(), expectedSecret, "Initial secret value must be 31415");

        Assert.equal(dummy.getPublic(), expectedPublic, "Initial secret value must be 27182");
        uint viaFiled = dummy.wellKnown();
        Assert.equal(viaFiled, expectedPublic, "Initial secret value must be 27182");

    }

}
