import { W3 } from './W3';

export class TestRPC {
  private w3: W3;
  /**
   *
   */
  constructor(w3?: W3) {
    this.w3 = w3 || new W3();
  }

  /**
   * Snapshot the state of the blockchain at the current block. Takes no parameters.
   * Returns the integer id of the snapshot created.
   */
  public async snapshot(): Promise<string> {
    if (!(await this.w3.isTestRPC)) {
      throw 'Not on TestRPC';
    }
    const id = 'W3:' + W3.getNextCounter();
    return this.w3
      .sendRPC({
        jsonrpc: '2.0',
        method: 'evm_snapshot',
        params: [],
        id: id
      })
      .then(r => {
        console.log('RPC RESPONSE: ', r);
        return <string>r.result;
      });
  }

  /**
   * Revert the state of the blockchain to a previous snapshot.
   * Takes a single parameter, which is the snapshot id to revert to.
   * If no snapshot id is passed it will revert to the latest snapshot. Returns true.
   */
  public async revert(snapshotId?: string): Promise<boolean> {
    if (!(await this.w3.isTestRPC)) {
      throw 'Not on TestRPC';
    }
    const id = 'W3:' + W3.getNextCounter();
    return this.w3
      .sendRPC({
        jsonrpc: '2.0',
        method: 'evm_revert',
        params: snapshotId ? [snapshotId] : [],
        id: id
      })
      .then(async r => {
        return true;
      });
  }

  /**
   * Jump forward in time. Takes one parameter, which is the amount of time to increase in seconds.
   * Returns the total time adjustment, in seconds.
   */
  public async increaseTime(seconds: number): Promise<number> {
    if (!(await this.w3.isTestRPC)) {
      throw 'Not on TestRPC';
    }
    const id = 'W3:' + W3.getNextCounter();
    return this.w3
      .sendRPC({
        jsonrpc: '2.0',
        method: 'evm_increaseTime',
        params: [W3.duration.seconds(seconds)],
        id: id
      })
      .then(async r => {
        await this.mine();
        return <number>r.result;
      });
  }

  /**
   * Beware that due to the need of calling two separate testrpc methods and rpc calls overhead
   * it's hard to increase time precisely to a target point so design your test to tolerate
   * small fluctuations from time to time.
   *
   * @param target time in seconds
   */
  public async increaseTimeTo(target: number): Promise<number> {
    let now = await this.w3.latestTime;
    if (target < now) {
      throw Error(`Cannot increase current time(${now}) to a moment in the past(${target})`);
    }
    let diff = target - now;
    return this.increaseTime(diff);
  }

  /**
   * Force a block to be mined. Takes no parameters. Mines a block independent of whether or not mining is started or stopped.
   */
  public async mine(): Promise<void> {
    if (!(await this.w3.isTestRPC)) {
      throw 'Not on TestRPC';
    }
    const id = 'W3:' + W3.getNextCounter();
    return this.w3
      .sendRPC({
        jsonrpc: '2.0',
        method: 'evm_mine',
        params: [],
        id: id
      })
      .then(r => {
        return;
      });
  }

  public async advanceToBlock(blockNumber: number) {
    let lastBlock = await this.w3.blockNumber;
    if (lastBlock > blockNumber) {
      throw Error(`block number ${blockNumber} is in the past (current is ${lastBlock})`);
    }
    while ((await this.w3.blockNumber) < blockNumber) {
      await this.mine();
    }
  }
}
