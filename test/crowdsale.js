const SafeMath = artifacts.require('./SafeMath.sol');
const Ownable = artifacts.require('./Ownable.sol');
const Pausable = artifacts.require('./Pausable.sol');
const Contactable = artifacts.require('./Contactable.sol');
const ProofPresaleToken = artifacts.require('./ProofPresaleToken.sol');
const Crowdsale = artifacts.require('./ProofPresale.sol');

const h = require('../scripts/helper_functions.js');
const ether = h.ether;
const getBalance = h.getBalance;



let chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
const assert = chai.assert;
const expect = chai.expect;
chai.should();
chai.use(chaiAsPromised);



contract('Crowdsale', (accounts) => {

  // const investment = ether(1);
  const investment = ether(10);
  const smallInvestment = ether(0.5);
  const hugeInvestment = ether(50000);
  const investor = accounts[1];
  // const cap = ether(6250);
  

  beforeEach(async function() {

      this.crowdsale = await Crowdsale.deployed();
      this.token = ProofPresaleToken.at(await this.crowdsale.token());
      this.owner = await this.crowdsale.owner.call();
      this.wallet = await this.crowdsale.wallet.call();
      this.cap = await this.crowdsale.cap.call();
      
      this.receiver = accounts[1];
      this.hacker_1 = accounts[2];
      this.hacker_2 = accounts[3];
      
    });

  describe('Ownership', function() {

    it('should initially belong to contract caller', async function() {
      assert.equal(this.owner, accounts[0]);
    });

    it('should be transferable to another account', async function() {
      
      await h.transferOwnership(this.crowdsale, this.owner, this.receiver);
      const newOwner = await this.crowdsale.owner.call();
      assert.equal(this.receiver, newOwner);
      
    });

    it('should not be transferable by non-owner', async function() {
      
      await h.expectInvalidOpcode(h.transferOwnership(this.crowdsale, this.hacker_1, this.hacker_2))
      const newOwner = await this.crowdsale.owner.call();
      assert.equal(this.owner, newOwner);

    });

  });


  describe('Contact Information', function() {

    it('can be set by contract owner', async function() {
      await h.setContactInformation(this.crowdsale, this.owner, 'test@mail.com');
      const information = await h.getContactInformation(this.crowdsale, this.owner);
      expect(information).to.equal('test@mail.com');
    });

    it('can not be set by non-contract owner', async function() {

      await h.expectInvalidOpcode(h.setContactInformation(this.crowdsale, this.hacker_1, 'hacked@mail.com'));
      const information = await h.getContactInformation(this.crowdsale, this.hacker_2);
      expect(information).to.equal('test@mail.com')
    });

  });


  describe('Pause', function() {

    after(async function() {
      let crowdsalePaused = await this.crowdsale.paused.call();
      if(crowdsalePaused) {
        await h.unpause(this.crowdsale, this.owner);
      }
    });


    it('can be paused and unpaused by the owner', async function() {

      let crowdsalePaused = await this.crowdsale.paused.call();
      if(crowdsalePaused) {
        await h.unpause(this.crowdsale, this.owner);
        crowdsalePaused = await this.crowdsale.paused.call();
        expect(crowdsalePaused).to.be.false;
      }

      await h.pause(this.crowdsale, this.owner);
      crowdsalePaused = await this.crowdsale.paused.call();
      expect(crowdsalePaused).to.be.true;

      await h.unpause(this.crowdsale, this.owner);
      crowdsalePaused = await this.crowdsale.paused.call();
      expect(crowdsalePaused).to.be.false;
      
    });

    it('can not be paused non-owner', async function() {

      let crowdsalePaused = await this.crowdsale.paused.call();

      //we initially unpause the contract before we carry out the test
      if(crowdsalePaused) {
        await h.unpause(this.crowdsale, this.owner);
        crowdsalePaused = await this.crowdsale.paused.call();
        expect(crowdsalePaused).to.be.false;
      }

      await h.expectInvalidOpcode(h.pause(this.crowdsale, this.hacker_1));
      crowdsalePaused = await this.crowdsale.paused.call();
      expect(crowdsalePaused).to.be.false;

    });


    it('can not be unpaused non-owner', async function() {

      let crowdsalePaused = await this.crowdsale.paused.call();

      //we initially unpause the contract before we carry out the test
      if(!crowdsalePaused) {
        await h.pause(this.crowdsale, this.owner);
        crowdsalePaused = await this.crowdsale.paused.call();
        expect(crowdsalePaused).to.be.true;
      }

      await h.expectInvalidOpcode(h.pause(this.crowdsale, this.hacker_1));
      crowdsalePaused = await this.crowdsale.paused.call();
      expect(crowdsalePaused).to.be.true;

    });




  });

    describe('Crowdsale', async function() {

          
        it('accepts payments', async function() {
          txn_obj = {from: investor, to: this.crowdsale.address, value: investment, gas: 1000000, gasPrice: 600000000}
          txn = await h.makeTransaction(txn_obj).should.be.fulfilled;
          
          params = {from: investor, gas: 1000000, value: investment}
          txn_2 = await this.crowdsale.buyTokens(investor, params).should.be.fulfilled;

          
        });

        it('should not accept small payments', async function() {
          txn_obj = {from: investor, to: this.crowdsale.address, value: smallInvestment, gas: 1000000, gasPrice: 600000000 }
          await h.expectInvalidOpcode(h.makeTransaction(txn_obj))

          params = {from: investor, gas: 1000000, gasPrice: 600000000, value: smallInvestment}
          await h.expectInvalidOpcode(this.crowdsale.buyTokens(investor, params));
        });


        it('should not accept huge payments', async function() {
          let walletBalanceBefore = getBalance(this.wallet);
          await h.expectInvalidOpcode(this.crowdsale.send(hugeInvestment, {from: investor}));
          let walletBalanceAfter = getBalance(this.wallet);
          expect(walletBalanceAfter).equals(walletBalanceBefore);
        });

        it('should increase total token supply', async function() {
          let totalSupplyBefore = await this.token.totalSupply.call();

          params = {from: investor, gas: 1000000, gasPrice: 600000000, value: investment}
          txn = await this.crowdsale.buyTokens(investor, params);
          txn_receipts = await h.waitUntilTransactionsMined(txn.tx);

          let totalSupplyAfter = await this.token.totalSupply.call();
          let tokenDifference = Number((totalSupplyAfter - totalSupplyBefore).toString());
          let expectedTokenDifference = h.equivalentTokenBaseUnits(investment);
          
          tokenDifference.should.be.equal(expectedTokenDifference);
        });
        
        
        it('should increase total supply by 200 for 10 ether raised', async function() {

          let totalSupplyBefore = await this.token.totalSupply.call();
            
          params = {from: investor, gas: 1000000, gasPrice: 600000000, value: investment}
          txn = await this.crowdsale.buyTokens(investor, params);
          txn_receipts = await h.waitUntilTransactionsMined(txn.tx);

          let totalSupplyAfter = await this.token.totalSupply.call();
          let tokenDifference = Number((totalSupplyAfter - totalSupplyBefore).toString());
          
          tokenDifference.should.be.equal(200 * (10 ** 18));

        });

        it('should transfer money to the wallet after receiving investment', async function() {
          let walletBalanceBefore = getBalance(this.wallet);
          let txn = await this.crowdsale.send(investment, {from: investor, gas: 100000, gasPrice: 600000000});
          h.waitUntilTransactionsMined(txn);
          let walletBalanceAfter = getBalance(this.wallet);
          let amountReceived = h.inWei(walletBalanceAfter - walletBalanceBefore);

          amountReceived.should.be.equal(investment);
        });

        it('should create tokens for the sender', async function() {
          let tokenBalanceBefore = await this.token.balanceOf(investor);

          txn_obj = {from: investor, to: this.crowdsale.address, value: investment, gas: 1000000, gasPrice: 600000000}
          txn = await h.makeTransaction(txn_obj);
          txn_receipts = await h.waitUntilTransactionsMined(txn);

          let tokenBalanceAfter = await this.token.balanceOf(investor);
          let tokenDifference = tokenBalanceAfter - tokenBalanceBefore;
          let expectedTokenUnitsDifference = h.equivalentTokenBaseUnits(investment);
          
          tokenDifference.should.be.equal(expectedTokenUnitsDifference);
        });


        it('should create 200 tokens for the sender for 10 ether invested', async function() {
            
          let totalEtherInvested = await this.crowdsale.weiRaised.call()
          let tokenBalanceBefore = await this.token.balanceOf(investor);

          txn_obj = { from: investor, to: this.crowdsale.address, value: investment, gas: 2000000, gasPrice: 600000000 }
          txn = await h.makeTransaction(txn_obj);
          txn_receipt = await h.waitUntilTransactionsMined(txn);

          let tokenBalanceAfter = await this.token.balanceOf(investor);
          let tokenDifference = tokenBalanceAfter - tokenBalanceBefore;
          
          tokenDifference.should.be.equal(200 * (10 ** 18));

        });

        it('should own the proof presale token', async function() {

          let tokenOwner = await this.token.owner.call();
          let crowdsaleAddress = this.crowdsale.address;
          
          tokenOwner.should.be.equal(crowdsaleAddress)

          let tokenAddress = this.token.address;
          let crowdsaleToken = await this.crowdsale.token.call();

          tokenAddress.should.be.equal(crowdsaleToken)



        });

    });




    describe('Halted', function() {

        beforeEach( async function () {

          let wallet = '0xe2b3204f29ab45d5fd074ff02ade098fbc381d42';
          this.crowdsale = await Crowdsale.new(wallet, 10, 295257, 20);
          this.token = ProofPresaleToken.at(await this.crowdsale.token());
          this.owner = await this.crowdsale.owner.call();
          this.wallet = await this.crowdsale.wallet.call();
          this.cap = await this.crowdsale.cap.call();
          this.rate = await this.crowdsale.rate.call();
          this.etherCap = (this.cap) / (this.rate);
          this.receiver = accounts[1];
          this.hacker_1 = accounts[2];
          this.hacker_2 = accounts[3];

        });

      
      it('should not be ended if pre-sale funding objective is not reached', async function() {
        let ended = await this.crowdsale.hasEnded()
        ended.should.be.false;
      });

      it('should be ended if pre-sale funding objective is reached', async function() {
        txn_obj = {from: investor, to: this.crowdsale.address, value: this.etherCap, gas: 200000}
        tx = await h.makeTransaction(txn_obj);
        txn_receipt = await h.waitUntilTransactionsMined(tx);
        let ended = await this.crowdsale.hasEnded()
        ended.should.be.true;
      });

    });

});

    

