var SafeMath = artifacts.require('./SafeMath.sol');
var Ownable = artifacts.require('./Ownable.sol');
var Pausable = artifacts.require('./Pausable.sol');
var Contactable = artifacts.require('./Contactable.sol');
var ERC20 = artifacts.require('./ERC20.sol');
var ProofPresaleToken = artifacts.require('./ProofPresaleToken.sol');
var Crowdsale = artifacts.require('./Crowdsale.sol');

module.exports = function(deployer) {
  deployer.deploy(SafeMath, {gas: 100000, gasPrice: 1000000000});
  deployer.link(SafeMath, Crowdsale);
  deployer.link(SafeMath, ProofPresaleToken);
  // deployer.deploy(Ownable, {gas: 1000000, gasPrice: 1000000000});
  // deployer.deploy(Pausable, {gas: 1000000, gasPrice: 1000000000});
  // deployer.deploy(Contactable, {gas: 1000000, gasPrice: 1000000000});
  deployer.deploy(ProofPresaleToken, {gas: 1000000, gasPrice: 1000000000});
  deployer.deploy(Crowdsale, '0x7f4f630cdbfab30e76572e1d3283f4cc827edcbd', 10, 295257, 20, 18, {gas: 3000000, gasPrice: 1000000000});
};


//parameters for crowdsale contract : 
// 1. wallet
// 2. minimum investment
// 3. cap
// 4. rate
// 5. decimals
// default : deployer.deploy(Crowdsale, 0x7f4f630cdbfab30e76572e1d3283f4cc827edcbd, 10, 6250, 12, 18, {gas: 3000000});


// Raising 1,181,031 tokens
// Raising 300.000 tokens during the presale
// 1 token = 0.08 ether = (80000000000000000 = 8 * (10 ** 16) wei) <=> 12.5 tokens per ether (12500000000000000000 = 125 * (10 ** 17) base units) if there is no discount
// 1 token = 0.08 ether <=> 25 tokens (25 * (10 ** 18) base units) per ether if there is a discount
// ether cap = 300.000 * 0.08 ether = 24000 ether


