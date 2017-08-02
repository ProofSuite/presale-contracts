# Proof-Presale-Smart-Contracts
Public Repository for Proof Smart Contracts



### Contracts
The Proof Presale Token and Crowdsale contracts are based on open-zeppelin standard and audited contracts.

The Proof Presale tokens are based on the `StandardToken` and `MintableToken` ERC20 contracts.

The Crowdsale contract is inspired by the open-zeppelin `Crowdsale` contract with additional functionality mixed in.


### Presale
295,297 tokens will be issued at the price of 0.05 ether per token. This represents a 43% discount to the Proof ICO which will start from October 10.

### Development and Testing Environment Setup

#### Requirements :
- OSX or Linux (Windows setup is likely possible but not covered in this guide)
- Node (version 8.1.0 recommended for the testing environment)
- testrpc / geth 


#### Testing Environment Setup : 

- Clone the repository and install dependencies

``` 
git clone https://github.com/ProofSuite/ProofPresaleContract.git
cd ProofPresaleContract
npm install
```

- Install the latest version of truffle

```
npm install -g truffle
```

- Compile contracts
```
truffle compile
```

- Initialize testrpc (or geth)

```
testrpc
```

- Migrate contracts to chosen network

```
truffle migrate --network development
```

- Make sure you are using the latest version of node

``` 
nvm install 8.1.0
nvm use 8.1.0
```


- Fill in `truffle.js` and `deploy_contracts.js` with appropriate wallet addresses. Unlock the corresponding addresses.

- Verify all tests are passing

```
truffle test
```

- You can interact with the contracts via the console 

```
truffle console
```



