"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EthWeb3Client = void 0;
const _config_1 = require("@dequanto/utils/$config");
const Web3Client_1 = require("./Web3Client");
const ClientEndpoints_1 = require("./utils/ClientEndpoints");
class EthWeb3Client extends Web3Client_1.Web3Client {
    constructor(opts) {
        super({
            ...(opts ?? {}),
            endpoints: ClientEndpoints_1.ClientEndpoints.filterEndpoints(_config_1.$config.get('web3.eth.endpoints'), opts)
        });
        this.platform = 'eth';
        this.chainId = this.options.chainId ?? 1;
        this.chainToken = 'ETH';
        this.TIMEOUT = 15 * 60 * 1000;
        this.defaultGasLimit = 2000000;
    }
}
exports.EthWeb3Client = EthWeb3Client;
