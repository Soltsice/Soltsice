pragma solidity ^0.4.15;

import 'zeppelin-solidity/contracts/ownership/Ownable.sol';

contract DummyContract is Ownable { 

    uint private constant SECRET_CONST = 123;
    uint private secret;
    uint public wellKnown;

    function DummyContract(uint _secret, uint _wellKnown) public {
        secret = _secret;
        wellKnown = _wellKnown;
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

}
