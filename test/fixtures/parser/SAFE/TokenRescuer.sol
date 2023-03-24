// SPDX-License-Identifier: LGPL-3.0-only
pragma solidity >=0.8.0 <0.9.0;

import "./vendor/@openzeppelin/contracts/access/Ownable.sol";
import "./vendor/@openzeppelin/contracts/token/ERC20/IERC20.sol";

/// @title Token Rescuer contract
/// @author Richard Meissner - @rmeissner
contract TokenRescuer is Ownable {
    /// @param token Token that should be rescued
    /// @param beneficiary The account that should receive the tokens
    /// @param amount Amount of tokens that should be rescued
    function _beforeTokenRescue(
        IERC20 token,
        address beneficiary,
        uint256 amount
    ) internal virtual {}

    /// @notice Transfer all tokens with address `token` owned by this contract to `beneficiary`.
    /// @dev This can only be called by the owner of the contract
    /// @param token The token that should be rescued
    /// @param beneficiary The account that should receive the tokens.
    function rescueToken(IERC20 token, address beneficiary) external onlyOwner {
        uint256 balanceToRescue = token.balanceOf(address(this));
        require(balanceToRescue > 0, "TokenRescuer: No tokens to rescue");
        _beforeTokenRescue(token, beneficiary, balanceToRescue);
        require(token.transfer(beneficiary, balanceToRescue), "TokenRescuer: Could not rescue token");
    }
}
