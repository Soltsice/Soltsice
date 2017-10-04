import { W3, testAccounts, toBN } from '../';
import { DummyToken, DummyContract } from '../contracts';
// will resolve to localhost:8545 unless window['web3'] is set
let w3 = new W3();
W3.Default = w3;

beforeEach(async () => {
    expect(await w3.isTestRPC).toBe(true);
});

describe('DummyToken tests', () => {

    it('DummyToken total supply should be 1400000 * 1e18', async function () {
        var token = new DummyToken(
            W3.TC.txParamsDefaultDeploy(testAccounts[0]), { _multisig: testAccounts[0] }
        );
        let value = await token.totalSupply();
        expect(value).toEqual(w3.toBigNumber(1400000 * 1e18));
        let deployed = new DummyToken(await token.address);
        value = await deployed.totalSupply();
        expect(value).toEqual(w3.toBigNumber(1400000 * 1e18));
    });

});

let address: string;

describe('DummyContract tests', () => {

    it('Could deploy DummyContract', async function () {
        let dummy = new DummyContract(
            W3.TC.txParamsDefaultDeploy(testAccounts[0]),
            { _secret: toBN(123), _wellKnown: toBN(456) }
        );
        await dummy.instance;
        address = await dummy.address;
    });

    it('should have initial private value from deployer', async function () {

        expect(W3.isValidAddress(address)).toBe(true);

        let dummy = new DummyContract(address);

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
        let dummy = new DummyContract(address);
        let value = await dummy.getPublic();
        expect(value).toEqual(toBN(456));
    });

    it('Could send transaction and parse logs', async function () {
        console.log(address);
        let dummy = new DummyContract(
            W3.TC.txParamsDefaultDeploy(testAccounts[0]),
            { _secret: toBN(123), _wellKnown: toBN(456) }
        );
        // let value = await dummy.getPublic();

        let txResult = await dummy.setPublic(42);
        // console.log('TX: ', txResult.receipt);

        // let logs = txResult.logs;
        // console.log('TRUFFLE LOGS: ', logs);

        // let rawLogs = await dummy.parseLogs(txResult.receipt);
        // console.log('RAW LOGS: ', rawLogs);

        let parsedResult = await dummy.getTransactionResult(txResult.tx);
        // console.log('PARSED TX: ', parsedResult.receipt);
        expect(parsedResult).toEqual(txResult);
    });

});
