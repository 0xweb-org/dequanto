"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArbWeb3Client = void 0;
const _config_1 = require("@dequanto/utils/$config");
const tx_1 = require("@ethereumjs/tx");
const common_1 = __importDefault(require("@ethereumjs/common"));
const Web3Client_1 = require("@dequanto/clients/Web3Client");
const ClientEndpoints_1 = require("@dequanto/clients/utils/ClientEndpoints");
class ArbWeb3Client extends Web3Client_1.Web3Client {
    constructor(opts) {
        super(ClientEndpoints_1.ClientEndpoints.filterEndpoints(_config_1.$config.get('web3.arbitrum.endpoints'), opts));
        this.platform = 'arbitrum';
        this.chainId = 42161;
        this.chainToken = 'ETH';
        this.TIMEOUT = 15 * 60 * 1000;
        this.defaultGasLimit = 2000000;
    }
    sign(txData, privateKey) {
        const key = Buffer.from(privateKey, 'hex');
        const common = new common_1.default({
            chain: 42161,
            customChains: [{
                    chainId: 42161,
                    networkId: 42161,
                    url: 'https://arb1.arbitrum.io/rpc',
                    name: 'aeth',
                    comment: '',
                    hardforks: [{ name: 'mainnet' }]
                }]
        });
        const tx = tx_1.Transaction.fromTxData(txData, { common });
        const signedTx = tx.sign(key);
        return signedTx.serialize();
    }
}
exports.ArbWeb3Client = ArbWeb3Client;
