import { W3, testAccounts, testPrivateKeys, toBN } from '../';
import { DummyToken, DummyContract } from '../contracts';
import * as ganache from 'ganache-cli';

let privateKey = '0x' + testPrivateKeys[0]; // '0x1ce01934dbcd6fd84e68faca8c6aebca346162823d20f0562135fe3e4f275bce';

let w3: W3 = new W3(ganache.provider({
    network_id: 314,
    accounts: [
        { balance: '0xD3C21BCECCEDA1000000', secretKey: privateKey }
    ]
}));

// let w3 = new W3(ganache.provider({
//     mnemonic: 'dbrainio',
//     network_id: 314
// }));

w3.defaultAccount = testAccounts[0];
W3.Default = w3;

beforeEach(async () => {
    expect(await w3.isTestRPC).toBe(true);
});

describe('DummyToken tests', () => {

    it('DummyToken total supply should be 1400000 * 1e18', async function () {
        var token = await DummyToken.New(
            W3.TX.txParamsDefaultDeploy(testAccounts[0]), { _multisig: testAccounts[0] }
        );
        let value = await token.totalSupply();
        expect(value).toEqual(w3.toBigNumber(1400000 * 1e18));
        let deployed = await DummyToken.At(await token.address);
        value = await deployed.totalSupply();
        expect(value).toEqual(w3.toBigNumber(1400000 * 1e18));
    });

});

let address: string;

describe('DummyContract tests', () => {

    it('Could get NewData for DummyContract and deploy via SendRaw', async function () {
        let originalValue = 789;
        let data = DummyContract.NewData(
            { _secret: toBN(originalValue), _wellKnown: toBN(originalValue) },
            w3
        );
        console.log('RAW NEW DATA', data);
        let txHash = await w3.sendSignedTransaction(W3.zeroAddress, privateKey, data, W3.TX.txParamsDefaultDeploy(testAccounts[0]));
        console.log('RAW TX HASH', txHash);
        let txReceipt = await w3.waitTransactionReceipt(txHash);
        console.log('RAW TX RECEIPT', txReceipt);
        let rawAddress = txReceipt.contractAddress;
        console.log('RAW DEPLOYMENT ADDRESS', rawAddress);
        let dc = await DummyContract.At(rawAddress);
        let publicValue = await dc.getPublic();
        expect(publicValue.toNumber()).toEqual(originalValue);
    });

    it('Could deploy DummyContract with private key', async function () {
        let originalValue = 789;
        let dc = await DummyContract.New(W3.TX.txParamsDefaultDeploy(testAccounts[0]),
            { _secret: toBN(originalValue), _wellKnown: toBN(originalValue) },
            w3,
            undefined,
            privateKey
        );
        let publicValue = await dc.getPublic();
        expect(publicValue.toNumber()).toEqual(originalValue);
    });

    it('Could deploy DummyContract', async function () {
        let dummy = await DummyContract.New(
            W3.TX.txParamsDefaultDeploy(testAccounts[0]),
            { _secret: toBN(123), _wellKnown: toBN(456) }
        );
        await dummy.instance;
        address = await dummy.address;
    });

    it('should have initial private value from deployer', async function () {

        expect(W3.isValidAddress(address)).toBe(true);

        let dummy = await DummyContract.At(address);

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

    it('should have initial public value from deployer', async function () {
        let dummy = await DummyContract.At(address);
        let value = await dummy.getPublic();
        expect(value).toEqual(toBN(456));
    });

    // TODO this test randomly fails on TestRPC
    xit('Could send transaction and parse logs', async function () {
        console.log(address);
        let dummy = await DummyContract.New(
            W3.TX.txParamsDefaultDeploy(testAccounts[0]),
            { _secret: toBN(123), _wellKnown: toBN(456) }
        );

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
        expect(parsedResult).toEqual(txResult);

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
