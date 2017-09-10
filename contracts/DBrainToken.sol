pragma solidity ^0.4.15;

import 'zeppelin-solidity/contracts/token/MintableToken.sol';
import 'zeppelin-solidity/contracts/lifecycle/Pausable.sol';

// import 'zeppelin-solidity/contracts/token/BasicToken.sol';
// import 'zeppelin-solidity/contracts/token/ERC20.sol';
// import 'zeppelin-solidity/contracts/token/StandardToken.sol';
// import 'zeppelin-solidity/contracts/ownership/Ownable.sol';
// import 'zeppelin-solidity/contracts/math/SafeMath.sol';
// import 'zeppelin-solidity/contracts/token/ERC20Basic.sol';

contract DBrainToken is MintableToken, Pausable {

  function transfer(address _to, uint256 _value) whenNotPaused returns (bool) {
    return super.transfer(_to, _value);
  }

  function transferFrom(address _from, address _to, uint256 _value) whenNotPaused returns (bool) {
    return super.transferFrom(_from, _to, _value);
  }
}