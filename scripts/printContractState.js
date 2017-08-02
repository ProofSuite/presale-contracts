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
        await executeScript(crowdsale.contract, token.contract);

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


    const executeScript = async function(crowdsale, token) {

        let owner = web3.eth.accounts[0];
        let wallet_address = web3.eth.accounts[1];
        let investors = [web3.eth.accounts[2], web3.eth.accounts[3], web3.eth.accounts[4]];
        let investor_balances = investors.map((investor) => {return getBalance(investor)});
        let investorAmounts = ['1', '0.5', '2'].map((amount) => {return inWei(amount)});
        
        
        console.log("The current contract state is : ");
        await getTotalRaised(crowdsale);
        await printTotalTokenSupply(token);
        await printTokenDistribution(token, investors);

    }


    const verifyCrowdsaleNotHalted = async (crowdsale) => {
        let crowdsalePaused = await crowdsale.paused.call();
        console.log(`We verify the crowdsale is not halted`)
        console.log(`Crowdsale is halted : ${crowdsalePaused}`);
        skipLine();

    }

    const verifyCrowdsaleContactInformation = async (crowdsale, owner) => {

        await crowdsale.setContactInformation('hello@proofsuite.com', {from: owner, gas: 7000000});
        const contactInformation = await crowdsale.contactInformation.call();
        console.log(`The crowdsale contact information has been set to : ${contactInformation}`);

    }

    const getTotalRaised = async (crowdsale) => {
        let totalRaised = await crowdsale.weiRaised.call();
        console.log(`The total amount of ether raised is ${inEther(totalRaised)}`);
    }

    const getTotalTokenSupply = async (token) => {
        let totalSupply = await token.totalSupply.call();
        return totalSupply.toString();
    }

    const printTotalTokenSupply = async (token) => {
        let totalTokenSupply = await getTotalTokenSupply(token);
        console.log(`The total token supply created is ${totalTokenSupply}`);
    }

    const getTokenBalance = async (token, address) => {
        let balance = await token.balanceOf(address);
        return balance;
    }

    const getTokenDistribution = async(token, investors) => {

        const promises = investors.map(async (address) => {
            return { address: address, balance: await getTokenBalance(token, address) };
        });

        return Promise.all(promises);
    }

    const printTokenDistribution = async (token, investors) => {
        let tokenDistribution = await getTokenDistribution(token, investors)
        let index = 1;
        tokenDistribution.forEach((investor) => {
            console.log(`The token balance of address ${investor.address} is ${investor.balance}`)
            index++;
        });
        skipLine();
    }

    const getBalance = (address) => {
        return web3.fromWei(web3.eth.getBalance(address).toString(), 'ether');
    }

    const inEther = (amountInWei) => {
        return web3.fromWei(amountInWei, 'ether');
    }

    const inWei = (amountInEther) => {
        return web3.toWei(amountInEther, 'ether');
    }

    const skipLine = () => console.log("\n");

    run();
    callback();

};