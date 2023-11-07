pragma solidity ^0.8.2;


import { ProxyAdmin as Admin } from '@openzeppelin/contracts/proxy/transparent/ProxyAdmin.sol';

contract ProxyAdmin is Admin {

    constructor() Admin() {

    }
}
