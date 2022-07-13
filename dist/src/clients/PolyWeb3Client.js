"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PolyWeb3Client = void 0;
const _config_1 = require("@dequanto/utils/$config");
const Web3Client_1 = require("./Web3Client");
const ClientEndpoints_1 = require("./utils/ClientEndpoints");
const _bigint_1 = require("@dequanto/utils/$bigint");
class PolyWeb3Client extends Web3Client_1.Web3Client {
    constructor(opts) {
        super({
            ...(opts ?? {}),
            endpoints: ClientEndpoints_1.ClientEndpoints.filterEndpoints(_config_1.$config.get('web3.polygon.endpoints'), opts)
        });
        this.platform = 'polygon';
        this.chainId = this.options.chainId ?? 137;
        this.chainToken = 'MATIC';
        this.defaultGasLimit = 2000000;
    }
    async getGasPrice() {
        let { price, base, priority } = await super.getGasPrice();
        price = _bigint_1.$bigint.min(price, _bigint_1.$bigint.toWei(60, _bigint_1.$bigint.GWEI_DECIMALS));
        // Use minimum gas price as 15 gwei (network sometimes returns too low fees)
        let gasPrice = _bigint_1.$bigint.max(price, _bigint_1.$bigint.toWei(28, _bigint_1.$bigint.GWEI_DECIMALS));
        return {
            price: gasPrice,
            base: gasPrice,
            priority: gasPrice
        };
    }
}
exports.PolyWeb3Client = PolyWeb3Client;
