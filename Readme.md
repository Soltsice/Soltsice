# [Soltsice](https://github.com/Soltsice/Soltsice)

**Sol**idity & **T**ype**S**cript **I**ntegration, **C**onfiguration and **E**xamples

With Soltsice you could generate strongly-typed TypeScript proxies for Ethereum contracts from Solidity ABI with a single command. You could also send raw signed transactions to public Ethereum nodes such as [Infura](https://infura.io/) just by adding an optional private key parameter to any method. Soltsice provides convenient utilities for storing key files, for signing arbitrary data for later address recovery with `ecrecover` functions from contracts code and for other frequent tasks. Finally, Soltsice has `MultiOwnable` and `BotManageable` contracts for granular access control for MultiSig majority, individual owners and backend accounts.

## Quick links

- [Soltsice](#soltsice)
  - [Quick links](#quick-links)
  - [Features](#features)
    - [Solidity ABI to TypeScript contract generation](#solidity-abi-to-typescript-contract-generation)
      - [Methods](#methods)
      - [Events](#events)
      - [Type safety and easy refactoring](#type-safety-and-easy-refactoring)
      - [Fast API discovery & Intellisense support](#fast-api-discovery--intellisense-support)
      - [Isomorphic NPM packages for contracts](#isomorphic-npm-packages-for-contracts)
    - [Transactions and custom data signing](#transactions-and-custom-data-signing)
      - [Using remote public nodes is easy](#using-remote-public-nodes-is-easy)
      - [Micropayments state channels example](#micropayments-state-channels-example)
    - [Private key management](#private-key-management)
      - [Security considerations](#security-considerations)
      - [Local key file storage](#local-key-file-storage)
    - [Contracts for access control](#contracts-for-access-control)
      - [MultiOwnable: MultiSig majority and individual owner access](#multiownable-multisig-majority-and-individual-owner-access)
      - [BotManageable: account managed by backend](#botmanageable-account-managed-by-backend)
    - [Utilities](#utilities)
      - [W3 module](#w3-module)
      - [Ethereum Utils](#ethereum-utils)
      - [Keythereum](#keythereum)
      - [Storage contract](#storage-contract)
      - [`soltsice` code generator from code](#soltsice-code-generator-from-code)
    - [Work in progress](#work-in-progress)
  - [Getting started](#getting-started)
    - [Install & Usage](#install--usage)
      - [Workflow](#workflow)
    - [Starter projects](#starter-projects)
      - [Contracts starter](#contracts-starter)
      - [Frontend with CRA & TypeScript](#frontend-with-cra--typescript)
      - [Backend API with Swagger](#backend-api-with-swagger)
  - [Examples](#examples)
    - [Dbrain contracts](#dbrain-contracts)
    - [Dbrain blockchain API](#dbrain-blockchain-api)
    - [Dbrain DApp prototype](#dbrain-dapp-prototype)
  - [Contributing](#contributing)
    - [Build](#build)
    - [License](#license)

---

## Features

### Solidity ABI to TypeScript contract generation

With Soltsice you could generate strongly-typed TypeScript proxies for Ethereum contracts from Solidity ABI with a single command. 

#### Methods

TODO

#### Events

TODO

#### Type safety and easy refactoring

The initial purpose of this library was to have peace of mind and type safety when working with rapidly changing Solidity ABI. TypeScript proxies for contracts allow to use powerful intellisense feature of code editors.

*Methods with signatures*

<img src="https://raw.githubusercontent.com/Soltsice/Soltsice/master/misc/images/methods.png" alt="Methods with signatures" width="600" />

*Typed Constructor*

<img src="https://raw.githubusercontent.com/Soltsice/Soltsice/master/misc/images/constructor.png" alt="Typed Constructor" width="600" />

#### Fast API discovery & Intellisense support

TODO

#### Isomorphic NPM packages for contracts

TODO

### Transactions and custom data signing

TODO

#### Using remote public nodes is easy

TODO Problem: Geth 1.8 added pruning, but still long-running nodes grow in side. Standard BizSpark subscription cannot keep up, needs more resources.

TODO Deploy via migrations using contracts, showcase @ts-check attribute in VSCode

#### Micropayments state channels example

TODO

### Private key management

TODO

#### Security considerations

TODO

#### Local key file storage

TODO

Note that the format is standard one so you could import existing key files just by providing a filepath and password.

<sub>[top](#quick-links)</sub>

### Contracts for access control

TODO

#### MultiOwnable: MultiSig majority and individual owner access

TODO

#### BotManageable: account managed by backend

TODO

### Utilities

TODO

#### W3 module

TODO

#### Ethereum Utils

TODO 

Typings

#### Keythereum

TODO

#### Storage contract

TODO

#### `soltsice` code generator from code

TODO

### Work in progress

TODO

<sub>[top](#quick-links)</sub>

---

## Getting started

Installing and using Soltsice is very easy. You could just add `soltsice` NPM package to your existing project or use a starter project for new development.

### Install & Usage

You must have `truffle` and `copyfiles` installed globally:

> npm install -g truffle copyfiles

Install and save Soltsice:

> npm install soltsice --save

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

See [dbrain-contracts](https://github.com/Soltsice/dbrain-contracts) and [dbrain-blockchain-api](https://github.com/Soltsice/dbrain-blockchain-api) projects that use this library and a standalone minimal example [here](https://github.com/buybackoff/SoltsiceExample).

#### Workflow

* Edit Solidity contracts, run `truffle compile`, run tests on Truffle stack (solidity or js, if any)
* Run Soltsice command `soltsice ./src ./dest`, all TypeScript contracts will be updated, any API changes will block subsequent TS compilation
  (except for rare edge cases such as multiple return parameters which are returned as an array and we use `any` TS type for them)
* Adjust you code to the changes.

### Starter projects

TODO

#### Contracts starter

TODO A starter project with the shortest path to deploy

#### Frontend with CRA & TypeScript

TODO Use the contract starter package from DApp starter (dbrain-dapp structure)

#### Backend API with Swagger

TODO Use the contract starter from backend (dbrain-blockchain-api structure)

<sub>[top](#quick-links)</sub>

---

## Examples

TODO

### Dbrain contracts

TODO 
https://github.com/Soltsice/dbrain-contracts
State channels + in-memory off-chain signing mock

### Dbrain blockchain API

TODO
https://github.com/Soltsice/dbrain-blockchain-api
Off-chain signing prototype on Postgres

### Dbrain DApp prototype

TODO

<sub>[top](#quick-links)</sub>

---

## Contributing

If [some functionality](#work-in-progress) is not supported yet you are very welcome to open an issue or pull request!

### Build

To build & test run the following commands:

```
npm install
npm run build:contracts
npm run soltsice
npm test
```

### License

MIT

(c) 2018 Dbrain.io
