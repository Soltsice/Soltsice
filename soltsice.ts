import * as fs from 'fs';
import * as path from 'path';
import { Web3 } from './src/lib/W3/';

// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
process.on('unhandledRejection', err => {
    throw err;
});

// tslint:disable-next-line:typedef
function parseArgs(args: string[]): { source: string, destination: string } {
    console.log(args);
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
    console.log('Testing generateTypes');
    console.log('__dirname', __dirname);
    console.log(options);
    let files = getSourceFiles(options.source);
    let paths = getSourcePaths(options.source, files);
    let targets = getDestinationPaths(options.destination, files);
    paths.forEach((file, idx) => {
        var ts = processFile(files[idx], file, targets[idx]);
        console.log('Writing to ', targets[idx]);
        fs.writeFileSync(targets[idx], ts);
    });

    // TODO create index file
}

function getSourceFiles(src: string): string[] {
    let filesArr: string[] = fs.readdirSync(src).filter((f) => f.endsWith('DBrainToken.json'));
    return filesArr;
}

function getSourcePaths(src: string, files: string[]): string[] {
    let filesArr = files.map(f => path.join(__dirname, src, f));
    filesArr.forEach(file => {
        console.log(file);
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

            case 'bytes':
                outputType = 'string';
                break;

            default:
                console.warn('Not implemented ABI type: ', abiType);
        }
    }
    return outputType;
}

function processAbi(abi: Web3.ABIDefinition): string {

    let name = abi.name;
    let isConstant = abi.constant;

    let inputs = abi.inputs;
    let inputsString: string;
    let inputsNamesString: string;
    if (inputs && inputs.length > 0) {
        inputsString = inputs.map(i => i.name + ': ' + abiTypeToTypeName(i.type)).join(', ');
        inputsNamesString = inputs.map(i => i.name).join(', ');
    } else {
        inputsString = '';
        inputsNamesString = '';
    }

    let outputs = abi.outputs;

    if (outputs && outputs.length > 1) {
        console.warn('Multiple output ABI not implemented: ', abi);
        return '';
    }

    let outputType: string = abiTypeToTypeName((outputs && outputs.length > 0) ? outputs[0].type : undefined);

    let methodsBody: string =
        isConstant ?
            `
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

    let methodsBody = abis.map(processAbi).join(``);

    let template: string =

        `
import { default as contract } from 'truffle-contract';
import { BigNumber } from 'bignumber.js';
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
        constructorParams: Web3.TC.ContractDataType[],
        deploymentParams?: string | Web3.TC.TxParams
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
                this.instance = Contract.new(constructorParams).then((inst) => {
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