import { W3, testAddresses, toBN } from '../';
import { DummyContract } from '../contracts';
import { BigNumber } from 'bignumber.js';
import * as ganache from 'ganache-cli';

let privateKey = '0x3c66198bb60b1d2c95b4e37d4a9d414234c0d9a44d1f394617b48d25c6fceccd';

let w3: W3 = new W3(ganache.provider({
    network_id: 314,
    accounts: [
        { balance: '0xD3C21BCECCEDA1000000', secretKey: privateKey }
    ]
}));

w3.defaultAccount = testAddresses[0];
W3.default = w3;

let dummyAddress: string;

describe('W3 tests', () => {

    it('Could convert to hex', async function () {
        let hex = W3.toHex('0xABC123');
        expect(hex).toEqual('0xABC123'.toLowerCase());
        console.log('0xABC123 hex', hex, true);
        let hexString = W3.toHex('Soltsice', false);
        console.log('Soltsice hex', hexString);
        let hexBN = W3.toHex(new BigNumber(1234567), true, 64);
        console.log('BigNumber(1234567) hex', hexBN);
        let hexNumber = W3.toHex(1234567, true);
        console.log('1234567 hex', hexNumber);
        let hexGasPrice = W3.toHex(20000000000);
        console.log('20 Gwei hex', hexGasPrice);
        let recoveredGasPrice = new BigNumber(hexGasPrice);
        expect(recoveredGasPrice).toEqual(new BigNumber(20000000000));
    });

    it('Should return tx number', async function () {
        let nonce = await w3.getTransactionCount();
        expect(nonce).toBe(0);

        let dummy = await DummyContract.new(
            W3.TX.txParamsDefaultDeploy(testAddresses[0]),
            { _secret: toBN(123), _wellKnown: toBN(456), _array: [1, 2, 3] }
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

        let dummy = await DummyContract.at(dummyAddress);

        let txParams = W3.TX.txParamsDefaultSend(w3.defaultAccount);

        let txHash = await w3.sendSignedTransaction(dummy.address, privateKey, await dummy.setPublic.data(newPublic), txParams, nonce);

        console.log('TX HASH', txHash);

        let tx1 = await dummy.waitTransactionReceipt(txHash);
        console.log('TX FROM CONTRACT', tx1);

        let tx2 = await w3.waitTransactionReceipt(txHash);
        console.log('TX FROM w3', tx2);

        let newPublic1 = (await dummy.getPublic()).toNumber();

        expect(newPublic1).toEqual(newPublic);

        let newPublic2 = 789123;

        txHash = await dummy.setPublic.sendTransaction.sendSigned(newPublic2, privateKey, txParams);

        let tx3 = await dummy.waitTransactionReceipt(txHash);
        console.log('TX FROM CONTRACT', tx3);

        let newPublic3 = (await dummy.getPublic()).toNumber();

        expect(newPublic3).toEqual(newPublic2);

        let nonce2 = await w3.getTransactionCount();

        expect(nonce2).toBe(nonce + 2);

    });
});
