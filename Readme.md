[![Build Status](https://travis-ci.org/dbrainio/Soltsice.svg?branch=master)](https://travis-ci.org/dbrainio/Soltsice)

# Soltsice

**Sol**idity & **T**ype**S**cript **I**ntegration, **C**onfiguration and **E**xamples

## Install

You should have `truffle` and `copyfiles` installed globally:

> npm install -g truffle copyfiles

Install and save Soltsice:

> npm install soltsice --save

## Build
To build & test run the following commands:

```
npm install
npm run build:contracts
npm run soltsice
npm run testrpc
truffle migrate
truffle test
npm test
```

## Usage

Soltsice allows to generate TypeScript files for Ethereum contracts with the command:

> soltsice ./artifacts ./types

All `.json` artifacts from `truffle compile` in the folder `artifacts` will be transformed into TypeScript classes in 
`types` with a single `index.ts` file with all exports.

Every TypeScript contract class inherits `SoltsiceContract`, which is a wrapper over [Truffle-contract](https://github.com/trufflesuite/truffle-contract) with methods generated from ABI.
If some functionality is not yet supported by Soltsice, you may use `SoltsiceContract._instance : Promise<any>` field to access untyped Truffle-contract instance.

You could import generated types as:

```
import { W3 } from "soltsice";
import { BigNumber } from "bignumber.js";
import { StandardToken } from "./types";

// default wrapper for web3: either window['web3'] if present,
// or http provider connected to localhost: 8545, if not running on https 
let w3: W3 = new W3();

// null for ctor params which are only used for newly deployed contracts
let st: StandardToken = new StandardToken("address of deployed contract", null, w3);

// note that typings are optional in variable definitions, TypeScript infers types
let supply: Promise<BigNumber> = st.totalSupply();

supply.then(value => {
    console.log("TOTAL SUPPLY", value.dividedBy(1e18).toFormat(0));
});

```

See [dbrain-contracts](https://github.com/dbrainio/dbrain-contracts) and [dbrain-blockchain-api](https://github.com/dbrainio/dbrain-blockchain-api) projects that use this library and a standalone minimal example [here](https://github.com/buybackoff/SoltsiceExample).

### Type inference & intellisense

The purpose of this library is to have peace of mind and type safety when working with rapidly changing Solidity ABI.
TypeScript wrappers over contracts allow to use powerful intellisense feature of code editors.

*Methods with signatures*

<img src="https://raw.githubusercontent.com/dbrainio/Soltsice/master/doc/methods.png" alt="Methods with signatures" width="600" />

*Typed Constructor*

<img src="https://raw.githubusercontent.com/dbrainio/Soltsice/master/doc/constructor.png" alt="Typed Constructor" width="600" />

### Workflow

* Edit Solidity contracts, run `truffle compile`, run tests on Truffle stack (solidity or js, if any)
* Run Soltsice command `soltsice ./src ./dest`, all TypeScript contracts will be updated, any API changes will block subsequent TS compilation
  (except for rare edge cases such as multiple return parameters which are returned as an array and we use `any` TS type for them)
* Adjust you code to the changes.

## Contributing

If some functionality is not supported yet you are very welcome to open an issue or pull request!

## License

MIT
