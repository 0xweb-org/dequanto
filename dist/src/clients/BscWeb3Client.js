"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BscWeb3Client = void 0;
const _config_1 = require("@dequanto/utils/$config");
const tx_1 = require("@ethereumjs/tx");
const common_1 = __importDefault(require("@ethereumjs/common"));
const Web3Client_1 = require("./Web3Client");
const ClientEndpoints_1 = require("./utils/ClientEndpoints");
const web3Config = _config_1.$config.get('web3.bsc');
class BscWeb3Client extends Web3Client_1.Web3Client {
    constructor(opts) {
        super(ClientEndpoints_1.ClientEndpoints.filterEndpoints(web3Config.endpoints, opts));
        this.platform = 'bsc';
        this.chainId = 56;
        this.chainToken = 'BNB';
        this.defaultGasLimit = 2000000;
    }
    sign(txData, privateKey) {
        const key = Buffer.from(privateKey, 'hex');
        const common = new common_1.default({
            chain: 56,
            customChains: [{
                    chainId: 56,
                    networkId: 56,
                    url: 'https://bsc-dataseed.binance.org/',
                    name: 'bnb',
                    comment: '',
                    hardforks: [{ name: 'mainnet' }]
                }]
        });
        const tx = tx_1.Transaction.fromTxData(txData, { common });
        const signedTx = tx.sign(key);
        return signedTx.serialize();
    }
}
exports.BscWeb3Client = BscWeb3Client;
