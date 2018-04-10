import * as fs from 'fs';
import * as path from 'path';
import { W3 } from './W3';

// tslint:disable:max-line-length

export module soltsice {

    export interface SoltsiceOptions {
        paths: string[];
        cleanArtifacts: boolean;
        skipPattern: string;
    }

    // tslint:disable-next-line:typedef
    function parseArgs(args: SoltsiceOptions): { source: string, destination: string, W3importPath: string, cleanArtifacts: boolean, skipPattern: string } {
        if (args.paths.length < 1 || args.paths.length > 3) {
            throw new Error('Wrong number of args');
        }
        if (args.cleanArtifacts) {
            throw new Error('Cleaning artifacts is not supported yet');
        }
        if (args.skipPattern) {
            throw new Error('Skip pattern is not supported yet');
        }
        var options = {
            source: args.paths[0],
            destination: args.paths.length > 1 ? args.paths[1] : args.paths[0],
            W3importPath: args.paths.length > 2 ? args.paths[2] : 'soltsice',
            cleanArtifacts: args.cleanArtifacts,
            skipPattern: args.skipPattern
        };
        console.log('Soltsice optoins: ', options);
        return options;
    }

    // tslint:disable-next-line:typedef
    export function generateTypes(args: SoltsiceOptions) {
        let options = parseArgs(args);
        let endOfLine = require('os').EOL;

        let destination = options.destination;

        if (!fs.existsSync(destination)) {
            fs.mkdirSync(destination);
        }

        let files = getSourceFiles(options.source);
        // console.log('FILES', files);
        let paths = getSourcePaths(options.source, files);
        // console.log('PATHS', paths);
        let targets = getDestinationPaths(options.destination, files);
        // console.log('TARGETS', targets);
        paths.forEach((file, idx) => {
            var ts = processFile(files[idx], file, targets[idx], options.W3importPath);
            console.log('Writing to ', targets[idx]);
            fs.writeFileSync(targets[idx], ts);
        });

        // create index file

        let exports = files.map(f => `export * from './${f.replace('.json', '')}';`).join(endOfLine);

        fs.writeFileSync(path.join(destination, 'index.ts'), exports);

    }

    function getSourceFiles(src: string): string[] {
        let filesArr: string[] = fs.readdirSync(src).filter((f) => f.endsWith('.json'));
        return filesArr;
    }

    function getSourcePaths(src: string, files: string[]): string[] {
        let filesArr = files.map(f => path.resolve(path.join(src, f))); // __dirname,
        filesArr.forEach(file => {
            // console.log(file);
        });
        return filesArr;
    }

    function getDestinationPaths(destination: string, files: string[]): string[] {
        let filesArr = files.map(f => path.resolve(path.join(destination, f))) // __dirname,
            .map(f => f.replace('.json', '.ts'));
        return filesArr;
    }

    function abiTypeToTypeName(abiType?: string, isReturnType?: boolean) {

        let outputType: string[];
        let arrayPosition = -1;

        if (!abiType) {
            outputType = ['void'];
        } else {
            arrayPosition = abiType.indexOf('[');
            if (arrayPosition >= 0) {
                abiType = abiType.substring(0, arrayPosition);
            }

            if (abiType.startsWith('uint') || abiType.startsWith('int')) {
                outputType = isReturnType ? ['BigNumber'] : ['BigNumber', 'number'];
            } else if (abiType.startsWith('bytes')) {
                outputType = ['string'];
            } else {
                //     export type ABIDataTypes = 'uint256' | 'boolean' | 'string' | 'bytes' | string; // TODO complete list
                switch (abiType) {
                    case 'bool':
                        outputType = ['boolean'];
                        break;

                    case 'string':
                    case 'address':
                        outputType = ['string'];
                        break;

                    default:
                        console.warn('Not implemented ABI type, using `any` instead: ', abiType);
                        outputType = ['any'];
                }
            }
        }

        if (arrayPosition >= 0) {
            outputType = outputType.map(x => x + '[]');
        }

        return outputType.join(' | ');
    }

    function processCtor(abi: W3.ABIDefinition): { typesNames: string, names: string } {

        let inputs = abi.inputs;
        let inputsString: string;
        let inputsNamesString: string;
        if (inputs && inputs.length > 0) {
            inputsString = inputs.map(i => i.name + ': ' + abiTypeToTypeName(i.type)).join(', ');
            inputsNamesString = inputs.map(i => 'ctorParams!.' + i.name).join(', ');
        } else {
            inputsString = '';
            inputsNamesString = '';
        }
        return { typesNames: inputsString, names: inputsNamesString };
    }

    function processInputs(abi: W3.ABIDefinition): { typesNames: string, names: string } {

        let inputs = abi.inputs;
        let inputsString: string;
        let inputsNamesString: string;
        if (inputs && inputs.length > 0) {
            inputs = inputs.map((i, idx) => i.name === '' ? Object.assign(i, { name: ('_' + idx) }) : i);
            inputsString = inputs.map(i => i.name + ': ' + abiTypeToTypeName(i.type)).join(', '); // comma for tx params
            inputsNamesString = inputs.map(i => i.name).join(', ');
        } else {
            inputsString = '';
            inputsNamesString = '';
        }
        return { typesNames: inputsString, names: inputsNamesString };
    }

