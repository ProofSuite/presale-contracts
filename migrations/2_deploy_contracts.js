var SafeMath = artifacts.require('./SafeMath.sol');
var Ownable = artifacts.require('./Ownable.sol');
var Pausable = artifacts.require('./Pausable.sol');
var Contactable = artifacts.require('./Contactable.sol');
var ERC20 = artifacts.require('./ERC20.sol');
var ProofPresaleToken = artifacts.require('./ProofPresaleToken.sol');
var Crowdsale = artifacts.require('./ProofPresale.sol');

// 0x99892Ac6DA1b3851167Cb959fE945926bca89f09

 /**
* Standard constructor arguments for Crowdsale contract:
* @param wallet that ultimately receives ether sent to the crowdsale contract
* @param minimum investment in ether
* @param crowdsale token cap
* @param rate : amounts of tokens received for 1 ether invested
* @param decimals
* deployer.deploy(Crowdsale, '0x00000000000000', 10, 295257, 20, 18, {gas: 3000000, gasPrice: 1000000000});
*/ 

var wallet = '0xe2b3204f29ab45d5fd074ff02ade098fbc381d42';
var minInvestment = (10 ** 18) * 1;
var tokenCap = 295257;
var rate = 20;
var gas = 3*10**6;
var gasPrice = 40*10**9;

module.exports = function(deployer) {
  deployer.deploy(SafeMath, {gas: gas, gasPrice: gasPrice });
  deployer.link(SafeMath, Crowdsale);
  deployer.link(SafeMath, ProofPresaleToken);
  // deployer.deploy(Ownable, {gas: gas, gasPrice: gasPrice  });
  // deployer.deploy(Pausable, {gas: gas, gasPrice: gasPrice  });
  // deployer.deploy(Contactable, {gas: gas, gasPrice: gasPrice  });
  // deployer.deploy(ProofPresaleToken, {gas: gas, gasPrice: gasPrice  });
  deployer.deploy(Crowdsale, wallet, minInvestment, tokenCap, rate, {gas: gas, gasPrice: gasPrice });
};








