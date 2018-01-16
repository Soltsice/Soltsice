#!/usr/bin/env node

import * as fs from 'fs';
import * as path from 'path';
import { W3 } from './W3';

// tslint:disable:max-line-length

export module soltsice {
    var endOfLine = require('os').EOL;

    // Makes the script crash on unhandled rejections instead of silently
    // ignoring them. In the future, promise rejections that are not handled will
    // terminate the Node.js process with a non-zero exit code.
    process.on('unhandledRejection', err => {
        throw err;
    });

    // tslint:disable-next-line:typedef
    export function parseArgs(args: string[]): { source: string, destination: string, W3importPath: string } {
        console.log(args);
        if (args.length < 1 || args.length > 3) {
            throw 'Wrong number of args';
        }
        var options = {
            source: args[0],
            destination: args.length > 1 ? args[1] : args[0],
            W3importPath: args.length > 2 ? args[2] : 'soltsice'
        };
        return options;
    }

    // tslint:disable-next-line:typedef
    export function generateTypes(options: { source: string, destination: string, W3importPath: string }) {

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
            arrayPosition = abiType.indexOf('[')
            if(arrayPosition >= 0){
                abiType = abiType.substring(0, arrayPosition)
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

        if(arrayPosition >= 0){
            outputType = outputType.map(x => x + '[]')
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
    public ${name}(${inputsString === '' ? '' : inputsString + ','} txParams?: W3.TC.TxParams): Promise<${outputType}> {
        return new Promise((resolve, reject) => {
            this._instance.${name}
                .call(${inputsNamesString === '' ? '' : inputsNamesString + ','} txParams || this._sendParams)
                .then((res) => resolve(res))
                .catch((err) => reject(err));
        });
    }
    `
                :
                `
    // tslint:disable-next-line:member-ordering
    public ${name} = Object.assign(
        // tslint:disable-next-line:max-line-length
        // tslint:disable-next-line:variable-name
        (${inputsString === '' ? '' : inputsString + ','} txParams?: W3.TC.TxParams): Promise<W3.TC.TransactionResult> => {
            return new Promise((resolve, reject) => {
                this._instance.${name}(${inputsNamesString === '' ? '' : inputsNamesString + ','} txParams || this._sendParams)
                    .then((res) => resolve(res))
                    .catch((err) => reject(err));
            });
        },
        {
            // tslint:disable-next-line:max-line-length
            // tslint:disable-next-line:variable-name
            sendTransaction: (${inputsString === '' ? '' : inputsString + ','} txParams?: W3.TC.TxParams): Promise<string> => {
                return new Promise((resolve, reject) => {
                    this._instance.${name}.sendTransaction(${inputsNamesString === '' ? '' : inputsNamesString + ','} txParams || this._sendParams)
                        .then((res) => resolve(res))
                        .catch((err) => reject(err));
                });
            }
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
                    this._instance.${name}.estimateGas(${inputsNamesString}).then((g) => resolve(g));
                });
            }
        });
    `
            ;

        return methodsBody;
    }

    function processFile(fileName: string, filePath: string, targetPath: string, W3ImportPath: string): string {
        console.log('Processing ', filePath);

        let contract = require(filePath);

        let importPath = W3ImportPath;
        let artifactRelPath = path.relative(path.dirname(targetPath), filePath).replace(/\\/g, '/'); // path.resolve(filePath).replace(/\\/g, '/'); //
        console.log('REL PATH ', artifactRelPath);
        let contractName: string = contract.contract_name || contract.contractName;
        if (!contractName) {
            throw 'Cannot find contract name in the artifact';
        }

        let abis = contract.abi as W3.ABIDefinition[];

        // When a contract is created, its constructor (a function with the same name as the contract)
        // is executed once.A constructor is optional.Only one constructor is allowed, and this means
        // overloading is not supported.
        let ctor = abis.filter(a => a.type === 'constructor');
        let ctorParams = ctor.length === 1 ? processCtor(ctor[0]) : { typesNames: '', names: '' };

        let methodsBody = abis.filter(a => a.type === 'function').map(processAbi).join('');

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
    static get Artifacts() { return require('${artifactRelPath}'); }

    static get BytecodeHash() {
        // we need this before ctor, but artifacts are static and we cannot pass it to the base class, so need to generate
        let artifacts = ${contractName}.Artifacts;
        if (!artifacts || !artifacts.bytecode) {
            return undefined;
        }
        let hash = W3.sha3(JSON.stringify(artifacts.bytecode));
        return hash;
    }

    // tslint:disable-next-line:max-line-length
    static async New(deploymentParams: W3.TC.TxParams, ctorParams?: {${ctorParams.typesNames}}, w3?: W3, link?: SoltsiceContract[]): Promise<${contractName}> {
        let contract = new ${contractName}(deploymentParams, ctorParams, w3, link);
        await contract._instancePromise;
        return contract;
    }

    static async At(address: string | object, w3?: W3): Promise<${contractName}> {
        let contract = new ${contractName}(address, undefined, w3, undefined);
        await contract._instancePromise;
        return contract;
    }

    protected constructor(
        deploymentParams: string | W3.TC.TxParams | object,
        ctorParams?: {${ctorParams.typesNames}},
        w3?: W3,
        link?: SoltsiceContract[]
    ) {
        // tslint:disable-next-line:max-line-length
        super(
            w3,
            ${contractName}.Artifacts,
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
}

soltsice.generateTypes(soltsice.parseArgs(process.argv.slice(2)));

// TODO ctor, events
