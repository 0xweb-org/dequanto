import { InitializableV4_9 } from "../openzeppelin/InitializableV4_9.sol";
import { InitializableV5_0 } from "../openzeppelin/InitializableV5_0.sol";

contract FooInits_v4_9_1 is InitializableV4_9 {
    uint256 public value = 2;

    function initialize (uint256 val) external reinitializer(1) {
        value = val;
    }
}

contract FooInits_v4_9_2 is InitializableV4_9 {
    uint256 public value = 2;

    function initialize (uint256 val) external reinitializer(2) {
        value = val;
    }
    function initializeV2 (uint256 val) external reinitializer(2) {
        value = val;
    }
}

contract FooInits_v4_9_2_raw is InitializableV4_9 {
    uint256 public value = 2;

    function initialize (uint256 val) external reinitializer(2) {
        value = val;
    }
    function initializeV2 (uint256 val) external reinitializer(2) {
        value = val;
    }
    function addOne () external view returns (uint256) {
        return value + 1;
    }
}


contract FooInits_v5_0_1 is InitializableV5_0 {
    uint256 public value = 2;

    function initialize (uint256 val) external reinitializer(1) {
        value = val;
    }
}

contract FooInits_v5_0_2 is InitializableV5_0 {
    uint256 public value = 2;

    function initialize (uint256 val) external reinitializer(2) {
        value = val;
    }
    function initializeV2 (uint256 val) external reinitializer(2) {
        value = val;
    }
}

/** No storage migration - simple implementation upgrade */
contract FooInits_v5_0_2_raw is InitializableV5_0 {
    uint256 public value = 2;

    function initialize (uint256 val) external reinitializer(2) {
        value = val;
    }
    function initializeV2 (uint256 val) external reinitializer(2) {
        value = val;
    }
    function addOne () external view returns (uint256) {
        return value + 1;
    }
}

contract ImmutablesInit {
    uint256 public immutable value;
    constructor (uint256 val) {
        value = val;
    }
}
