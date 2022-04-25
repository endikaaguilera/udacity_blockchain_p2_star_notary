# ND1309 C2 Ethereum Smart Contracts, Tokens and Dapps - Project Starter 
**PROJECT: Decentralized Star Notary Service Project** - For this project, you will create a DApp by adding functionality with your smart contract and deploy it on the public testnet.

### ToDo
This Starter Code has already implemented the functionalities you implemented in the StarNotary (Version 2) exercise, and have comments in all the files you need to implement your tasks.

### Dependencies versions
  - Truffle v5.5.11 (core: 5.5.11)
  - Ganache v^7.0.4
  - Solidity - 0.8.4 (solc-js)
  - Node v17.6.0
  - Web3.js v1.5.3
  - OpenZeppelin v^4.4.2

### Tokens data
  - ERC721 Token Symbol: SNT
  - Token name: StarNotaryToken
  - [Token address](https://rinkeby.etherscan.io/token/0xbca47a91704a20ea7b9016f44f3805aea7c7d57e)
  - [Contract addess](https://rinkeby.etherscan.io/address/0xbca47a91704a20ea7b9016f44f3805aea7c7d57e)

### Task 1
Your Project is to Modify the StarNotary version 2 contract code to achieve the following:

    Add a name and a symbol for your starNotary tokens. Resource

    Add a function lookUptokenIdToStarInfo, that looks up the stars using the Token ID, and then returns the name of the star.

    Add a function called exchangeStars, so 2 users can exchange their star tokens...Do not worry about the price, just write code to exchange stars between users.

    Write a function to Transfer a Star. The function should transfer a star from the address of the caller. The function should accept 2 arguments, the address to transfer the star to, and the token ID of the star.

### Task 2
Add supporting unit tests, to test the following:

    The token name and token symbol are added properly.

    2 users can exchange their stars.

    Stars Tokens can be transferred from one address to another.

### Task 3
Deploy your Contract to Rinkeby

    Edit the truffle.config file to add settings to deploy your contract to the Rinkeby Public Network.

Helper Points:

    Command used to deploy to Rinkeby truffle migrate --reset --network rinkeby

    You will need to have your Metamask’s seed and Infura setup.

    This was shown to you in detail in the lesson on Solidity, while creating ERC-20 tokens on Rinkeby.

### Task 4
Modify the front end of the DAPP to achieve the following:

    Lookup a star by ID using tokenIdToStarInfo() (you will have to add code for this in your index.html and index.js files)


### Dependencies
For this project, you will need to have:
1. **Node and NPM** installed - NPM is distributed with [Node.js](https://www.npmjs.com/get-npm)
```bash
# Check Node version
node -v
# Check NPM version
npm -v
```


2. **Truffle v5.X.X** - A development framework for Ethereum. 
```bash
# Unsinstall any previous version
npm uninstall -g truffle
# Install
npm install -g truffle
# Specify a particular version
npm install -g truffle@5.0.2
# Verify the version
truffle version
```


2. **Metamask: 5.3.1** - If you need to update Metamask just delete your Metamask extension and install it again.


3. [Ganache](https://www.trufflesuite.com/ganache) - Make sure that your Ganache and Truffle configuration file have the same port.


4. **Other mandatory packages**:
```bash
cd app
# install packages
npm install --save  openzeppelin-solidity@2.3
npm install --save  truffle-hdwallet-provider@1.0.17
npm install webpack-dev-server -g
npm install web3
```


### Run the application
1. Clean the frontend 
```bash
cd app
# Remove the node_modules  
# remove packages
rm -rf node_modules
# clean cache
npm cache clean
rm package-lock.json
# initialize npm (you can accept defaults)
npm init
# install all modules listed as dependencies in package.json
npm install
```


2. Start Truffle by running
```bash
# For starting the development console
truffle develop
# truffle console

# For compiling the contract, inside the development console, run:
compile

# For migrating the contract to the locally running Ethereum network, inside the development console
migrate --reset

# For running unit tests the contract, inside the development console, run:
test
```

3. Frontend - Once you are ready to start your frontend, run the following from the app folder:
```bash
cd app
npm run dev
```

---

### Important
When you will add a new Rinkeyby Test Network in your Metamask client, you will have to provide:

| Network Name | New RPC URL | Chain ID |
|---|---|---|
|Private Network 1|`http://127.0.0.1:9545/`|1337 |

The chain ID above can be fetched by:
```bash
cd app
node index.js
```

## Troubleshoot
#### Error 1 
```
'webpack-dev-server' is not recognized as an internal or external command
```
**Solution:**
- Delete the node_modules folder, the one within the /app folder
- Execute `npm install` command from the /app folder

After a long install, everything will work just fine!


#### Error 2
```
ParserError: Source file requires different compiler version. 
Error: Truffle is currently using solc 0.5.16, but one or more of your contracts specify "pragma solidity >=0.X.X <0.X.X".
```
**Solution:** In such a case, ensure the following in `truffle-config.js`:
```js
// Configure your compilers  
compilers: {    
  solc: {      
    version: "0.5.16", // <- Use this        
    // docker: true,
    // ...
```

## Raise a PR or report an Issue
1. Feel free to raise a [Pull Request](https://github.com/udacity/nd1309-p2-Decentralized-Star-Notary-Service-Starter-Code/pulls) if you find a bug/scope of improvement in the current repository. 

2. If you have suggestions or facing issues, you can log in issue. 

---

Do not use the [Old depreacted zipped starter code](https://s3.amazonaws.com/video.udacity-data.com/topher/2019/January/5c51c4c0_project-5-starter-code/project-5-starter-code.zip)
