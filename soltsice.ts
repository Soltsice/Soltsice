import * as fs from 'fs';
import * as path from 'path';
import { Web3 } from './src/lib/W3/';
require('amd-loader');

var endOfLine = require('os').EOL;

// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
process.on('unhandledRejection', err => {
    throw err;
});

// tslint:disable-next-line:typedef
function parseArgs(args: string[]): { source: string, destination: string } {
    // console.log(args);
    if (args.length < 1 || args.length > 2) {
        throw 'Wrong number of args';
    }
    var options = {
        source: args[0],
        destination: args.length === 2 ? args[1] : args[0]
    };
    return options;
}

// tslint:disable-next-line:typedef
function generateTypes(options: { source: string, destination: string }) {

    let destination = path.join(__dirname, options.destination);
    if (!fs.existsSync(destination)) {
        fs.mkdirSync(destination);
    }

    // console.log('__dirname', __dirname);
    let files = getSourceFiles(options.source);
    let paths = getSourcePaths(options.source, files);
    let targets = getDestinationPaths(options.destination, files);
    paths.forEach((file, idx) => {
        var ts = processFile(files[idx], file, targets[idx]);
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
    let filesArr = files.map(f => path.join(__dirname, src, f));
    filesArr.forEach(file => {
        // console.log(file);
    });
    return filesArr;
}

function getDestinationPaths(destination: string, files: string[]): string[] {
    let filesArr = files.map(f => path.join(__dirname, destination, f))
        .map(f => f.replace('.json', '.ts'));
    return filesArr;
}

function abiTypeToTypeName(abiType?: string) {
    let outputType: string = '';
    if (!abiType) {
        outputType = 'void';
    } else if (abiType.startsWith('uint') || abiType.startsWith('int')) {
        // TODO parse
        outputType = 'BigNumber';
    } else {
        //     export type ABIDataTypes = 'uint256' | 'boolean' | 'string' | 'bytes' | string; // TODO complete list
        switch (abiType) {
            case 'bool':
                outputType = 'boolean';
                break;

            case 'string':
            case 'address':
                outputType = 'string';
                break;

            case 'string[]':
            case 'address[]':
                outputType = 'string[]';
                break;

            case 'bytes':
                outputType = 'string';
                break;

            default:
                console.warn('Not implemented ABI type, using `any` instead: ', abiType);
                outputType = 'any';
        }
    }
    return outputType;
}

function processCtor(abi: Web3.ABIDefinition): { typesNames: string, names: string } {

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

function processInputs(abi: Web3.ABIDefinition): { typesNames: string, names: string } {

    let inputs = abi.inputs;
    let inputsString: string;
    let inputsNamesString: string;
    if (inputs && inputs.length > 0) {
        inputs = inputs.map((i, idx) => i.name === '' ? Object.assign(i, { name: ('_' + idx) }) : i);
        inputsString = inputs.map(i => i.name + ': ' + abiTypeToTypeName(i.type)).join(', ');
        inputsNamesString = inputs.map(i => i.name).join(', ');
    } else {
        inputsString = '';
        inputsNamesString = '';
    }
    return { typesNames: inputsString, names: inputsNamesString };
}

function processAbi(abi: Web3.ABIDefinition): string {

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
        outputType = abiTypeToTypeName((outputs && outputs.length > 0) ? outputs[0].type : undefined);
    }

    let methodsBody: string =
        isConstant ?
            `
    // tslint:disable-next-line:variable-name
    ${name}(${inputsString}): Promise<${outputType}> {
        return new Promise((resolve, reject) => {
            this.instance.then((inst) => {
                inst.${name}
                    .call(${inputsNamesString})
                    .then((res) => resolve(res))
                    .catch((err) => reject(err));
            });
        });
    }
    `
            :
            `
    // tslint:disable-next-line:variable-name
    ${name}(${inputsString}): Promise<${outputType}> {
        return new Promise((resolve, reject) => {
            this.instance.then((inst) => {
                inst.${name}(${inputsNamesString})
                    .then((res) => resolve(res))
                    .catch((err) => reject(err));
            });
        });
    }
    `
        ;

    return methodsBody;
}

function processFile(fileName: string, filePath: string, targetPath: string): string {
    // let w3: W3.Web3.ABIDefinition = new W3.Web3();
    console.log('Processing ', filePath);

    let contract = require(filePath);

    let relPath = path.relative(path.dirname(targetPath), './src/lib/W3');

    let contractName: string = contract.contract_name;

    let abis = contract.abi as Web3.ABIDefinition[];

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

        `
import { default as contract } from 'truffle-contract';${bnImport}
import { Web3 } from '${relPath}';

/**
 * ${contractName} API
 */
export class ${contractName} {
    public address: string;
    private web3: Web3;
    private instance: Promise<any>;
    constructor(
        web3: Web3,
        deploymentParams?: string | Web3.TC.TxParams,
        ctorParams?: {${ctorParams.typesNames}}
    ) {
        if (typeof deploymentParams === 'string' && !Web3.isValidAddress(deploymentParams as string)) {
            throw 'Invalid deployed contract address';
        }

        this.web3 = web3;
        let tokenArtifacts = require('../../contracts/DBrainToken.json');

        let Contract = contract(tokenArtifacts);
        Contract.setProvider(web3.currentProvider);

        if (typeof deploymentParams !== 'string') {
            Contract.defaults(deploymentParams);
        }

        let instance = new Promise((resolve, reject) => {
            if (typeof deploymentParams === 'string' && Web3.isValidAddress(deploymentParams)) {
                console.log('USING DEPLOYED: ', '${contractName}');
                this.address = deploymentParams!;
                this.instance = Contract.at(this.address).then((inst) => {
                    resolve(inst);
                }).catch((err) => {
                    reject(err);
                });
            } else {
                console.log('NEW CONTRACT: ', '${contractName}');
                // tslint:disable-next-line:max-line-length
                this.instance = Contract.new([${ctorParams.names}] as Web3.TC.ContractDataType[]).then((inst) => {
                    console.log('NEW ADDRESS', inst.address);
                    resolve(inst);
                }).catch((err) => {
                    reject(err);
                });
            }
        });

        this.instance = instance;
    }

    /*
        Contract methods
    */
    ${methodsBody}
}
`;
    return template;
}

generateTypes(parseArgs(process.argv.slice(2)));

// TODO ctor, events