    function processAbi(abi: W3.ABIDefinition): string {

        let name = abi.name;
        let isConstant = abi.constant;

        let inputs = processInputs(abi);
        let inputsString = inputs.typesNames;
        let inputsNamesString = inputs.names;

        let outputs = abi.outputs;

        let outputType: string;
        if (outputs && outputs.length > 1) {
            console.warn('Multiple output ABI not implemented, using `any` type for: ', abi);
            outputType = 'any';
        } else {
            outputType = abiTypeToTypeName((outputs && outputs.length > 0) ? outputs[0].type : undefined, true);
        }

        let methodsBody: string =
            isConstant ?
                `
    // tslint:disable-next-line:max-line-length
    // tslint:disable-next-line:variable-name
    public ${name}(${inputsString === '' ? '' : inputsString + ','} txParams?: W3.TX.TxParams): Promise<${outputType}> {
        return new Promise((resolve, reject) => {
            this._instance.${name}
                .call(${inputsNamesString === '' ? '' : inputsNamesString + ','} txParams || this._sendParams)
                .then((res: any) => resolve(res))
                .catch((err: any) => reject(err));
        });
    }
    `
                :
                `
    // tslint:disable-next-line:member-ordering
    public ${name} = Object.assign(
        // tslint:disable-next-line:max-line-length
        // tslint:disable-next-line:variable-name
        (${inputsString === '' ? '' : inputsString + ','} txParams?: W3.TX.TxParams, privateKey?: string): Promise<W3.TX.TransactionResult> => {
            if (!privateKey) {
                return new Promise((resolve, reject) => {
                    this._instance.${name}(${inputsNamesString === '' ? '' : inputsNamesString + ','} txParams || this._sendParams)
                        .then((res: any) => resolve(res))
                        .catch((err: any) => reject(err));
                });
            } else {
                // tslint:disable-next-line:max-line-length
                return this.w3.sendSignedTransaction(this.address, privateKey, this._instance.${name}.request(${inputsNamesString}).params[0].data, txParams || this._sendParams, undefined)
                    .then(txHash => {
                        return this.waitTransactionReceipt(txHash);
                    });
            }
        },
        {
            // tslint:disable-next-line:max-line-length
            // tslint:disable-next-line:variable-name
            sendTransaction: Object.assign((${inputsString === '' ? '' : inputsString + ','} txParams?: W3.TX.TxParams): Promise<string> => {
                    return new Promise((resolve, reject) => {
                        this._instance.${name}.sendTransaction(${inputsNamesString === '' ? '' : inputsNamesString + ','} txParams || this._sendParams)
                            .then((res: any) => resolve(res))
                            .catch((err: any) => reject(err));
                    });
                },
                {
                    // tslint:disable-next-line:max-line-length
                    // tslint:disable-next-line:variable-name
                    sendSigned: (${inputsString === '' ? '' : inputsString + ','} privateKey: string, txParams?: W3.TX.TxParams, nonce?: number): Promise<string> => {
                        // tslint:disable-next-line:max-line-length
                        return this.w3.sendSignedTransaction(this.address, privateKey, this._instance.${name}.request(${inputsNamesString}).params[0].data, txParams || this._sendParams, nonce);
                    }
                }
            )
        },
        {
            // tslint:disable-next-line:max-line-length
            // tslint:disable-next-line:variable-name
            data: (${inputsString}): Promise<string> => {
                return new Promise((resolve, reject) => {
                    resolve(this._instance.${name}.request(${inputsNamesString}).params[0].data);
                });
            }
        },
        {
            // tslint:disable-next-line:max-line-length
            // tslint:disable-next-line:variable-name
            estimateGas: (${inputsString}): Promise<number> => {
                return new Promise((resolve, reject) => {
                    this._instance.${name}.estimateGas(${inputsNamesString}).then((g: any) => resolve(g)).catch((err: any) => reject(err));
                });
            }
        });
    `
            ;

        return methodsBody;
    }

