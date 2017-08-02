pragma solidity ^0.4.11;


import './ERC20.sol';
import './SafeMath.sol';
import './Ownable.sol';


/**
 * Standard ERC23 token
 * 
 * Work in Progess. Potential ERC23 version of the ProofPresaleToken.
 * TODO : 
 * 1. refactor this whole thing
 * 
 */



contract ProofPresaleToken is ERC20, Ownable {

  using SafeMath for uint256;

  mapping(address => uint) balances;
  mapping (address => mapping (address => uint)) allowed;

  string public name = "Proof Presale Token";
  string public symbol = "PROOFP";
  uint8 public decimals = 18;
  bool public mintingFinished = false;

  event Mint(address indexed to, uint256 amount);
  event MintFinished();

  function ProofPresaleToken() {}

  function payable () {
    revert();
  }

  function isContract(address _address) private returns (bool is_contract) {
      uint length;
      assembly {
          length := extcodesize(_address);
      }
      if(length > 0) {
          return true;
      } else {
          return false;
      }
  }

  function transfer(address _to, uint _value) returns (bool success) {

    balances[msg.sender] = balances[msg.sender].sub(_value);
    balances[_to] = balances[_to].add(_value);

    Transfer(msg.sender, _to, _value);
    return true;
  }

  function transfer(address _to, uint256 _value, bytes _data) returns (bool success) {
      
  }

  function transferFrom(address _from, address _to, uint _value) returns (bool success) {

    if(isContract(_to)) {
        balances[msg.sender] -= _value;
        balances[_to] += -value;
        TokenReceiver receiver = TokenReceiver(_to)
        receiver.tokenFallback(msg.sender, _value, _data);
        Transfer(msg.sender, _to, _value, _data);
        return true;
    }
  }

  function balanceOf(address _owner) constant returns (uint balance) {
    return balances[_owner];
  }

  function approve(address _spender, uint _value) returns (bool success) {
    allowed[msg.sender][_spender] = _value;
    Approval(msg.sender, _spender, _value);
    return true;
  }

  function allowance(address _owner, address _spender) constant returns (uint remaining) {
    return allowed[_owner][_spender];
  }
    
    
  modifier canMint() {
    require(!mintingFinished);
    _;
  }

  /**
   * Function to mint tokens
   * @param _to The address that will recieve the minted tokens.
   * @param _amount The amount of tokens to mint.
   * @return A boolean that indicates if the operation was successful.
   */

  function mint(address _to, uint256 _amount) onlyOwner canMint returns (bool) {
    totalSupply = totalSupply.add(_amount);
    balances[_to] = balances[_to].add(_amount);
    Mint(_to, _amount);
    return true;
  }

  /**
   * @dev Function to stop minting new tokens.
   * @return True if the operation was successful.
   */
  function finishMinting() onlyOwner returns (bool) {
    mintingFinished = true;
    MintFinished();
    return true;
  }

  
  
}