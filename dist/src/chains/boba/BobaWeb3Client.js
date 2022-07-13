"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BobaWeb3Client = void 0;
const _config_1 = require("@dequanto/utils/$config");
const Web3Client_1 = require("@dequanto/clients/Web3Client");
const ClientEndpoints_1 = require("@dequanto/clients/utils/ClientEndpoints");
class BobaWeb3Client extends Web3Client_1.Web3Client {
    constructor(opts) {
        super({
            ...(opts ?? {}),
            endpoints: ClientEndpoints_1.ClientEndpoints.filterEndpoints(_config_1.$config.get('web3.boba.endpoints'), opts)
        });
        this.platform = 'boba';
        this.chainId = this.options.chainId ?? 288;
        this.chainToken = 'ETH';
        this.defaultGasLimit = 500000;
    }
}
exports.BobaWeb3Client = BobaWeb3Client;
