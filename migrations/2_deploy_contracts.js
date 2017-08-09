var SafeMath = artifacts.require('./SafeMath.sol');
var Ownable = artifacts.require('./Ownable.sol');
var Pausable = artifacts.require('./Pausable.sol');
var ERC20 = artifacts.require('./ERC20.sol');
var ProofPresaleToken = artifacts.require('./ProofPresaleToken.sol');
var ProofPresale = artifacts.require('./ProofPresale.sol');


var wallet = '0x30ec0a9ca3e8e87363cba2b8a3774902ce82d3af';
var minInvestment = 10 * (10 ** 18);
var tokenCap = 295257;
var rate = 20;
var decimals = 18;
var gas = 1000000;
var gasPrice = 13*(10**9);

/**
* Standard constructor arguments for Crowdsale contract:
* @param wallet that ultimately receives ether sent to the crowdsale contract
* @param minimum investment in ether
* @param crowdsale token cap
* @param rate : amounts of tokens received for 1 ether invested
* deployer.deploy(ProofPresale, '0x00000000000000', 10, 295257, 20, 18, {gas: 3000000, gasPrice: 1000000000});
*/ 

module.exports = function(deployer) {
  deployer.deploy(SafeMath, {gas: gas, gasPrice: gasPrice});
  deployer.link(SafeMath, ProofPresale);
  deployer.link(SafeMath, ProofPresaleToken);
  deployer.deploy(ProofPresale, {gas: 3000000, gasPrice: gasPrice });
};





