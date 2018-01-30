// NB/TODO order of exports matters with CommonJS, other modules do not work with soltsice command, need to fix and use SystemJS
export * from './constants';
export * from './W3';
export * from './SoltsiceContract';
export * from './contracts';
export * from './TestRPC';
export * from './jsonrpc';

import { W3 } from './W3';
import { Storage, StorageFactory } from './contracts';
import { ropstenStorageFactory, rinkebyStorageFactory, mainnetStorageFactory } from './constants';

export let getStorage: ((w3: W3, accountAddress: string, createOnMainNet?: boolean) => Promise<Storage>) = Object.assign(
    // tslint:disable-next-line:max-line-length
    // tslint:disable-next-line:variable-name
    async (w3: W3, accountAddress: string, createOnMainNet?: boolean): Promise<Storage> => {
        let cached = w3[accountAddress] as Storage;
        if (cached) {
            return cached;
        }

        let nid = await w3.networkId;
        let txDeploy = W3.TX.txParamsDefaultDeploy(accountAddress, 900000, 1000000000);
        let storageFactory: StorageFactory;
        if (await w3.isTestRPC) {
            storageFactory = await StorageFactory.New(txDeploy, undefined, w3);
        } else if (nid === '3') {
            storageFactory = await StorageFactory.At(ropstenStorageFactory, w3);
        }else if (nid === '4') {
            storageFactory = await StorageFactory.At(rinkebyStorageFactory, w3);
        } else if (nid === '1') {
            storageFactory = await StorageFactory.At(mainnetStorageFactory, w3);
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
        let s = await Storage.At(storageAddress, w3);
        w3[accountAddress] = s;
        return s;
    }
    // ,
    // {
    //     // tslint:disable-next-line:max-line-length
    //     // tslint:disable-next-line:variable-name
    //     contractHash: <T extends SoltsiceContract>(): string | undefined => {
    //         let fake: T = {} as T;
    //         console.log('CTOR', fake.constructor);
    //         let artifacts = ((<typeof SoltsiceContract> fake.constructor) as any).Artifacts;
    //         if (!artifacts.bytecode) {
    //             return undefined;
    //         }
    //         let libHash = W3.sha3(JSON.stringify(artifacts.bytecode));
    //         return libHash;
    //     }
    // }
);
