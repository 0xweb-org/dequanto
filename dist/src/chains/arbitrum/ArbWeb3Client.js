"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArbWeb3Client = void 0;
const _config_1 = require("@dequanto/utils/$config");
const Web3Client_1 = require("@dequanto/clients/Web3Client");
const ClientEndpoints_1 = require("@dequanto/clients/utils/ClientEndpoints");
class ArbWeb3Client extends Web3Client_1.Web3Client {
    constructor(opts) {
        super({
            ...(opts ?? {}),
            endpoints: ClientEndpoints_1.ClientEndpoints.filterEndpoints(_config_1.$config.get('web3.arbitrum.endpoints'), opts)
        });
        this.platform = 'arbitrum';
        this.chainId = this.options.chainId ?? 42161;
        this.chainToken = 'ETH';
        this.TIMEOUT = 15 * 60 * 1000;
        this.defaultGasLimit = 2000000;
    }
}
exports.ArbWeb3Client = ArbWeb3Client;
