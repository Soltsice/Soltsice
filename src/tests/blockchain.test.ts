import { W3, TestRPC } from '../';
import * as ganache from 'ganache-cli';
import { testAddresses } from '../constants';

let w3 = new W3(
  ganache.provider({
    mnemonic: 'soltsice',
    network_id: 314
  })
);
W3.default = w3;

// test network
let tn = new TestRPC(w3);

it('Should have accounts during test', async () => {
  if ((await w3.networkId) !== '1') {
    let accounts = await w3.accounts;
    expect(accounts.length).toBeGreaterThan(0);
    expect((accounts[0] as string).toLowerCase()).toEqual(testAddresses[0]);
  }
});

it('TestRPC: Could increase time', async () => {
  if (await w3.isTestRPC) {
    let result = await tn.increaseTime(2000);
    console.log('INCREASED TIME BY ', result);
  }
});

it('TestRPC: Could get latest time and block, could advance time and block', async () => {
  const isTest = await w3.isTestRPC;
  expect(isTest).toBe(true);

  let snapshot = await tn.snapshot();
  console.log('SNAPSHOT: ', snapshot);
  tn.mine();

  // await tn.revert(1);

  let lt = await w3.latestTime;

  console.log('LATEST TIME: ', new Date(lt * 1000));
  console.log('NOW: ', new Date(Date.now()));
  expect(lt).toBeLessThanOrEqual(Date.now());

  let block = await w3.blockNumber;
  console.log('BLOCK: ', block);

  await tn.advanceToBlock(block + 2);

  let block2 = await w3.blockNumber;

  expect(block2).toBe(block + 2);

  await tn.revert(snapshot);

  let block3 = await w3.blockNumber;
  expect(block3).toBeLessThan(block);
});
