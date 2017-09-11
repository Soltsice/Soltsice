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

    event SecretSet(uint newValue);
    event PublicSet(uint newValue);

    function getPrivate() onlyOwner constant returns (uint) {
        return secret;
    }

    function setPrivate(uint _newValue) onlyOwner {
        secret = _newValue;
        SecretSet(_newValue);
    }

    function getPublic() onlyOwner constant returns (uint) {
        return wellKnown;
    }

    function setPublic(uint _newValue) onlyOwner {
        wellKnown = _newValue;
        PublicSet(_newValue);
    }

}