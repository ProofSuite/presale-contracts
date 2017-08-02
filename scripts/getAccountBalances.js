module.exports = function(callback) {

    require('babel-polyfill');

    Web3 = require('web3');
    const provider = new Web3.providers.HttpProvider('http://localhost:8545');
    const web3 = new Web3(provider);

    const contract = require('truffle-contract');

    const run = function() {
        for (i = 0; i < web3.eth.accounts.length; i++) {
            console.log(`The balance of ${web3.eth.accounts[i]} is ${getBalance(web3.eth.accounts[i])}`)
        }
    }

    const getBalance = (address) => {
        return web3.fromWei(web3.eth.getBalance(address).toString(), 'ether');
    }

    run();
    callback();

};