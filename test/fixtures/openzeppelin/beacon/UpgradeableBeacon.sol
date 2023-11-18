pragma solidity ^0.8.20;

import { UpgradeableBeacon } from '@openzeppelin/contracts/proxy/beacon/UpgradeableBeacon.sol';


contract Beacon is UpgradeableBeacon {

    constructor(address implementation_) UpgradeableBeacon(implementation_) {

    }
}
