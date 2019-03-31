pragma solidity ^0.5.2;

import 'openzeppelin-solidity/contracts/ownership/Ownable.sol';

/** Schemaless storage */
contract Storage is Ownable {

    mapping(bytes32 => uint) UIntStorage;

    function getUIntValue(bytes32 record) 
        public
        view
        returns (uint)  {
        return UIntStorage[record];
    }

    function setUIntValue(bytes32 record, uint value) 
        public 
        onlyOwner
    {
        UIntStorage[record] = value;
    }

    mapping(bytes32 => string) StringStorage;

    function getStringValue(bytes32 record) 
        public
        view
        returns (string memory) {
        return StringStorage[record];
    }

    function setStringValue(bytes32 record, string memory value)
        onlyOwner
        public
    {
        StringStorage[record] = value;
    }

    mapping(bytes32 => address) AddressStorage;

    function getAddressValue(bytes32 record) 
        public view
        returns (address) 
    {
        return AddressStorage[record];
    }

    function setAddressValue(bytes32 record, address value)
        onlyOwner
        public
    {
        AddressStorage[record] = value;
    }

    mapping(bytes32 => bytes) BytesStorage;

    function getBytesValue(bytes32 record) 
        public view returns (bytes memory) 
    {
        return BytesStorage[record];
    }

    function setBytesValue(bytes32 record, bytes memory value)
        public
        onlyOwner
    {
        BytesStorage[record] = value;
    }

    mapping(bytes32 => bool) BooleanStorage;

    function getBooleanValue(bytes32 record) 
        public view
        returns (bool) 
    {
        return BooleanStorage[record];
    }

    function setBooleanValue(bytes32 record, bool value)
        onlyOwner
        public
    {
        BooleanStorage[record] = value;
    }
    
    mapping(bytes32 => int) IntStorage;

    function getIntValue(bytes32 record) 
        public view 
    returns (int) {
        return IntStorage[record];
    }

    function setIntValue(bytes32 record, int value)
        public
        onlyOwner
    {
        IntStorage[record] = value;
    }

}


contract StorageFactory {
    address private creator;
    mapping(address => address) public existingStorage;

    constructor() public {
        creator = msg.sender;
    }

    function produce() 
        external
    {
        // protect from 'I accidentally killed it' overwrite
        require(existingStorage[msg.sender] == address(0));
        Storage newContract = new Storage();
        newContract.transferOwnership(msg.sender);
        existingStorage[msg.sender] = address(newContract);
    }

    function () 
        external
        payable
    {
        address payable paddr = address(uint160(creator));
        paddr.transfer(msg.value);
    }
}
