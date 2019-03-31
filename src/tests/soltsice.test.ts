import { W3, testAddresses, testPrivateKeys, toBN } from '../';
import { DummyContract } from '../contracts';
import * as ganache from 'ganache-cli';

let privateKey = '0x' + testPrivateKeys[0]; // '0x1ce01934dbcd6fd84e68faca8c6aebca346162823d20f0562135fe3e4f275bce';

let w3: W3 = new W3(
  //'HTTP://127.0.0.1:7545'
  ganache.provider({
    mnemonic: 'soltsice',
    network_id: 314,
    verbose: true,
    keepAliveTimeout: 100000
  })
);

beforeEach(async () => {
  jasmine.DEFAULT_TIMEOUT_INTERVAL = 600000;
  if (+(await w3.networkId) === 1) {
    console.log('Working on mainnet');
  }
  expect(+(await w3.networkId)).not.toBe(1);
});



w3.defaultAccount = testAddresses[0];
W3.default = w3;

// beforeEach(async () => {
//   expect(await w3.isTestRPC).toBe(true);
// });

let address: string;

describe('DummyContract tests', () => {
  it('Could get NewData for DummyContract and deploy via SendRaw', async function() {
    let originalValue = 789;
    console.log('XXXXX');
    let data = DummyContract.newData(
      { _secret: toBN(originalValue), _wellKnown: toBN(originalValue), _array: [1, 2, 3, 1, 1, 1, 1, 1, 1, 1] },
      w3
    );
    console.log('RAW NEW DATA', data);
    let txHash = await w3.sendSignedTransaction(
      W3.zeroAddress,
      privateKey,
      data,
      W3.TX.txParamsDefaultDeploy(testAddresses[0])
    );
    console.log('RAW TX HASH', txHash);
    let txReceipt = await w3.waitTransactionReceipt(txHash);
    console.log('RAW TX RECEIPT', txReceipt);
    let rawAddress = txReceipt.contractAddress!;
    console.log('RAW DEPLOYMENT ADDRESS', rawAddress);
    try {
      let dc = await DummyContract.at(rawAddress);
    } catch (err) {
      console.log(err);
    }
    // let publicValue = await dc.getPublic();
    // expect(publicValue.toNumber()).toEqual(originalValue);
  });

  it('Could deploy DummyContract with private key', async function() {
    let originalValue = 789;
    let txParams = W3.TX.txParamsDefaultDeploy(testAddresses[0]);
    let dc = await DummyContract.new(
      txParams,
      { _secret: toBN(originalValue), _wellKnown: toBN(originalValue), _array: [1, 2, 3, 1, 1, 1, 1, 1, 1, 1] },
      w3,
      undefined,
      privateKey
    );
    let publicValue = await dc.getPublic();
    expect(publicValue.toNumber()).toEqual(originalValue);

    let newValue = 147258;
    let tx = await dc.setPublic(newValue, txParams, privateKey);
    console.log('RAW SIGNED TX SHORTCUT', tx);

    publicValue = await dc.getPublic();
    expect(publicValue.toNumber()).toEqual(newValue);
  });

  it('Could deploy DummyContract', async function() {
    let dummy = await DummyContract.new(W3.TX.txParamsDefaultDeploy(testAddresses[0]), {
      _secret: toBN(123) as any,
      _wellKnown: toBN(456),
      _array: [1, 2, 3, 1, 1, 1, 1, 1, 1, 1]
    });
    await dummy.instance;
    address = await dummy.address;
    console.log('ADDRESS' + address);
  });

  it('should have initial private value from deployer', async function() {
    expect(W3.isValidAddress(address)).toBe(true);

    let dummy = await DummyContract.at(address);

    await dummy.instance;

    console.log('ADDRESS: ', dummy.address);
    let pr = await dummy.getPrivate();

    expect(pr).toEqual(toBN(123));

    let response = await dummy.setPrivate(toBN(123456));
    console.log('REPONSE: ', response);
    console.log('LOGS: ', response.logs);
    console.log('ARGS: ', response.logs[0].args);

    pr = await dummy.getPrivate();
    expect(pr).toEqual(toBN(123456));

    // this is how to get data for multisig submitTransaction
    // https://github.com/trufflesuite/truffle-contract/issues/10
    let data = (await dummy.instance).setPrivate.request(toBN(255));
    console.log('DATA: ', data);

    // and in strongly-typed way:
    let data2 = await dummy.setPrivate.data(toBN(255));
    console.log('DATA2: ', data2);
    expect(data.params[0].data).toEqual(data2);

    pr = await dummy.getPrivate();
    expect(pr).toEqual(toBN(123456));
  });

  it('should have initial public value from deployer', async function() {
    let dummy = await DummyContract.at(address);
    let value = await dummy.getPublic();
    expect(value).toEqual(toBN(456));
  });

  // TODO this test randomly fails on TestRPC
  xit('Could send transaction and parse logs', async function() {
    console.log(address);
    let dummy = await DummyContract.new(W3.TX.txParamsDefaultDeploy(testAddresses[0]), {
      _secret: toBN(123),
      _wellKnown: toBN(456),
      _array: [1, 2, 3]
    });

    await dummy.instance;

    let filter = await dummy.newFilter(0);
    console.log('FILTER: ', filter);

    let count = 2;
    let txResult = await dummy.setPublic(42);
    for (var i = 0; i < count; i++) {
      txResult = await dummy.setPrivate(42 + i);
    }

    let parsedResult = await dummy.waitTransactionReceipt(txResult.tx);
    console.log('PARSED TX: ', parsedResult.receipt);
    // NB Soltsice add additoinal fields during parseLogs: union of Logs and EventLogs
    // expect(parsedResult).toEqual(txResult);

    // this gets logs only after filter was set
    let logs = await dummy.getFilterChanges(filter);
    console.log('LOGS: ', logs.length, logs);
    expect(logs.length).toBe(count + 1);
    expect(logs[count].args.newValue).toEqual(toBN(42 + count - 1));

    // txResult = await dummy.setPublic(42 + 10);
    // logs = await dummy.getFilterChanges(filter);
    // expect(logs.length).toBe(1);
    // expect(logs[0].args.newValue).toEqual(toBN(42 + 10));

    // let uninstalled = await dummy.uninstallFilter(filter);
    // expect(uninstalled).toBe(true);

    // this gets all logs from the given block
    // let allLogs = await dummy.getLogs(0);
    // console.log('LOGS: ', allLogs.length, allLogs);
    // expect(allLogs.length).toBe(count + 2);
  });
});
