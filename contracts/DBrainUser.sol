pragma solidity ^0.4.15;

import 'zeppelin-solidity/contracts/ownership/Ownable.sol';

contract DBrainUser is Ownable {
    
    uint reputation;
    bytes32 profileHash;

    function DBrainUser(
        address _owner
    )
    Ownable() 
    {
        owner = _owner;
    }

}