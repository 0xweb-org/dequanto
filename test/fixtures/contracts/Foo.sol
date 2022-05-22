pragma solidity ^0.8.2;

contract Foo {
    string public name;
    event Updated (string newName);

    constructor(string memory _name) {
        name = _name;
    }

    function setName(string memory _name) public {
        name = _name;
        emit Updated(name);
    }

    function getName () public view returns (string memory) {
        return name;
    }
}
