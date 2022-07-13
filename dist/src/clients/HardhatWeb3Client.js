"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HardhatWeb3Client = void 0;
const _config_1 = require("@dequanto/utils/$config");
const Web3Client_1 = require("./Web3Client");
const ClientEndpoints_1 = require("./utils/ClientEndpoints");
// https://hardhat.org/hardhat-network/reference/
class HardhatWeb3Client extends Web3Client_1.Web3Client {
    constructor(opts) {
        super({
            ...(opts ?? {}),
            endpoints: ClientEndpoints_1.ClientEndpoints.filterEndpoints(_config_1.$config.get('web3.hardhat.endpoints'), opts)
        });
        this.platform = 'hardhat';
        this.chainId = this.options.chainId ?? 1337;
        this.chainToken = 'ETH';
        this.TIMEOUT = 5 * 60 * 1000;
        this.defaultGasLimit = 2000000;
    }
}
exports.HardhatWeb3Client = HardhatWeb3Client;
