
abstract contract Initializable {
    bool private _initialized = true;  // slot 0
    bool private _initializing = true; // slot 0
}

abstract contract ContextUpgradeable is Initializable {
    uint256 private __gap = 0x12; // slot 1
}

contract ERC20Upgradeable is Initializable, ContextUpgradeable {
    mapping(address => uint256) private _balances;                          // slot 2
    mapping(address => mapping(address => uint256)) private _allowances;    // slot 3
    uint256 private _totalSupply = 0x21;    // slot 4
    uint256 private _name = 0x22;           // slot 5
    uint256 private _symbol = 0x23;         // slot 6
    uint256 private __gap = 0x24;           // slot 7
}

abstract contract ERC20BurnableUpgradeable is Initializable, ContextUpgradeable, ERC20Upgradeable {
    uint256 private __gap = 0x31; // slot 8
}

contract ERC20PresetFixedSupplyUpgradeable is Initializable, ERC20BurnableUpgradeable {
    uint256 private __gap = 0x41; // slot 9
}

abstract contract OwnableUpgradeable is Initializable, ContextUpgradeable {
    uint256 private _owner = 0x51;  // slot 10
    uint256 private __gap = 0x52;   // slot 11
}

contract AlphaKlimaSimple is ERC20PresetFixedSupplyUpgradeable, OwnableUpgradeable {


}
