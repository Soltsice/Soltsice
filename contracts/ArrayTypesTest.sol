pragma solidity ^0.4.18;

contract ArrayTypesTest {
    uint[10] public array;
  
    function ArrayTypesTest(uint[10] _array) public {
        array = _array;
    }

    function funcArrayInArguments(address[] _array) pure external returns (address[] retArray) {
        return _array;
    }
}