# Solidity Todo DApp Example 2021

This is simple Todo DApp using Solidity Truffle and React TypeScript

* Live Demo: https://kenfj.github.io/solidity-todo-example/
* Updated and enhanced DApp from "ToDo List Ethereum Dapp"
  - https://www.youtube.com/watch?v=-1c5hb_Y2MM&list=PLbbtODcOYIoGfbrnfxgwva0Fktju0L449
  - Using the latest version as of May 2021

```bash
truffle version
# Truffle v5.3.9 (core: 5.3.9)
# Solidity - 0.8.3 (solc-js)
# Node v14.16.1
# Web3.js v1.3.6
```

* This ToDo contract has been deployed to Ropsten
  - https://ropsten.etherscan.io/tx/0xb60827b1923074b58b577d9dcd1e26e7e5579e65c9ce09607b1158e2c92a51d6

## Setup

```bash
# setup private network
truffle develop
truffle(develop)> compile
truffle(develop)> migrate
truffle(develop)> test

# start web app
cd app
BROWSER=none npm start
open http://127.0.0.1:3000/
```

## Initial Setup Log

```bash
truffle init

# update compilers.solc.version: "0.8.3" in truffle-config.js

truffle create contract ToDo

# Open ToDo.sol in VSCode and right click
# Solidity Change workspace compiler version to 0.8.3
#
# This will add solidity version in .vscode/settings.json
# "solidity.compileUsingRemoteVersion": "v0.8.3+xxx"
```

## Deploy and Test

```bash
# create migration script
truffle create migration ToDo

# start local blockchain at http://127.0.0.1:9545/
truffle develop
# import 1st account to MetaMask

compile

migrate
# or
migrate --reset
```

```bash
# create several tasks for testing
let toDo = await ToDo.deployed()
toDo.createTask("My task")

# check the created task
toDo.getTask(1)
(await toDo.getTaskIds()).toString()
```

```bash
# run test
truffle create test ToDo
truffle test
```

## Web Interface

* Start from `create-react-app` using TypeScript this time
  - (instead of https://github.com/truffle-box/react-box)

```bash
npx create-react-app app --template typescript --use-npm

cd app
BROWSER=none npm start
open http://127.0.0.1:3000/

# run test
npm test

npm install --save-dev web3 typechain @typechain/web3-v1

# https://material-ui.com/components/snackbars/#complementary-projects
npm install notistack

# Note: during development, sometimes you may need to close
# browser tab and re-open it (instead of just reload the page)
```

## Types

* generate type definition by typechain

```bash
# add contracts_build_directory in truffle-config.js
truffle compile
# this will output json to app/src/contracts/

cd app
# https://tech.mobilefactory.jp/entry/2019/12/04/163000
npx typechain --target=web3-v1 'src/contracts/**/*.json'
# this will output .d.ts to types/web3-v1-contracts/

# or one command
npm run typechain
```

```bash
# one shot command to truffle compile and typechain in app
npm run build
```

## Using Web3Modal

* https://walletconnect.org/
* https://github.com/web3modal/web3modal
* https://github.com/Web3Modal/web3modal/blob/master/docs/providers/walletconnect.md

```bash
npm install web3modal
npm install @walletconnect/web3-provider
```

## Deploy to Ropsten test network

* Deploy from remix
  - https://medium.com/swlh/deploy-smart-contracts-on-ropsten-testnet-through-ethereum-remix-233cd1494b4b
* Deployed ToDo contract
  - https://ropsten.etherscan.io/tx/0xb60827b1923074b58b577d9dcd1e26e7e5579e65c9ce09607b1158e2c92a51d6
* add contract address and tx hash manually
  - `networks` 3 in `app/src/contracts/ToDo.json`
  - or update `truffle-config.js` to connect to Ropsten using INFURA

## How to use MetaMask with web3

* significant changes in recent updates
* refer the latest official doc
  - https://docs.metamask.io/guide/getting-started.html
  - https://docs.metamask.io/guide/ethereum-provider.html
* sample code
  - https://docs.harmony.one/home/developers/wallets/metamask/interacting-with-metamask

## Troubleshooting

* `the tx doesn't have the correct nonce.`
  - need to reset account after restarted `truffle develop`
  - MetaMask > select test account > Settings > Advanced> Reset Account
  - https://stackoverflow.com/questions/45585735

## Reference

* https://eattheblocks.com/todo-list-ethereum-dapp-step4/
* https://eattheblocks.com/todo-list-ethereum-dapp-step7/
* https://github.com/jklepatch/eattheblocks/tree/master/todolist/step6
* React Dapp
  - https://www.youtube.com/watch?v=QWL4UHTsxKg&list=PLbbtODcOYIoHJQ9sTs0e8kn7YV39W9Vcp
* sample code of React Web3 TypeScript Truffle
  - https://qiita.com/andynuma/items/9c0b6d908f3eec84bd92
  - https://github.com/truffle-box/react-box/blob/master/client/src/App.js
  - https://github.com/ethereum-ts/TypeChain/tree/master/examples/web3-v1
* Hardhat - alternative of Truffle
  - https://hardhat.org/guides/typescript.html
