pragma solidity ^0.5.2;

import 'openzeppelin-solidity/contracts/ownership/Ownable.sol';

contract DummyContract is Ownable { 

    uint private constant SECRET_CONST = 123;
    uint private secret;
    uint public wellKnown;

    constructor(uint _secret, uint _wellKnown, uint[10] memory _array) 
        public 
    {
        secret = _secret;
        wellKnown = _wellKnown;
        array = _array;
    }

    event SecretSet(uint newValue, address indexed  contractAddress, address indexed sender);
    event PublicSet(uint indexed newValue, address indexed  contractAddress, address indexed sender);


    function getPrivate() 
        onlyOwner
        public view
        returns (uint) 
    {
        return secret;
    }

    function setPrivate(uint _newValue) 
        onlyOwner 
        public
    {
        secret = _newValue;
        emit SecretSet(_newValue, address(this), msg.sender);
    }

    function getPublic() 
        onlyOwner
        public view returns (uint) 
    {
        return wellKnown;
    }

    function setPublic(uint _newValue) 
        onlyOwner
        public
    {
        wellKnown = _newValue;
        emit PublicSet(_newValue, address(this), msg.sender);
    }

    // Array tests

    uint[10] public array;
    function ArrayTypesTest(uint[10] memory _array) 
        public
    {
        array = _array;
    }

    function funcArrayInArguments(address[] calldata _array) 
        pure external 
        returns (address[] memory retArray) 
    {
        return _array;
    }

    function funcArrayInArguments(address[] calldata _array, address[] calldata _array2) 
        pure external
        returns (address[] memory retArray) 
    {
        return _array;
    }

}
