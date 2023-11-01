pragma solidity ^0.8.20;

import { ERC20 } from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract AnyERC20 is ERC20 {

    constructor (
        string memory name_,
        string memory symbol_,
        uint256 totalSupply_
    ) ERC20(name_, symbol_) {

        _mint(msg.sender, totalSupply_);
    }
}
