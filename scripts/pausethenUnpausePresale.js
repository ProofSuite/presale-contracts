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
        let investor = web.eth.accounts[2];
        let investor_amount = inWei('1');
        let wannabe_hacker = web3.eth.accounts[3];
        let wannabe_hacker_friend = web3.eth.accounts[4];

        console.log("We pause the crowdsale before making transactions : ")
        await pauseCrowdsale(crowdsale, owner);


        console.log("State of the crowdsale contract before transactions : ");
        printInvestorBalances(investor);
        await printTotalTokenSupply(token);
        await printTokenDistribution(token, investor);


        printInvestorBuying(investorAmounts);


        txn = buildTransactions(crowdsale, investor, investor_amount);
        txn_hash = await makeTransactions(txn);
        txn_receipt = await waitUntilTransactionsMined(txn_hash);

            
        console.log("State of the crowdsale contract after transactions: ");
        printInvestorBalances(investor);
        await printTotalTokenSupply(token);
        await printTokenDistribution(token, investor);

        
        console.log("We unpause the crowdsale and verify that the crowdsale : ");
        await unPauseCrowdsale(crowdsale, owner);


        console.log("*** We verify that transactions go through when the crowdsale in unpaused ***");
        console.log("State of the crowdsale contract before transactions : ");
        printInvestorBalances(investors);
        await printTotalTokenSupply(token);
        await printTokenDistribution(token, investors);


        printInvestorBuying(investorAmounts);


        txns = buildTransactions(crowdsale, investors, investorAmounts);
        txn_hashes = await makeTransactions(txns);
        txn_receipts = await waitUntilTransactionsMined(txn_hashes);

            
        console.log("State of the crowdsale contract after transactions: ");
        printInvestorBalances(investors);
        await printTotalTokenSupply(token);
        await printTokenDistribution(token, investors);


        console.log("*** We verify that only the owner can pause the contract ***");

        pauseCrowdsale(crowdsale, hacker);
        paused(crowdsale)
        

        console.log("State of the crowdsale contract before the transactions")

        printInvestorBalances(investors);
        await printTotalTokenSupply(token);
        await printTokenDistribution(token, investors);
        printInvestorBuying(investorAmounts);

        console.log("Investor transactions")


        txns = buildTransactions(crowdsale, investors, investorAmounts);
        txn_hashes = await makeTransactions(txns);
        txn_receipts = await waitUntilTransactionsMined(txn_hashes);

            
        console.log("State of the crowdsale contract after transactions: ");
        printInvestorBalances(investors);
        await printTotalTokenSupply(token);
        await printTokenDistribution(token, investors);

    }



    const printInvestorBalances = (addresses) => {
        let index = 1;
        let current_balance;
        addresses.forEach((address) => {
            currentBalance = getBalance(address);
            console.log(`The balance of ${address} - (Investor ${index}) is : ${currentBalance} ethers`);
            index++;
        });
        skipLine();
    }


    const printInvestorBuying = (amounts) => {
        let index = 1;
        amounts.forEach((amount) => {
            console.log(`Investor ${index} is sending ${amount} to the contract`);
            index++;
        });
        skipLine();
    }


    const pauseCrowdsale = async (crowdsale, sender) => {
        let pause_crowdsale_tx = await crowdsale.paused({from: sender, gas: 100000});
    }

    const unPauseCrowdsale = async (crowdsale, sender) => {
        let unpause_crowdsale_tx = await crowdsale.unpause({from: sender, gas: 100000})
    }

    const paused(crowdsale) = async(crowdsale) => {
        let result = await crowdsale.paused.call();
        console.log(`Crowdsale is halted : ${result}`)
        skipLine();
    }

    const makeTransaction = async (tx_obj) => {
        let tx_hash = await web3.eth.sendTransaction(tx_obj)
        let balance = getBalance(tx_obj.from);
        return tx_hash
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

    const waitUntilTransactionsMined = function (txn_hashes) {
        var transactionReceiptAsync;
        const interval = 500;
        transactionReceiptAsync = function(txn_hashes, resolve, reject) {
            try {
                var receipt = web3.eth.getTransactionReceipt(txn_hashes);
                if (receipt == null) {
                    setTimeout(function () {
                        transactionReceiptAsync(txn_hashes, resolve, reject);
                    }, interval);
                } else {
                    resolve(receipt);
                }
            } catch(e) {
                reject(e);
            }
        };

        if (Array.isArray(txn_hashes)) {
            var promises = [];
            txn_hashes.forEach(function (tx_hash) {
                promises.push(waitUntilTransactionsMined(tx_hash));
            });
            return Promise.all(promises);
        } 
        else {
            return new Promise(function (resolve, reject) {transactionReceiptAsync(txn_hashes, resolve, reject);});
        }
    };

    run();
    callback();

};