    function processFile(fileName: string, filePath: string, targetPath: string, W3ImportPath: string): string {
        console.log('Processing ', filePath);

        let contract = JSON.parse(fs.readFileSync(filePath, { encoding: 'utf8' }));

        let importPath = W3ImportPath;
        let artifactRelPath = path.relative(path.dirname(targetPath), filePath).replace(/\\/g, '/'); // path.resolve(filePath).replace(/\\/g, '/'); //
        console.log('REL PATH ', artifactRelPath);
        let contractName: string = contract.contract_name || contract.contractName;
        if (!contractName) {
            throw new Error('Cannot find contract name in the artifact');
        }

        let abis = contract.abi as W3.ABIDefinition[];

        // When a contract is created, its constructor (a function with the same name as the contract)
        // is executed once.A constructor is optional.Only one constructor is allowed, and this means
        // overloading is not supported.
        let ctor = abis.filter(a => a.type === 'constructor');
        let ctorParams = ctor.length === 1 ? processCtor(ctor[0]) : { typesNames: '', names: '' };

        let names = abis.map(x => x.name);

        let methodsBody = abis
            .filter((value, index, self) => {
                // filter duplicate names and keep only the first one
                // order of filters matters because we use names arrays built from abis before the next 'function' filter
                return names.indexOf(value.name) === index;
            })
            .filter(a => a.type === 'function')
            .map(processAbi)
            .join('');

        let bnImport = ``;
        if (ctorParams.typesNames.indexOf('BigNumber') >= 0 || methodsBody.indexOf('BigNumber') >= 0) {
            bnImport = `
import { BigNumber } from 'bignumber.js';`;
        }

        // TODO

        let template: string =

            `${bnImport}
import { W3, SoltsiceContract } from '${importPath}';

/**
 * ${contractName} API
 */
export class ${contractName} extends SoltsiceContract {
    public static get artifacts() { return require('${artifactRelPath}'); }

    public static get bytecodeHash() {
        // we need this before ctor, but artifacts are static and we cannot pass it to the base class, so need to generate
        let artifacts = ${contractName}.artifacts;
        if (!artifacts || !artifacts.bytecode) {
            return undefined;
        }
        let hash = W3.sha3(JSON.stringify(artifacts.bytecode));
        return hash;
    }

    // tslint:disable-next-line:max-line-length
    public static async new(deploymentParams: W3.TX.TxParams, ctorParams?: {${ctorParams.typesNames}}, w3?: W3, link?: SoltsiceContract[], privateKey?: string): Promise<${contractName}> {
        w3 = w3 || W3.default;
        if (!privateKey) {
            let contract = new ${contractName}(deploymentParams, ctorParams, w3, link);
            await contract._instancePromise;
            return contract;
        } else {
            let data = ${contractName}.newData(ctorParams, w3);
            let txHash = await w3.sendSignedTransaction(W3.zeroAddress, privateKey, data, deploymentParams);
            let txReceipt = await w3.waitTransactionReceipt(txHash);
            let rawAddress = txReceipt.contractAddress;
            let contract = await ${contractName}.at(rawAddress, w3);
            return contract;
        }
    }

    public static async at(address: string | object, w3?: W3): Promise<${contractName}> {
        let contract = new ${contractName}(address, undefined, w3, undefined);
        await contract._instancePromise;
        return contract;
    }

    public static async deployed(w3?: W3): Promise<${contractName}> {
        let contract = new ${contractName}('', undefined, w3, undefined);
        await contract._instancePromise;
        return contract;
    }

    // tslint:disable-next-line:max-line-length
    public static newData(ctorParams?: {${ctorParams.typesNames}}, w3?: W3): string {
        // tslint:disable-next-line:max-line-length
        let data = SoltsiceContract.newDataImpl(w3, ${contractName}.artifacts, ctorParams ? [${ctorParams.names}] : []);
        return data;
    }

    protected constructor(
        deploymentParams: string | W3.TX.TxParams | object,
        ctorParams?: {${ctorParams.typesNames}},
        w3?: W3,
        link?: SoltsiceContract[]
    ) {
        // tslint:disable-next-line:max-line-length
        super(
            w3,
            ${contractName}.artifacts,
            ctorParams ? [${ctorParams.names}] : [],
            deploymentParams,
            link
        );
    }
    /*
        Contract methods
    */
    ${methodsBody}
}
`;
        return template;
    }

    /** Create or get local key file and return private key and address. This is a blocking sync function for file read/write, therefore should be used during initial startup. */
    export function getLocalPrivateKeyAndAddress(filepath: string, password: string): W3.Account {

        let address: string = '';
        let privateKey: string = '';
        let publicKey: string = '';

        let keythereum = W3.getKeythereum();

        let createNew = (): void => {
            let dk = keythereum.create();
            privateKey = W3.EthUtils.bufferToHex(dk.privateKey);
            publicKey = W3.EthUtils.bufferToHex(W3.EthUtils.privateToPublic(dk.privateKey));
            let addrBuffer = W3.EthUtils.privateToAddress(dk.privateKey);
            address = W3.EthUtils.bufferToHex(addrBuffer);
            let keyObject = keythereum.dump(password, dk.privateKey, dk.salt, dk.iv);
            fs.writeFileSync(filepath, JSON.stringify(keyObject), { encoding: 'ascii' });
        };

        if (fs.existsSync(filepath)) {
            let keyObject = JSON.parse(fs.readFileSync(filepath, { encoding: 'ascii' }).trim());
            address = keyObject.address;
            let privateBuffer = keythereum.recover(password, keyObject);
            privateKey = W3.EthUtils.bufferToHex(privateBuffer);
            publicKey = W3.EthUtils.bufferToHex(W3.EthUtils.privateToPublic(privateBuffer));
        } else {
            createNew();
        }

        if (privateKey && !privateKey.startsWith('0x')) {
            privateKey = '0x' + privateKey;
        }

        if (publicKey && !publicKey.startsWith('0x')) {
            publicKey = '0x' + publicKey;
        }

        if (address && !address.startsWith('0x')) {
            address = '0x' + address;
        }

        return { privateKey, publicKey, address };
    }
}
