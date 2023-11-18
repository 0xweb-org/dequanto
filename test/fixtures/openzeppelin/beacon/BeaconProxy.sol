pragma solidity ^0.8.20;


import { BeaconProxy as Proxy } from '@openzeppelin/contracts/proxy/beacon/BeaconProxy.sol';

contract BeaconProxy is Proxy {

    constructor(address beacon, bytes memory data) Proxy(beacon, data) {

    }
}
