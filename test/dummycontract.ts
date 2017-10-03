import './init';
import { DummyContract } from '../src/contracts';
import { BigNumber } from 'bignumber.js';

var dummyContract = artifacts.require('./DummyContract.sol');

contract('DummyContract', function (accounts) {
    it('should have initial private value from deployer', async function () {

        let instance = await dummyContract.deployed();

        // typed contract could be initiated with an instance supplied by Truffle
        let dummy = new DummyContract(instance);

        console.log(dummy);

        console.log('ADDRESS: ', dummy.address);
        let pr = await dummy.getPrivate();

        assert.equal(pr, 123, '123 wasn\'t in the private value');

        let response = await dummy.setPrivate(new BigNumber(123456));
        console.log('REPONSE: ', response);
        console.log('LOGS: ', response.receipt.logs);
        console.log('ARGS: ', response.logs[0].args);

        pr = await dummy.getPrivate();
        assert.equal(pr, 123456, '123456 wasn\'t in the private value');

        // this is how to get data for multisig submitTransaction
        // https://github.com/trufflesuite/truffle-contract/issues/10
        let data = (await dummy.instance).setPrivate.request(new BigNumber(255));
        console.log('DATA: ', data);

        // and in strongly-typed way:
        let data2 = await dummy.setPrivate.data(new BigNumber(255));
        console.log('DATA2: ', data2);
        assert.equal(data.params[0].data, data2, 'Data from Soltsice should be the same as from untyped call');

        pr = await dummy.getPrivate();
        assert.equal(pr, 123456, '123456 wasn\'t in the private value');

    });

    it('should have initial public value from deployer', async function () {
        let dummy = new DummyContract(await dummyContract.deployed());
        let value = await dummy.getPublic();
        assert.equal(value, 456, '456 wasn\'t in the public value');
    });
});
