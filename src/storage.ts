import { W3 } from './W3';
import { Storage, StorageFactory } from './contracts';
import { ropstenStorageFactory, mainnetStorageFactory } from './constants';

export let storage: ((w3: W3, accountAddress: string, createOnMainNet?: boolean) => Promise<Storage>) = Object.assign(
    // tslint:disable-next-line:max-line-length
    // tslint:disable-next-line:variable-name
    async (w3: W3, accountAddress: string, createOnMainNet?: boolean): Promise<Storage> => {
        let cached = w3[accountAddress] as Storage;
        if (cached) {
            return cached;
        }

        let nid = await w3.networkId;
        let txDeploy = W3.TC.txParamsDefaultDeploy(accountAddress, 900000, 1000000000);
        let storageFactory: StorageFactory;
        if (await w3.isTestRPC) {
            storageFactory = new StorageFactory(txDeploy, undefined, w3);
        } else if (nid === '3') {
            storageFactory = new StorageFactory(ropstenStorageFactory, undefined, w3);
        } else if (nid === '1') {
            storageFactory = new StorageFactory(mainnetStorageFactory, undefined, w3);
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
        let s = new Storage(storageAddress, undefined, w3);
        await s.instance;
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
