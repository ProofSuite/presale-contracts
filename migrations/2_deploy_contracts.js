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
  deployer.deploy(Ownable, {gas: 1000000, gasPrice: 1000000000});
  deployer.deploy(Pausable, {gas: 1000000, gasPrice: 1000000000});
  deployer.deploy(Contactable, {gas: 1000000, gasPrice: 1000000000});
  deployer.deploy(ProofPresaleToken, {gas: 1000000, gasPrice: 1000000000});
  deployer.deploy(Crowdsale, '0x2bdd21761a483f71054e14f5b827213567971c676928d9a1808cbfa4b7501209', 10, 295257, 20, 18, {gas: 3000000, gasPrice: 1000000000});
};


 /**
* Standard constructor arguments for Crowdsale contract:
* @param wallet that ultimately receives ether sent to the crowdsale contract
* @param minimum investment in ether
* @param crowdsale token cap
* @param rate : amounts of tokens received for 1 ether invested
* @param decimals are currently not used
* deployer.deploy(Crowdsale, '0x00000000000000', 10, 295257, 20, 18, {gas: 3000000, gasPrice: 1000000000});
*/ 





