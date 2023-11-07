contract DeploymentsFoo {
    uint256 public _value = 2;

    function initialize () external {
        _value = 3;
    }
    function getValue () view external returns (uint256) {
        return _value * 2;
    }

    function setValue (uint256 value) external {
        _value = value;
    }
}
