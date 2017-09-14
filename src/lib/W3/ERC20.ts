import { BigNumber } from 'bignumber.js';

export type address = string;

/** ERC20 token interface */
export interface ERC20 {

    /** Get the total token supply */
    totalSupply(): Promise<BigNumber>;

    /** Get the account balance of another account with address _owner */
    balanceOf(owner: address): Promise<BigNumber>;

    /** Send value amount of tokens to address _to */
    transfer(to: address, value: number | BigNumber): Promise<boolean>;

    /** Triggered when tokens are transferred. */
    OnTransfer(handler: { (from: address, to: address, value: BigNumber): void });

    /**
     * Send _value amount of tokens from address _from to address _to
     *
     * The transferFrom method is used for a withdraw workflow, allowing contracts
     *  to send tokens on your behalf, for example to "deposit" to a contract address
     * and/or to charge fees in sub-currencies; the command should fail unless the
     * _from account has deliberately authorized the sender of the message via some mechanism
     */
    transferFrom(from: address, to: address, value: BigNumber): Promise<boolean>;

    /**
     * Allow _spender to withdraw from your account, multiple times, up to the _value amount.
     * If this function is called again it overwrites the current allowance with _value.
     */
    approve(spender: address, value: number | BigNumber): Promise<boolean>;

    /** Returns the amount which _spender is still allowed to withdraw from _owner */
    allowance(owner: address, spender: address): Promise<BigNumber>;

    /** Triggered whenever approve(address _spender, uint256 _value) is called. */
    OnApproval(handler: {(owner: address, spender: address, value: BigNumber): void});
}