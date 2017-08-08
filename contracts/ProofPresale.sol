pragma solidity ^0.4.11;

import './SafeMath.sol';
import './Pausable.sol';
import './ProofPresaleToken.sol';


/**
 * @title ProofPresale 
 * ProofPresale allows investors to make
 * token purchases and assigns them tokens based
 * on a token per ETH rate. Funds collected are forwarded to a wallet 
 * as they arrive.
 */
 
contract ProofPresale is Pausable {
  using SafeMath for uint256;

  // The token being sold
  ProofPresaleToken public token;

  // address where funds are collected
  address public wallet;

  // amount of raised money in wei
  uint256 public weiRaised;

  // cap above which the crowdsale is ended
  uint256 public cap;

  uint256 public minInvestment;

  uint256 public rate;

  bool public isFinalized;

  string public contactInformation;


  /**
   * event for token purchase logging
   * @param purchaser who paid for the tokens
   * @param beneficiary who got the tokens
   * @param value weis paid for purchase
   * @param amount amount of tokens purchased
   */ 
  event TokenPurchase(address indexed purchaser, address indexed beneficiary, uint256 value, uint256 amount);

  /**
   * event for signaling finished crowdsale
   */
  event Finalized();



  /**
   * crowdsale constructor
   * @param _wallet who receives invested ether
   * @param _minInvestment is the minimum amount of ether that can be sent to the contract
   * @param _cap above which the crowdsale is closed
   * @param _rate is the amounts of tokens given for 1 ether
   */ 

  function ProofPresale(address _wallet, uint256 _minInvestment, uint256 _cap, uint256 _rate) {
    
    require(_wallet != 0x0);
    require(_minInvestment >= 0);
    require(_cap > 0);

    token = createTokenContract();
    wallet = _wallet;
    rate = _rate;
    minInvestment = _minInvestment;  //minimum investment in wei  (=10 ether)
    cap = _cap * (10**18);  //cap in tokens base units (=295257 tokens)
  }

  // creates presale token
  function createTokenContract() internal returns (ProofPresaleToken) {
    return new ProofPresaleToken();
  }


  // fallback function to buy tokens
  function () payable {
    buyTokens(msg.sender);
  }

  
  /**
   * Low level token purchse function
   * @param beneficiary will recieve the tokens.
   */
  function buyTokens(address beneficiary) payable whenNotPaused {
    require(beneficiary != 0x0);
    require(validPurchase());


    uint256 weiAmount = msg.value;
    // update weiRaised
    weiRaised = weiRaised.add(weiAmount);
    // compute amount of tokens created
    uint256 tokens = weiAmount.mul(rate);

    token.mint(beneficiary, tokens);
    TokenPurchase(msg.sender, beneficiary, weiAmount, tokens);
    forwardFunds();
  }

  // send ether to the fund collection wallet
  function forwardFunds() internal {
    wallet.transfer(msg.value);
  }

  // return true if the transaction can buy tokens
  function validPurchase() internal constant returns (bool) {

    uint256 weiAmount = weiRaised.add(msg.value);
    bool notSmallAmount = msg.value >= minInvestment;
    bool withinCap = weiAmount.mul(rate) <= cap;

    return (notSmallAmount && withinCap);
  }

  //allow owner to finalize the presale once the presale is ended
  function finalize() onlyOwner {
    require(!isFinalized);
    require(hasEnded());

    token.finishMinting();
    Finalized();

    isFinalized = true;
  }


  function setContactInformation(string info) onlyOwner {
      contactInformation = info;
  }


  //return true if crowdsale event has ended
  function hasEnded() public constant returns (bool) {
    bool capReached = (weiRaised.mul(rate) >= cap);
    return capReached;
  }
    


}
