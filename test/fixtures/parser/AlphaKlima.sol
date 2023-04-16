
abstract contract Initializable {
    bool private _initialized;
    bool private _initializing;
}

abstract contract ContextUpgradeable is Initializable {
    uint256[50] private __gap;
}

contract ERC20Upgradeable is Initializable, ContextUpgradeable {
    mapping(address => uint256) private _balances;
    mapping(address => mapping(address => uint256)) private _allowances;
    uint256 private _totalSupply;
    string private _name;
    string private _symbol;
    uint256[45] private __gap;
}

abstract contract ERC20BurnableUpgradeable is Initializable, ContextUpgradeable, ERC20Upgradeable {
    uint256[50] private __gap;
}

contract ERC20PresetFixedSupplyUpgradeable is Initializable, ERC20BurnableUpgradeable {
    uint256[50] private __gap;
}

abstract contract OwnableUpgradeable is Initializable, ContextUpgradeable {
    address private _owner;
    uint256[49] private __gap;
}

contract AlphaKlimaUpgradeable is ERC20PresetFixedSupplyUpgradeable, OwnableUpgradeable {


}
