
import { W3 } from './W3';
import { Storage, StorageFactory } from './contracts';
import { ropstenStorageFactory, rinkebyStorageFactory, mainnetStorageFactory } from './constants';

/**
 * Get storage contract on active network for account.
 * @param w3 W3 instance.
 * @param accountAddress Storage owner address.
 * @param createOnMainNet If on Mainnet this parameter must be true to create a new storage contract (will cost deployment gas).
 * @param privateKey When provided, transactions will be signed and sent via sendRawTransaction.
 */
export async function getStorage(w3: W3, accountAddress: string, createOnMainNet?: boolean, privateKey?: string): Promise<Storage> {
    let cached = w3[accountAddress] as Storage;
    if (cached) {
        return cached;
    }

    let nid = await w3.networkId;
    let txDeploy = W3.TX.txParamsDefaultDeploy(accountAddress, 900000, 1000000000);
    let storageFactory: StorageFactory;
    if (await w3.isTestRPC) {
        storageFactory = await StorageFactory.new(txDeploy, undefined, w3, undefined, privateKey);
    } else if (nid === '3') {
        storageFactory = await StorageFactory.at(ropstenStorageFactory, w3);
    } else if (nid === '4') {
        storageFactory = await StorageFactory.at(rinkebyStorageFactory, w3);
    } else if (nid === '1') {
        storageFactory = await StorageFactory.at(mainnetStorageFactory, w3);
    } else {
        throw new Error(`Storage on network id ${nid} is not supported.`);
    }

    let storageAddress = await storageFactory.existingStorage(accountAddress);
    if (storageAddress === W3.zeroAddress) {
        // create a new one
        if (nid === '1' && !createOnMainNet) {
            throw new Error(`Please explicitly provide constructor parameter createOnMainNet = true to create a new storage on mainnet.`);
        }
        await storageFactory.produce(txDeploy);
        storageAddress = await storageFactory.existingStorage(accountAddress);
        if (storageAddress === W3.zeroAddress) {
            throw new Error(`Cannot create new storage for ${accountAddress}`);
        }
    }
    let s = await Storage.at(storageAddress, w3);
    w3[accountAddress] = s;
    return s;
}
