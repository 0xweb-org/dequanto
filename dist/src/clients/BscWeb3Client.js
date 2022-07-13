"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BscWeb3Client = void 0;
const _config_1 = require("@dequanto/utils/$config");
const Web3Client_1 = require("./Web3Client");
const ClientEndpoints_1 = require("./utils/ClientEndpoints");
class BscWeb3Client extends Web3Client_1.Web3Client {
    constructor(opts) {
        super({
            ...(opts ?? {}),
            endpoints: ClientEndpoints_1.ClientEndpoints.filterEndpoints(_config_1.$config.get('web3.bsc.endpoints'), opts)
        });
        this.platform = 'bsc';
        this.chainId = this.options.chainId ?? 56;
        this.chainToken = 'BNB';
        this.defaultGasLimit = 2000000;
    }
}
exports.BscWeb3Client = BscWeb3Client;
