pragma solidity ^0.8.2;

import { FooNestedModel } from './FooNestedModel.sol';

contract Foo {
    string public name;

    FooNestedModel.User user = FooNestedModel.User(address(1), 50);

    event Updated (string newName);
    event Updated2 (string newName);

    constructor(string memory _name) {
        name = _name;
    }

    function setName(string memory _name) public {
        name = _name;
        emit Updated(name);
    }
    function setName2(string memory _name) public {
        name = _name;
        emit Updated2(name);
    }

    function getName () public view returns (string memory) {
        return name;
    }


    function someEcho () public pure returns (uint8) {
        return 0;
    }
    function someEcho (uint8 val) public pure returns (uint8) {
        return val;
    }


    event IndexedNormal (uint256 indexed valueA, uint256 valueB);
    event IndexedWithOffset (uint256 valueA, uint256 indexed valueB);

    function shouldEmitIndexedNormal (uint256 valueA, uint256 valueB) public {
        emit IndexedNormal(valueA, valueB);
    }

    function shouldEmitIndexedWithOffset (uint256 valueA, uint256 valueB) public {
        emit IndexedWithOffset(valueA, valueB);
    }
}
