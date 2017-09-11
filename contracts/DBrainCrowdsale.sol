pragma solidity ^0.4.15;

import 'zeppelin-solidity/contracts/crowdsale/FinalizableCrowdsale.sol';
import 'zeppelin-solidity/contracts/crowdsale/CappedCrowdsale.sol';
import './DBrainToken.sol';

contract DBrainCrowdsale is FinalizableCrowdsale, CappedCrowdsale {
    
    // TODO this is WIP and not reviewed, need review all parent chain details, e.g. if need to override something else
    // TODO use safe math in case of any arithmetic ops
    // TODO should be pausible by wallet (MultiSig owners)

    function DBrainCrowdsale (
        uint256 _startTime,
        uint256 _endTime,
        uint256 _rate,
        address _wallet
    )
    Crowdsale(_startTime, _endTime, _rate, _wallet)
    CappedCrowdsale(15 * 1e24) // TODO hardcap hardcoded into the contract
    {
    }

    function createTokenContract() internal returns (MintableToken) {
        return new DBrainToken(wallet);
    }
    
    // TODO here the logic to migrate pre-sale and allocate tokens to the pool
    function finalization() internal {
        doFinalizationBeforeFinishingMinting();

        // calls token.FnishMinting
        super.finalization();

        doFinalizationAfterFinishingMinting();
    }

    function doFinalizationBeforeFinishingMinting() private {
        // TODO finalization work
    }

    function doFinalizationAfterFinishingMinting() private {
        // TODO finalization work
    }
}
