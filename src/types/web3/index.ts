import * as W3 from './index.d';

export module Web3Factory {
    export function GetWeb3(): W3.Web3 {
        if (typeof web3 !== 'undefined' && typeof web3.currentProvider !== 'undefined') {
            web3 = new Web3(web3.currentProvider);
        } else {
            var web3: W3.Web3 = require('web3');
            // set the provider you want from Web3.providers
            web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
        }
        return web3;
    }
}