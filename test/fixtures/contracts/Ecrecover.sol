pragma solidity ^0.8.2;

import "hardhat/console.sol";

contract Ecrecover {

    constructor() {

    }


    function isValid (address user, uint256 amount, uint8 nonce, uint8 v, bytes32 r, bytes32 s, address signer) public view returns (bool) {

        bytes memory hashStructRaw = abi.encode(
            user,
            amount,
            nonce
        );

        bytes32 hashStruct = keccak256(hashStructRaw);

        console.log("[hardhat] >");
        console.logBytes(abi.encodePacked(hashStruct));


        address signerRecovered = ecrecover(hashStruct, v, r, s);
        console.log("[hardhat] signerRecovered", signerRecovered);
        return signerRecovered == signer;
    }
}
