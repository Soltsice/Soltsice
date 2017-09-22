Soltsice
==========

**Sol**idity & **T**ype**S**cript **I**ntegration, **C**onfiguration and **E**xamples

Intall
----------------------

> npm install soltsice --save

Usage
----------------------

Soltsice allows to generate TypeScript files for Ethereum contracts with the command:

> soltsice ./sourceDir ./destinationDir

All `.json` artifacts from `truffle compile` in the folder `./sourceDir` will be transformed into TypeScript classes in 
`./destinationDir` with a single `index.ts` file with all exports.

Every TypeScript contract class inherits `SoltsiceContract`, which is a wrapper over [Truffle-contract](https://github.com/trufflesuite/truffle-contract) with methods generated from ABI.
If some functionality is not yet supported by Soltsice, you may use `SoltsiceContract._instance` field to access untyped Truffle-contract instance.

The package ships with types for all [OpenZeppelin](https://github.com/OpenZeppelin/zeppelin-solidity/) contracts. You may import them as:

```
import { W3, StandardToken } from "soltsice";
import { BigNumber } from "bignumber.js";

// default wrapper for web3: either window['web3'] if present,
// or http provider connected to localhost: 8545, if not running on https 
let w3: W3 = W3.Default;

let st: StandardToken = new StandardToken(w3, "address of deployed contract");

// note that typings are optional in variable definitions, TypeScript infers types
let supply: Promise<BigNumber> = st.totalSupply();

console.log("TOTAL SUPPLY", supply);
```

**Workflow:**

* Edit Solidity contracts, run `truffle compile`, run tests on Truffle stack (solidity or js)
* Run Soltsice command `soltsice src dest`, all TypeScript contracts will be updated, any API changes will block subsequent TS compilation
  (except for rare edge cases such as multiple return parameters which are returned as an array and we use `any` TS type for them)
* Adjust React components & stores to the changes.

Contributing
-----------------------
Some functionality such as libraries is not supported yet. Contributors are welcome!

License
-----------------------
MIT