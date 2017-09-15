Soltsice
==========

**Sol**idity & **T**ype**S**cript **I**ntegration, **C**onfiguration and **E**xamples

Usage
----------------------

Soltsice allows to generate TypeScript files for Ethereum contracts with the command:

> npm run soltsice ./sourceDir ./destinationDir

All `.json` artifact from `truffle compile` in the folder `./sourceDir` will be transformed into TypeScript classes in 
`./destinationDir` with a single `index.ts` file with all exports.

NPM package is WIP

Manual setup from scratch
------------------

0. Install global dependencies

```
> npm install -g create-react-app
> npm install -g truffle
> npm install -g ethereumjs-testrpc
```

1. Create TypeScript-React-Starter app (https://github.com/Microsoft/TypeScript-React-Starter)

```
> create-react-app soltsice --scripts-version=react-scripts-ts
```

Make sure that it works:

```
> cd soltsice
> npm run start
```

2. Initialize Truffle app

```
> truffle init
```

3. Make sure that Truffle app works

Start a test Ethereum client:

```
> testrpc
```

Then run truffle commands. On Windows, Truffle doesn't always work with `cmd` terminal. Open the folder in VS Code and use PowerShell terminal (`Ctrl+\``)

```
> truffle compile
> truffle migrate
> truffle test
```

4. Install Truffle dependencies

```
> npm install -save truffle-blockchain-utils truffle-contract
```


5. Add modified typings from https://github.com/ethereum/web3.js/pull/897

```
> npm install -saveDev @types/bignumber.js @types/underscore
```

Add [types definition file](https://github.com/dbrainio/Soltsice/blob/master/src/types/web3/index.d.ts) from this repository to `/src/types/web3/`

6. In tsconfig.json set `"noImplicitAny": false` (temporary fix to make TS compiler happy, keep no-any as true in tslint.json)

7. Build the app and test the production build

```
> npm run build
> npm install -g serve
> serve -s build
```

8. Test web3.js from TypeScript

Add the following test to `App.test.tsx`

```
it('could use types from web3', () => {
  
  console.log(web3);

  if (typeof web3 !== 'undefined' && typeof web3.currentProvider !== 'undefined') {
    web3 = new Web3(web3.currentProvider);
  } else {
    var web3: W3.Web3 = require('web3');
    // set the provider you want from Web3.providers
    web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
  }

  console.log('Getting Ethereum block');
  web3.eth.getBlock(1, false, (error, result) => {
    if (!error) {
      console.log(result);
    } else {
      console.error(error);
    }
  });
});

```

Run the test:

```
> npm run test
```


You should see details of the first block of the test Ethereum network:

```
console.log src\App.test.tsx:23
    { number: 1,
      hash: '0x680f512198f50ecdbeee82f6a5b202957853c742d15c98531611826d234763d1',
      parentHash: '0xf845479daa96c7fd0db6ed18a06bf8c83d6b04aa2aba9bb6f2319d364219f83a',
      ... }
```

and `eth_getBlockByNumber` line in the `testrpc` console window.

**Congrats! You now have statically-typed access to web3.js library from a statically-typed React application!**

The resulting project is a mix of Truffle and React+TypeScript apps. 
There are just no single reason not to use static types when they are available!

