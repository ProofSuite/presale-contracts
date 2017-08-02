module.exports = function(callback) {
    
    require('babel-polyfill');
    
    basicTokenArtifact = require('../build/contracts/BasicToken.json');
    contactableArtifacts = require('../build/contracts/Contactable.json');
    crowdsaleArtifact = require('../build/contracts/Crowdsale.json');
    ownableArtifact = require('../build/contracts/Ownable.json');
    ERC20Artifact = require('../build/contracts/ERC20.json');
    ERC20BasicArtifact = require('../build/contracts/ERC20Basic.json');
    presaleProofTokenArtifact = require('../build/contracts/PresaleProofToken.json');
    safeMathArtifact = require('../build/contracts/SafeMath.json');
    standardTokenArtifacts = require('../build/contracts/StandardToken.json');
    
    Web3 = require('web3');
    const provider = new Web3.providers.HttpProvider('http://localhost:8545');
    const web3 = new Web3(provider);
    
    const contract = require('truffle-contract');
    
    
    const run = async function() {
        
        let crowdsaleContract = contract(crowdsaleArtifact);
        crowdsaleContract.setProvider(web3.currentProvider);
        const crowdsale_abi = crowdsaleContract.abi;
        
        let presaleTokenContract = contract(presaleProofTokenArtifact);
        presaleTokenContract.setProvider(web3.currentProvider);
        const presaleTokenAbi = presaleTokenContract.abi;
        
        let crowdsale = {
            contractObject: crowdsaleContract,
            contract: '',
            address: '',
            tokenAddress: '',
            ownerAddress: '',
            walletAddress: '',
            abi: ''
        }
        
        let token = {
            contractObject: presaleTokenContract,
            contract: '',
            address: '',
            ownerAddress: '',
            abi: ''
        }
        
        await initializeContracts(crowdsale, token);
        await verifyContractSetup(crowdsale, token);
        await printCrowdsaleSetup(crowdsale.contract);
        
    }
    
    const initializeContracts = async function(crowdsale, token) {
        
        await initializeCrowdsale(crowdsale);
        await initializeToken(token, crowdsale);
        
    }
    
    
    let initializeCrowdsale = async (crowdsale) => {
        crowdsale.contract = await crowdsale.contractObject.deployed();
        crowdsale.address = crowdsale.contract.address;
        crowdsale.ownerAddress = await crowdsale.contract.owner.call();
        crowdsale.tokenAddress = await crowdsale.contract.token.call();
        crowdsale.walletAddress = await crowdsale.contract.wallet.call();
    }
    
    let initializeToken = async (token, crowdsale) => {
        token.address = await crowdsale.contract.token.call();
        token.contract = token.contractObject.at(token.address);
        token.ownerAddress = await token.contract.owner.call();
    }
    
    let verifyContractSetup = (crowdsale, token) => {
        console.log("\nThe crowdsale owner address is : " + crowdsale.ownerAddress);
        console.log("The crowdsale wallet address is : " + crowdsale.walletAddress);
        console.log("The crowdsale token address is : " + crowdsale.tokenAddress);
        console.log("The presake token address is : " + token.address);
        console.log("The presale token owner address is : " + token.ownerAddress + "\n");
    }
    
    const printCrowdsaleSetup = async (crowdsale) => {
        
        const crowdsaleTokenAddress = await crowdsale.token.call();
        console.log(`The crowdsale token address is ${crowdsaleTokenAddress}`)
        
        const cap = await crowdsale.cap.call();
        const capInEther = web3.fromWei(cap, 'ether');
        console.log(`The cap of the presale is ${capInEther} ether`);
        
        const minInvestment = await crowdsale.minInvestment.call();
        const minInvestmentinEther = web3.fromWei(minInvestment, 'ether');
        console.log(`The minimum investment for the presale is ${minInvestmentinEther} ether`);
        
        const rate = await crowdsale.rate.call();
        console.log(`The ether to presale tokens conversion rate is ${rate}`);
        skipLine();
        
    }

    const skipLine = () => console.log("\n");

    const getBalance = (address) => {
        return web3.fromWei(web3.eth.getBalance(address).toString(), 'ether');
    }

    const inEther = (amountInWei) => {
        return web3.fromWei(amountInWei, 'ether');
    }

    const inWei = (amountInEther) => {
        return web3.toWei(amountInEther, 'ether');
    }
    
    
    run();
    callback();
    
};