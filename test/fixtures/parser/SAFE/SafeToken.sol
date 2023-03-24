// SPDX-License-Identifier: LGPL-3.0-only
pragma solidity >=0.8.0 <0.9.0;

import "./vendor/@openzeppelin/contracts/access/Ownable.sol";
import "./vendor/@openzeppelin/contracts/security/Pausable.sol";
import "./vendor/@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./TokenRescuer.sol";

/// @title Safe Token contract
/// @author Richard Meissner - @rmeissner
contract SafeToken is ERC20, Pausable, Ownable, TokenRescuer {
    /// @dev Will mint 1 billion tokens to the owner and pause the contract
    constructor(address owner) ERC20("Safe Token", "SAFE") {
        // Transfer ownership immediately
        _transferOwnership(owner);
        // "ether" is used here to get 18 decimals
        _mint(owner, 1_000_000_000 ether);
        // Contract is paused by default
        // This has to be done after _mint, else minting will fail
        _pause();
    }

    /// @notice Unpauses all token transfers.
    /// @dev See {Pausable-_unpause}
    /// Requirements: caller must be the owner
    function unpause() public virtual onlyOwner {
        require(paused(), "SafeToken: token is not paused");
        _unpause();
    }

    /// @dev See {ERC20-_beforeTokenTransfer}
    /// Requirements: the contract must not be paused OR transfer must be initiated by owner
    /// @param from The account that is sending the tokens
    /// @param to The account that should receive the tokens
    /// @param amount Amount of tokens that should be transferred
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal virtual override {
        super._beforeTokenTransfer(from, to, amount);

        require(to != address(this), "SafeToken: cannot transfer tokens to token contract");
        // Token transfers are only possible if the contract is not paused
        // OR if triggered by the owner of the contract
        require(!paused() || owner() == _msgSender(), "SafeToken: token transfer while paused");
    }
}
