pragma solidity ^0.4.15;

import 'zeppelin-solidity/contracts/ownership/Ownable.sol';

contract SortedList is Ownable {

    struct Item {
        uint8 value;
        address next;
    }
    address first;
    mapping (address => Item) private llist; 

    function SortedList() {
        uint256 x = 123;
        llist[address(this)] = Item({value: x, next: msg.sender});
    }

    function iterate() onlyOwner returns (uint256) {
        uint256 sum = 0;
        for (uint256 i = 0; i < 1000; i++) {
            sum = sum + llist[address(this)].value;
        }
        return sum;
    }

    
}