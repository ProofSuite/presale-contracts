pragma solidity ^0.4.11;

import './ProofPresaleToken.sol';
import './SafeMath.sol';
import './Pausable.sol';

/**
 * @title Crowdsale 
 * @dev Crowdsale is a base contract for managing a token crowdsale.
 * Crowdsales have a start and end block, where investors can make
 * token purchases and the crowdsale will assign them tokens based
 * on a token per ETH rate. Funds collected are forwarded to a wallet 
 * as they arrive.
 */
 
contract Crowdsale is Pausable {
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

  uint256 public tokenDecimals;

  bool private rentrancy_lock = false;

  

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
   * @param _tokenDecimals is the number of decimals - base units - for the presale token
   */ 

  function Crowdsale(address _wallet, uint256 _minInvestment, uint256 _cap, uint256 _rate, uint256 _tokenDecimals) {
    
    require(_wallet != 0x0);
    require(_minInvestment >= 0);
    require(_tokenDecimals >= 0);
    require(_cap > 0);

    token = createTokenContract();
    wallet = _wallet;
    rate = _rate;
    tokenDecimals = _tokenDecimals;
    minInvestment = _minInvestment;  //minimum investment in wei  (=10 ether)
    cap = _cap * (10**18);  //cap in tokens base units (=295257 tokens)
  }

  // creates the token to be sold. 
  function createTokenContract() internal returns (ProofPresaleToken) {
    return new ProofPresaleToken();
  }


  // fallback function to buy tokens
  function () payable {
    buyTokens(msg.sender);
  }

  // low level token purchase function
  function buyTokens(address beneficiary) payable whenNotPaused nonReentrant {
    require(beneficiary != 0x0);
    require(validPurchase());


    uint256 weiAmount = msg.value;
    // compute amount of tokens created
    uint256 tokens = weiAmount.mul(rate);

    // update weiRaised
    weiRaised = weiRaised.add(weiAmount);

    token.mint(beneficiary, tokens);
    TokenPurchase(msg.sender, beneficiary, weiAmount, tokens);
    forwardFunds();
  }

  // send ether to the fund collection wallet
  // override to create custom fund forwarding mechanisms
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


  // @return true if crowdsale event has ended
  function hasEnded() public constant returns (bool) {
    bool capReached = (weiRaised.mul(rate) >= cap);
    return capReached;
  }
    
  /**
   * 
   * @author Remco Bloemen <remco@2π.com>
   * @dev Prevents a contract from calling itself, directly or indirectly.
   * @notice If you mark a function `nonReentrant`, you should also
   * mark it `external`. Calling one nonReentrant function from
   * another is not supported. Instead, you can implement a
   * `private` function doing the actual work, and a `external`
   * wrapper marked as `nonReentrant`.
   */
  
  // TODO need to set nonReentrant modifier where necessary

  modifier nonReentrant() {
    require(!rentrancy_lock);
    rentrancy_lock = true;
    _;
    rentrancy_lock = false;
  }


}
