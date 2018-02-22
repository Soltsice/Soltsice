pragma solidity ^0.4.18;

import 'zeppelin-solidity/contracts/ownership/Ownable.sol';

contract DummyContract is Ownable { 

    uint private constant SECRET_CONST = 123;
    uint private secret;
    uint public wellKnown;

    function DummyContract(uint _secret, uint _wellKnown, uint[10] _array) 
        public 
    {
        secret = _secret;
        wellKnown = _wellKnown;
        array = _array;
    }

    event SecretSet(uint newValue, address indexed  contractAddress, address indexed sender);
    event PublicSet(uint indexed newValue, address indexed  contractAddress, address indexed sender);


    function getPrivate() onlyOwner constant returns (uint) {
        return secret;
    }

    function setPrivate(uint _newValue) onlyOwner {
        secret = _newValue;
        SecretSet(_newValue, this, msg.sender);
    }

    function getPublic() onlyOwner constant returns (uint) {
        return wellKnown;
    }

    function setPublic(uint _newValue) onlyOwner {
        wellKnown = _newValue;
        PublicSet(_newValue, this, msg.sender);
    }

    // Array tests

    uint[10] public array;
    function ArrayTypesTest(uint[10] _array) public {
        array = _array;
    }

    function funcArrayInArguments(address[] _array) pure external returns (address[] retArray) {
        return _array;
    }

    function funcArrayInArguments(address[] _array, address[] _array2) pure external returns (address[] retArray) {
        return _array;
    }

}
