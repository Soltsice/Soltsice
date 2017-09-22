Soltsice
==========

**Sol**idity & **T**ype**S**cript **I**ntegration, **C**onfiguration and **E**xamples

Usage
----------------------

Soltsice allows to generate TypeScript files for Ethereum contracts with the command:

> soltsice ./sourceDir ./destinationDir

All `.json` artifact from `truffle compile` in the folder `./sourceDir` will be transformed into TypeScript classes in 
`./destinationDir` with a single `index.ts` file with all exports.

NPM package is WIP

**Workflow:**

* Edit Solidity contracts, run `truffle compile`, run tests on Truffle stack (solidity or js)
* Run Soltsice script `soltsice`, all TypeScript contracts will be updated, any API change will block TS compilation
  (except for rare edge cases such as multiple return parameters which are returned as an array and we use `any` TS type for them)
* Adjust React components & stores to the changes.