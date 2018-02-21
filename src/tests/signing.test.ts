import { W3 } from '../';
import { soltsice } from '../';
import * as fs from 'fs';
import * as path from 'path';

describe('Signing tests', () => {

    it('Could generate new account and sign/recover message', async function () {
        let keythereum = W3.getKeythereum();
        console.log('DEFAULTS: ', keythereum.constants);
        let acc = keythereum.create();
        console.log(acc);
        let isValid = W3.EthUtils.isValidPrivate(acc.privateKey);
        let publicKey = W3.EthUtils.privateToPublic(acc.privateKey);
        let addrBuffer = W3.EthUtils.privateToAddress(acc.privateKey);
        let addr = W3.EthUtils.bufferToHex(addrBuffer);

        console.log('VALID: ', isValid);
        console.log('PRIVATE: ', W3.EthUtils.bufferToHex(acc.privateKey));
        console.log('PUBLIC: ', W3.EthUtils.bufferToHex(publicKey));
        console.log('ADDRESS: ', addr);

        // var keyObject = keythereum.dump('password', acc.privateKey, acc.salt, acc.iv);
        // console.log('KEY OBJECT', keyObject);

        console.time('sign/recover');

        for (var i = 0; i < 1; i++) {
            let message = 'my message' + 0;

            // 5700 per second without recover
            let signature = W3.sign(message, W3.EthUtils.bufferToHex(acc.privateKey));
            // console.log('SIGNATURE: ', signature);

            // 4400 per second without sign
            let recovered = W3.ecrecover(message, signature);
            console.log('ADDR: ', addrBuffer);
            console.log('RECOVERED: ', recovered);
            expect(addr).toBe(recovered);
        }
        // c.2k per second seign/recover/check
        console.timeEnd('sign/recover');
    });

    it('Could getLocalPrivateKeyAndAddress', async function () {

        let filepath = path.join(__dirname, 'dummy.key');
        if (fs.existsSync(filepath)) {
            fs.unlinkSync(filepath);
        }

        // idempotent call, must remain constant after initial creation
        let pkAddress = soltsice.getLocalPrivateKeyAndAddress(filepath, 'DummyP@55');
        let pkAddress2 = soltsice.getLocalPrivateKeyAndAddress(filepath, 'DummyP@55');

        expect(pkAddress.privateKey).toEqual(pkAddress2.privateKey);
        expect(pkAddress.publicKey).toEqual(pkAddress2.publicKey);
        expect(pkAddress.address).toEqual(pkAddress2.address);

        expect(fs.existsSync(filepath)).toBe(true);
        fs.unlinkSync(filepath);
    });
});
