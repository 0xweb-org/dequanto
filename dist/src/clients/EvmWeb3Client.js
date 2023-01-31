"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EvmWeb3Client = void 0;
const Config_1 = require("@dequanto/Config");
const _require_1 = require("@dequanto/utils/$require");
const EthWeb3Client_1 = require("./EthWeb3Client");
class EvmWeb3Client extends EthWeb3Client_1.EthWeb3Client {
    constructor(options) {
        super(resolveOptions(options));
    }
}
exports.EvmWeb3Client = EvmWeb3Client;
function resolveOptions(options) {
    _require_1.$require.notNull(options?.platform, 'Platform is required when generic evm client is used');
    let cfg = Config_1.config.web3[options.platform];
    if (cfg) {
        for (let key in cfg) {
            if (options[key] == null) {
                options[key] = cfg[key];
            }
        }
    }
    _require_1.$require.Numeric(options.chainId, `ChainID should be numeric. Got ${options.chainId}`);
    return options;
}
