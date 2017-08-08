var Migrations = artifacts.require("./Migrations.sol");

module.exports = function(deployer) {
  deployer.deploy(Migrations, {gas: 4500000, gasPrice: 20 * 10 ** 9 });
};
