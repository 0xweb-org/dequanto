// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "openzeppelin-contracts/contracts/token/ERC20/ERC20.sol";
import "openzeppelin-contracts/contracts/access/Ownable.sol";

contract SOMEToken is ERC20, Ownable {
    uint256 public immutable percentageBase;
    address public taxReceiver;
    address public rewardsPool;

    mapping(address => bool) public blacklisted;
    mapping(address => bool) public isDexPair;
    mapping(address => bool) public isSOMEContract;
    mapping(address => bool) public disabledSOMEAllowance;
    mapping(address => uint256) public lastSwap;

    bool public holdersPurchaseEnabled;

    uint256 public sellTax;
    uint256 public maxTx;
    uint256 public cooldown;
    uint256 public maxWallet;

    uint256 public sellTaxUpperLimit;
    uint256 public maxTxLowerLimit;
    uint256 public cooldownUpperLimit;
    uint256 public maxWalletLowerLimit;


    modifier notBlacklisted(address _address) {
        require(!blacklisted[_address], "BLACKLISTED");
        _;
    }

    constructor(
        address _rewardsPool,
        address _teamWallet,
        address _taxReceiver,
        uint256 _totalSupply,
        uint256 _sellTaxUpperLimit,
        uint256 _maxTxLowerLimit,
        uint256 _cooldownUpperLimit,
        uint256 _maxWalletLowerLimit
    ) ERC20("SOME TOKEN", "$SOME") Ownable() {
        isSOMEContract[_rewardsPool] = true;
        isSOMEContract[_teamWallet] = true;
        isSOMEContract[_taxReceiver] = true;

        uint256 teamWalletAlloc = 504300 ether;
        uint256 rewardsPoolAlloc = _totalSupply - teamWalletAlloc;

        _mint(_teamWallet, teamWalletAlloc);
        _mint(_rewardsPool, rewardsPoolAlloc);

        percentageBase = 100_000;
        rewardsPool = _rewardsPool;
        taxReceiver = _taxReceiver;

        holdersPurchaseEnabled = true;

        sellTaxUpperLimit = _sellTaxUpperLimit;
        maxTxLowerLimit = _maxTxLowerLimit;
        cooldownUpperLimit = _cooldownUpperLimit;
        maxWalletLowerLimit = _maxWalletLowerLimit;
    }

    function enableSOMEAllowance() external {
        disabledSOMEAllowance[msg.sender] = false;
    }

    function disableSOMEAllowance() external {
        disabledSOMEAllowance[msg.sender] = true;
    }

    function increaseRewardsPoolBalance(uint256 _amount) external {
        require(msg.sender == rewardsPool, "SOMEToken: ONLY REWARDS POOL");
        _mint(msg.sender, _amount);
    }

    function blacklistWallet(address _address) external onlyOwner {
        blacklisted[_address] = true;
    }

    function unBlacklistWallet(address _address) external onlyOwner {
        blacklisted[_address] = false;
    }

    function setDexPair(address _dexPair) external onlyOwner {
        isDexPair[_dexPair] = true;
    }

    function removeDexPair(address _dexPair) external onlyOwner {
        isDexPair[_dexPair] = false;
    }

    function setSOMEContract(address _SOMEContract) external onlyOwner {
        isSOMEContract[_SOMEContract] = true;
    }

    function removeSOMEContract(address _SOMEContract) external onlyOwner {
        isSOMEContract[_SOMEContract] = false;
    }

    function disableHoldersPurchase() external onlyOwner {
        holdersPurchaseEnabled = false;
    }

    function setSellTax(uint256 _sellTax) external onlyOwner {
        require(_sellTax <= sellTaxUpperLimit, "SOMEToken: SELL TAX TOO HIGH");
        sellTax = _sellTax;
    }

    function setMaxTx(uint256 _maxTx) external onlyOwner {
        require(_maxTx >= maxTxLowerLimit, "SOMEToken: MAX TX TOO LOW");
        maxTx = _maxTx;
    }

    function setCooldown(uint256 _cooldown) external onlyOwner {
        require(_cooldown <= cooldownUpperLimit, "SOMEToken: COOLDOWN TOO HIGH");
        cooldown = _cooldown;
    }

    function setMaxWallet(uint256 _maxWallet) external onlyOwner {
        require(_maxWallet >= maxWalletLowerLimit, "SOMEToken: MAX WALLET TOO LOW");
        maxWallet = _maxWallet;
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal override {
        if (
            !isSOMEContract[from] &&
            !isSOMEContract[to] &&
            from != address(0) &&
            to != address(0)
        ) {
            require(amount <= maxTx, "SOMEToken: MAX TX AMOUNT EXCEEDED");
        }

        if (
            !isDexPair[to] &&
            !isSOMEContract[to]
        )
            require(balanceOf(to) + amount <= maxWallet, "SOMEToken: MAX WALLET AMOUNT EXCEEDED");

        if (
            isDexPair[from] &&
            !isDexPair[to] &&
            !isSOMEContract[to]
        ) {
            require(block.timestamp - lastSwap[to] >= cooldown, "SOMEToken: COOLDOWN NOT MET");
            lastSwap[to] = block.timestamp;
        } else if (
            isDexPair[to] &&
            !isDexPair[from] &&
            !isSOMEContract[from]
        ) {
            require(block.timestamp - lastSwap[from] >= cooldown, "SOMEToken: COOLDOWN NOT MET");
            lastSwap[from] = block.timestamp;
        }
        super._beforeTokenTransfer(from, to, amount);
    }

    // Overwrite transfer function to apply holders purchase event and sell tax.
    function _transfer(
        address from,
        address to,
        uint256 amount
    ) internal override notBlacklisted(from) notBlacklisted(to) {
        // Holders Purchase Event
        if (holdersPurchaseEnabled && isDexPair[from]) {
            require(balanceOf(to) >= 1, "SOMEToken: BALANCE REQUIRED TO PURCHASE");
        }

        // Sell tax
        if (
            isDexPair[to] &&
            sellTax > 0 &&
            sellTax < percentageBase &&
            !isSOMEContract[from]
        ) {
            uint256 taxedAmount = amount * sellTax / percentageBase;
            uint256 leftOver = amount - taxedAmount;
            super._transfer(from, taxReceiver, taxedAmount);
            super._transfer(from, to, leftOver);
        } else {
            super._transfer(from, to, amount);
        }
    }

    // Used for frictionless interactions with SOMEtopia.
    // Can be turned off by calling "disableSOMEAllowance".
    // Can be turned back on by calling "enableSOMEAllowance".
    function _spendAllowance(
        address owner,
        address spender,
        uint256 amount
    ) internal override {
        if (
            isSOMEContract[spender] &&
            !disabledSOMEAllowance[owner]
        ) {
            return;
        }
        super._spendAllowance(owner, spender, amount);
    }
}
