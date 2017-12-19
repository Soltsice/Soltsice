import { W3 } from '../';
import { BigNumber } from 'bignumber.js';

describe('W3 tests', () => {

    it('Could convert to hex', async function () {
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

});