contract('ProofPresaleToken', (accounts) => {

  const investment = ether(50);
  const firstInvestor = accounts[1];
  const secondInvestor = accounts[2];
  const receiver = accounts[3];
  const hacker = accounts[4];
  const hackerFriend = accounts[5];


  let token;
  let crowdsale;
  let params;
  let wallet;
  let owner;
  let units;


   describe('Token', function() {

      beforeEach(async function() {

        wallet = '0x8d39c80b2c4da233dab03e0640d7be5377379bfd';
        token = await ProofPresaleToken.new();
        owner = await token.owner.call();
        units = h.inBaseUnits(10);

      });

      it('should start with a totalSupply of 0', async function() {
        let totalSupply = await token.totalSupply();
        totalSupply = totalSupply.toNumber();
        totalSupply.should.be.equal(0);
      });

      it('should return mintingFinished false after construction', async function() {
        let mintingFinished = await token.mintingFinished();
        mintingFinished.should.be.false;
      });

      it('should be mintable by owner contract', async function() {

        units = h.inBaseUnits(10);

        let txn = await token.mint(receiver, units, {from: owner, gas: 1000000});
        let txn_receipt = await h.waitUntilTransactionsMined(txn.tx);
        let receiverBalance = await token.balanceOf(receiver);

        receiverBalance = receiverBalance.toNumber();
        receiverBalance.should.be.equal(units);

      });

      it('should not be mintable by non-owner contract', async function() {

        units = h.inBaseUnits(10);
        params = {from: hacker, gas: 100000}
        
        await h.expectInvalidOpcode(token.mint(receiver, units, params));

        hackerBalance = await token.balanceOf(hacker);
        hackerBalance = hackerBalance.toNumber();
        hackerBalance.should.be.equal(0);
        
      });

      it('should be transferable ', async function() {
        
        units = h.inBaseUnits(50);

        let txn_1 = await token.mint(firstInvestor, units, {from: owner, gas: 1000000});
        let txn_receipt_1 = await h.waitUntilTransactionsMined(txn_1.tx);

        let firstInvestorBalanceBefore = await token.balanceOf(firstInvestor);
        let secondInvestorBalanceBefore = await token.balanceOf(secondInvestor);
        
        let txn_2 = await token.transfer(secondInvestor, units, {from: firstInvestor, gas: 1000000 });
        let txn_receipts_2 = await h.waitUntilTransactionsMined(txn_2.tx);

        let firstInvestorBalanceAfter = await token.balanceOf(firstInvestor);
        let secondInvestorBalanceAfter = await token.balanceOf(secondInvestor);

        let firstInvestorBalanceDifference = firstInvestorBalanceAfter - firstInvestorBalanceBefore;
        let secondInvestorBalanceDifference = secondInvestorBalanceAfter - secondInvestorBalanceBefore;

        firstInvestorBalanceDifference.should.be.equal(-units);
        secondInvestorBalanceDifference.should.be.equal(units);


      });

      it('should not allow to transfer more than balance', async function() {
        
        let investorBalance = await token.balanceOf(firstInvestor);
        let txn = await token.mint(firstInvestor, investorBalance+1, {from: owner, gas: 1000000});
        let txn_receipt = await h.waitUntilTransactionsMined(txn.tx);

        params = { from: firstInvestor, gas: 100000}
        await h.expectInvalidOpcode(token.transfer(secondInvestor, units, params));

      });

   });

  });