// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@gnosis.pm/safe-contracts/contracts/libraries/MultiSendCallOnly.sol";

// Test doubles for the Roles -> avatar boundary, not the Roles permission engine.
contract ZodiacAvatarFixture {
    address immutable module;
    constructor() { module = msg.sender; }
    receive() external payable {}
    function execute(address to, uint256 value, bytes calldata data, uint8 operation) external returns (bool success) {
        require(msg.sender == module, "module");
        if (operation == 0) {
            (success,) = to.call{value: value}(data);
        } else {
            (success,) = to.delegatecall(data);
        }
    }
}

contract ZodiacTargetFixture {
    uint256 public total;
    address public lastSender;
    function add(uint256 amount) external payable {
        require(amount != 999, "target failure");
        total += amount;
        lastSender = msg.sender;
    }
}

contract ZodiacRolesFixture {
    ZodiacAvatarFixture public avatar = new ZodiacAvatarFixture();
    ZodiacTargetFixture public target = new ZodiacTargetFixture();
    MultiSendCallOnly public multiSend = new MultiSendCallOnly();
    address public operator = msg.sender;
    address public secondOperator;
    constructor(address otherOperator) { secondOperator = otherOperator; }
    uint256 public executions;
    function execTransactionWithRole(address to, uint256 value, bytes calldata data, uint8 operation, bytes32 roleKey, bool shouldRevert) external returns (bool success) {
        require(msg.sender == operator || msg.sender == secondOperator, "operator");
        require(roleKey == bytes32(uint256(1)) || roleKey == bytes32(uint256(2)), "role");
        executions++;
        success = avatar.execute(to, value, data, operation);
        if (shouldRevert) { require(success, "inner failure"); }
    }
}
