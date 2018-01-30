import { W3, testAccounts, DummyContract, toBN } from '../';
import { BigNumber } from 'bignumber.js';
import * as ganache from 'ganache-cli';

let privateKey = '0x1ce01934dbcd6fd84e68faca8c6aebca346162823d20f0562135fe3e4f275bce';

let w3: W3 = new W3(ganache.provider({
    network_id: 314,
    accounts: [
        { balance: '0xD3C21BCECCEDA1000000', secretKey: privateKey }
    ]
}));

w3.defaultAccount = testAccounts[0];
W3.Default = w3;

let dummyAddress: string;

describe('W3 tests', () => {

    xit('Could convert to hex', async function () {
        let hex = W3.toHex('0xABC123');
        expect(hex).toEqual('0xABC123'.toLowerCase());
        console.log('0xABC123 hex', hex, true);
        let hexString = W3.toHex('Dbrain.io', false);
        console.log('Dbrain hex', hexString);
        let hexBN = W3.toHex(new BigNumber(1234567), true, 64);
        console.log('BigNumber(1234567) hex', hexBN);
        let hexNumber = W3.toHex(1234567, true);
        console.log('1234567 hex', hexNumber);
    });

    it('Should return tx number', async function () {
        let nonce = await w3.getTransactionCount();
        expect(nonce).toBe(0);

        let dummy = await DummyContract.New(
            W3.TX.txParamsDefaultDeploy(testAccounts[0]),
            { _secret: toBN(123), _wellKnown: toBN(456) }
        );
        dummyAddress = dummy.address;
        nonce = await w3.getTransactionCount();
        expect(nonce).toBe(1);

        let tx = await dummy.setPublic(123);
        console.log('TX:', tx);
        nonce = await w3.getTransactionCount();
        expect(nonce).toBe(2);
    });

    it('Could send signed tx', async function () {

        let newPublic = 456789;

        let nonce = await w3.getTransactionCount();

        let dummy = await DummyContract.At(dummyAddress);

        let txHash = await w3.sendSignedTransaction(dummy.address, privateKey, await dummy.setPublic.data(newPublic), W3.TX.txParamsDefaultSend(w3.defaultAccount), nonce);

        console.log('TX HASH', txHash);

        let tx1 = await dummy.waitTransactionReceipt(txHash);
        console.log('TX FROM CONTRACT', tx1);

        let tx2 = await w3.waitTransactionReceipt(txHash);
        console.log('TX FROM w3', tx2);

        let newPublic1 = (await dummy.getPublic()).toNumber();

        expect(newPublic1).toEqual(newPublic);

    });
});
