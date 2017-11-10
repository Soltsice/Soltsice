pragma solidity ^0.4.15;

import 'zeppelin-solidity/contracts/ownership/Ownable.sol';

/** Schemaless storage */
contract Storage is Ownable {

    mapping(bytes32 => uint) UIntStorage;

    function getUIntValue(bytes32 record) constant returns (uint) {
        return UIntStorage[record];
    }

    function setUIntValue(bytes32 record, uint value) 
        onlyOwner
    {
        UIntStorage[record] = value;
    }

    mapping(bytes32 => string) StringStorage;

    function getStringValue(bytes32 record) constant returns (string) {
        return StringStorage[record];
    }

    function setStringValue(bytes32 record, string value)
        onlyOwner
    {
        StringStorage[record] = value;
    }

    mapping(bytes32 => address) AddressStorage;

    function getAddressValue(bytes32 record) constant returns (address) {
        return AddressStorage[record];
    }

    function setAddressValue(bytes32 record, address value)
        onlyOwner
    {
        AddressStorage[record] = value;
    }

    mapping(bytes32 => bytes) BytesStorage;

    function getBytesValue(bytes32 record) constant returns (bytes) {
        return BytesStorage[record];
    }

    function setBytesValue(bytes32 record, bytes value)
        onlyOwner
    {
        BytesStorage[record] = value;
    }

    mapping(bytes32 => bool) BooleanStorage;

    function getBooleanValue(bytes32 record) constant returns (bool) {
        return BooleanStorage[record];
    }

    function setBooleanValue(bytes32 record, bool value)
        onlyOwner
    {
        BooleanStorage[record] = value;
    }
    
    mapping(bytes32 => int) IntStorage;

    function getIntValue(bytes32 record) constant returns (int) {
        return IntStorage[record];
    }

    function setIntValue(bytes32 record, int value)
        onlyOwner
    {
        IntStorage[record] = value;
    }

}


contract StorageFactory {
    address private creator;
    mapping(address => address) public existingStorage;

    function StorageFactory() {
        creator = msg.sender;
    }

    function produce() 
        external
    {
        // protect from 'I accidentally killed it' overwrite
        require(existingStorage[msg.sender] == address(0));
        Storage newContract = new Storage();
        newContract.transferOwnership(msg.sender);
        existingStorage[msg.sender] = newContract;
    }

    function () 
        payable
    {
        // you may send a thank you here if the lib is useful for you :)
        creator.transfer(msg.value);
    }
}
