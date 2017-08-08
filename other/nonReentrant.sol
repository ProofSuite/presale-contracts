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

  modifier nonReentrant() {
    require(!rentrancy_lock);
    rentrancy_lock = true;
    _;
    rentrancy_lock = false;
  }
