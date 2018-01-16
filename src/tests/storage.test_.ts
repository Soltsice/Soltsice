
import { W3, getStorage } from '../';
import { DummyContract } from '../contracts';
// import { Storage } from '../contracts';

let w3 = new W3(new W3.providers.HttpProvider('http://localhost:8544'));
let activeAccount = '0xc08d5fe987c2338d28fd020b771a423b68e665e4';
w3.defaultAccount = activeAccount;
let deployParams = W3.TC.txParamsDefaultDeploy(activeAccount);
let sendParams = W3.TC.txParamsDefaultSend(activeAccount);

beforeAll(async () => {
    await w3.unlockAccount(activeAccount, 'Ropsten1', 150000);
});

beforeEach(async () => {
    // Ropsten is SLOW compared to TestRPC
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 600000;
    if ((await w3.networkId) === '1') {
        console.log('Working on mainnet');
    }
    expect((await w3.networkId)).not.toBe('1');
});

it('Storage: Could get storage for account', async () => {
    let store = await getStorage(w3, activeAccount);
    // console.log('STORAGE: ', storage);
    let key = W3.EthUtils.bufferToHex(W3.EthUtils.sha3('record'));
    console.log('KEY: ', key);
    let tx = await store.setStringValue(key, 'record value', sendParams);
    console.log('TX: ', tx);
    let stored = await store.getStringValue(key, sendParams);
    console.log('STORED: ', stored);
    expect(stored).toBe('record value');
});

it('Storage: Could get contract hash', async () => {
    let store = await getStorage(w3, activeAccount);
    let hash = DummyContract.BytecodeHash;
    // console.log('HASH: ', hash);
    let manualHash = W3.sha3(JSON.stringify(DummyContract.Artifacts.bytecode));
    expect(manualHash).toBe(hash);

    // pattern to store addresses of a contract and reuse them if bytecode is not changed
    // note that ctor params require unique hash work
    let ctorParams = { _secret: 123, _wellKnown: 42 };
    let contractHash = W3.sha3(hash! + JSON.stringify(ctorParams));

    let dummy: DummyContract;
    let address = await store.getAddressValue(contractHash);
    console.log('STORED ADDRESS', address);
    if (address === W3.zeroAddress) {
        dummy = await DummyContract.New(deployParams, ctorParams, w3);
        await dummy.instance;
        address = await dummy.address;
        await store.setAddressValue(contractHash, address);
    } else {
        dummy = await DummyContract.At(address,w3);
        dummy.getPublic();
    }
    // expect(await dummy.address).toBe(address);
    console.log('ADDR', address);
});
