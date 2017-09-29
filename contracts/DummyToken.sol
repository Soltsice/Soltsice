pragma solidity ^0.4.15;

import '../node_modules/zeppelin-solidity/contracts/token/MintableToken.sol';
import '../node_modules/zeppelin-solidity/contracts/lifecycle/Pausable.sol';

contract DummyToken is MintableToken, Pausable {

    // Constants
    // =========
    string public constant name = "Dummy Token";
    string public constant symbol = "DBN";
    uint256 public constant decimals = 18;

    uint256 constant INITIAL_SUPPLY = 1400000 * 1e18; // 1.4M tokens, 18 decimals


    // State variables
    // ===============

    address public multisig;

    // 
    bool public paused = true;

    // Events
    // ==================

    // Constructor
    // ============

    function DummyToken(address _multisig) {
        multisig = _multisig;
        totalSupply = INITIAL_SUPPLY;
        balances[msg.sender] = INITIAL_SUPPLY; // TODO temp, set pool to owner, later will move this logic to crowdsale
    }

    function transfer(address _to, uint256 _value) whenNotPaused returns (bool) {
        return super.transfer(_to, _value);
    }

    function transferFrom(address _from, address _to, uint256 _value) whenNotPaused returns (bool) {
        return super.transferFrom(_from, _to, _value);
    }


}