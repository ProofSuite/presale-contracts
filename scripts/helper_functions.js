let chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
const assert = chai.assert;
const expect = chai.expect;
chai.should();
chai.use(chaiAsPromised);


const waitUntilTransactionsMined = (txn_hashes) => {
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
}

const transferOwnership = async (crowdsale, sender, receiver) => {
    tx = await crowdsale.transferOwnership(receiver, {from: sender, gas: 100000});
    await waitUntilTransactionsMined(tx.tx);
    
}

const setContactInformation = async(crowdsale, sender, message) => {
    tx = await crowdsale.setContactInformation(message, {from: sender, gas: 1000000});
    await waitUntilTransactionsMined(tx.tx);
}

const getContactInformation = async(crowdsale, sender) => {
    return await crowdsale.contactInformation.call();
}

const pause = async(contract, sender) => {
    tx = await contract.pause({from: sender, gas: 1000000});
    await waitUntilTransactionsMined(tx.tx);
}

const unpause = async(contract, sender) => {
    tx = await contract.unpause({from :sender, gas: 1000000});
    await waitUntilTransactionsMined(tx.tx);
}

const expectInvalidOpcode = async (promise) => {
    try {
        await promise;
    }
    catch (error) {
        expect(error.message).to.include('invalid opcode')
        return;
    }
    expect.fail('Expected throw not received');
}

const expectInvalidJump = async (promise) => {
    try {
        await promise;
    }
    catch (error) {
        expect(error.message).to.include('invalid JUMP');
        return;
    }
    expect.fail('Expected throw not received')
}

const expectOutOfGas = async (promise) => {
    try {
        await promise;
    }
    catch (error) {
        expect(error.message).to.include('out of gas');
        return;
    }
    expect.fail('Expected throw not received');
}

const ether = (amount) => {
    return new web3.BigNumber(web3.toWei(amount, 'ether')).toString();
}

const makeTransaction = async (tx_obj) => {
    let tx_hash = await web3.eth.sendTransaction(tx_obj)
    return tx_hash
}

const makeTransactions = async (txns) => {

    let txn_hashes = [];

    for (let txn of txns) {
        txn_hash = await makeTransaction(txn);
        txn_hashes.push(txn_hash);
    }

    return txn_hashes;
    
}


const getTotalRaised = async (crowdsale) => {
    let totalRaised = await crowdsale.weiRaised.call();
    console.log(`The total amount of ether raised is ${inEther(totalRaised)}`);
}

const getTokenTotalSupply = async (token) => {
    let totalSupply = await token.totalSupply.call();
    return inEther(totalSupply.toString());
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

const getBalance = (address) => {
    return web3.fromWei(web3.eth.getBalance(address).toString(), 'ether');
}

const inEther = (amountInWei) => {
    return web3.fromWei(amountInWei, 'ether');
}

const inWei = (amountInEther) => {
    return web3.toWei(amountInEther, 'ether');
}

const tokenWei = (amountInTokens) => {
    return amountInTokens * (10 ** 18);
}

const inBaseUnits = (tokens) => {
    return tokens * (10 ** 18);
}

const inTokenUnits = (tokenBaseUnits) => {
    return tokenBaseUnits / (10 * 18);
}

const equivalentTokenBaseUnits = (wei) => {
    let rate = 20;
    return rate * wei;
}

const equivalentTokenUnits = (wei) => {
    let rate = 20;
    return rate * wei / (10 ** 18);
}



module.exports = {
    waitUntilTransactionsMined,
    transferOwnership,
    expectInvalidOpcode,
    expectInvalidJump,
    expectOutOfGas,
    setContactInformation,
    getContactInformation,
    pause,
    unpause,
    ether,
    getBalance,
    getTokenBalance,
    getTotalRaised,
    makeTransaction,
    makeTransactions,
    inEther,
    inWei,
    getTokenBalance,
    equivalentTokenBaseUnits,
    equivalentTokenUnits,
    inBaseUnits,
    inTokenUnits
}