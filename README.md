# MetaCity

## Theory

- What is a Non-Fungible Token?
  Fungible means to be the same or interchangeable eg Eth is fungible. With this in mind, NFTs are unique; each one is different. Every single token has unique characteristics and values. They are all distinguishable from one another and are not interchangeable eg Unique Art
  ![NFT's Creation Process](https://i.imgur.com/wt4qWKT.jpg)

- What is ERC-721?
  ERC-721 is an open standard that describes how to build Non-Fungible tokens on EVM (Ethereum Virtual Machine) compatible blockchains; it is a standard interface for Non-Fungible tokens; it has a set of rules which make it easy to work with NFTs. Before moving ahead have a look at all the functions supported by [ERC721](https://docs.openzeppelin.com/contracts/3.x/api/token/erc721)

## Technology Stack & Tools

- Solidity (Writing Smart Contract)
- Javascript (React & Testing)
- [Web3](https://web3js.readthedocs.io/en/v1.5.2/) (Blockchain Interaction)
- [Truffle](https://www.trufflesuite.com/docs/truffle/overview) (Development Framework)
- [Ganache](https://www.trufflesuite.com/ganache) (For Local Blockchain)
- [MetaMask](https://metamask.io/) (Ethereum Wallet)
- [ThreeJS](https://threejs.org/docs/index.html) (3D Javascript library)
- [@react-three/fiber](https://docs.pmnd.rs/react-three-fiber/getting-started/introduction) (React renderer for Three.js)
- [@react-three/drei](https://docs.pmnd.rs/drei/introduction) (Extra helpers for React-Three-Fiber)

## Requirements For Initial Setup

- Install [NodeJS](https://nodejs.org/en/), I recommend using node version v14 or v16 to avoid any potential dependency issues
- Install [Truffle](https://www.trufflesuite.com/docs/truffle/overview), In your terminal, you can check to see if you have truffle by running `truffle --version`. To install truffle run `npm i -g truffle`.
- Install [Ganache](https://www.trufflesuite.com/ganache).
- Install [MetaMask](https://metamask.io/) in your browser.

## Setting Up

### 1. Clone/Download the Repository

### 2. Install Dependencies:

`$ yarn`

### 3. Migrate Smart Contracts

`$ truffle migrate --reset`

### 4. Test Smart Contracts

`$ truffle test`

### 5. Start Frontend

`$ yarn start`

## Requirements For Running App

#### 1. Setup a local blockchain network for running Ganache-Cli with these credential or as per your choice:

- Network name: "Local Network CLI"
- New RPC URL: "http://127.0.0.1:8545/"
- Chain ID: "31337"
- Currency symbol: "ETH"
- Block explorer URL(OPtional): fill it
  or leave it empty as per your choice

#### 2. Run the Local blockchain in one terminal and keep it running by writing also copy and import first two accounts' private into your metamask wallet using :-

`$ npx ganache-cli`

#### 3. Now start the App using new terminal and purchase the plot of land using:-

`$ yarn start`
