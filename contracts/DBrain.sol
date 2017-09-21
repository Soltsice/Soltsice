pragma solidity ^0.4.15;

/*
DBrain contract represents intellectual property on the platform:
* Data sets (could sell access)
* AI networks (could sell API calls)

The contract is owned by the address provided in the constructor, but is created by DBrain platform

*/

import 'zeppelin-solidity/contracts/ownership/Ownable.sol';


contract DBrain is Ownable {

    //////////////////////////////////////////
    // Storage
    //////////////////////////////////////////
    
    address admin;

    // Address of data set or AI network owner
    address owner;

    // workers or data providers
    mapping (address => uint) contributorIndex;
    
    address[] contributors; // TODO not needed probably

    //uint[] public 

    //////////////////////////////////////////
    // Modifiers
    //////////////////////////////////////////

    modifier onlyOwner() {
        require (msg.sender == owner);
        _;
    }

    modifier onlyAdmin() {
        require (msg.sender == admin);
        _;
    }
    
    function DBrain(address _owner) {
        admin = msg.sender;
        owner = _owner;
    }


    function approveContribution(address _contributor)
        public
        onlyAdmin // only DBrain admin could approve contribution
        returns (bool) 
    {
        // check 
    }

    // TODO should be destructible by owner
}