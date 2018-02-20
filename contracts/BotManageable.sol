pragma solidity ^0.4.18;

import './MultiOwnable.sol';

/**
 * @dev BotManaged contract provides a modifier isBot and methods to enable/disable bots.
 */
contract BotManageable is MultiOwnable {
    uint256 constant MASK64 = 18446744073709551615;

    // NB packing saves gas even in memory due to stack size
    // struct StartEndTimeLayout {
    //     uint64 startTime;
    //     uint64 endTime;
    // }

    /**
     * Bot addresses and their start/end times (two uint64 timestamps)
     */
    mapping (address => uint128) private botsStartEndTime;

    event BotsStartEndTimeChange(address indexed _botAddress, uint64 _startTime, uint64 _endTime);

    function BotManageable 
        (address _wallet)
        public
        MultiOwnable(_wallet)
    { }

    /** Check if a caller is an active bot. */
    modifier onlyBot() {
        require (isBot(msg.sender));
        _;
    }

    /** Check if a caller is an active bot or an owner or the wallet. */
    modifier onlyBotOrOwner() {
        require (isBot(msg.sender) || isOwner(msg.sender));
        _;
    }

    /** Enable bot address. */
    function enableBot(address _botAddress)
        onlyWallet()
        public 
    {
        uint128 botLifetime = botsStartEndTime[_botAddress];
        // cannot re-enable existing bot
        require((botLifetime >> 64) == 0 && (botLifetime & MASK64) == 0);
        botLifetime |= uint128(now) << 64;
        botsStartEndTime[_botAddress] = botLifetime;
        BotsStartEndTimeChange(_botAddress, uint64(botLifetime >> 64), uint64(botLifetime & MASK64));
    }

    /** Disable bot address. */
    function disableBot(address _botAddress, uint64 _fromTimeStampSeconds)
        onlyOwner()
        public 
    {
        uint128 botLifetime = botsStartEndTime[_botAddress];
        // bot must have been enabled previously and not disabled before
        require((botLifetime >> 64) > 0 && (botLifetime & MASK64) == 0);
        botLifetime |= uint128(_fromTimeStampSeconds);
        botsStartEndTime[_botAddress] = botLifetime;
        BotsStartEndTimeChange(_botAddress, uint64(botLifetime >> 64), uint64(botLifetime & MASK64));
    }

    /** Operational contracts call this method to check if a caller is an approved bot. */
    function isBot(address _botAddress) 
        public
        constant
        returns(bool)
    {
        return isBotAt(_botAddress, uint64(now));
    }

    // truffle-contract doesn't like method overloading, use a different name

    function isBotAt(address _botAddress, uint64 _atTimeStampSeconds) 
        public
        constant 
        returns(bool)
    {
        uint128 botLifetime = botsStartEndTime[_botAddress];
        if ((botLifetime >> 64) == 0 || (botLifetime >> 64) > _atTimeStampSeconds) {
            return false;
        }
        if ((botLifetime & MASK64) == 0) {
            return true;
        }
        if (_atTimeStampSeconds < (botLifetime & MASK64)) {
            return true;
        }
        return false;
    }
}
