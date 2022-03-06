"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BobaWeb3Client = void 0;
const _config_1 = require("@dequanto/utils/$config");
const tx_1 = require("@ethereumjs/tx");
const common_1 = __importDefault(require("@ethereumjs/common"));
const Web3Client_1 = require("@dequanto/clients/Web3Client");
const ClientEndpoints_1 = require("@dequanto/clients/utils/ClientEndpoints");
const web3Config = _config_1.$config.get('web3.boba');
class BobaWeb3Client extends Web3Client_1.Web3Client {
    constructor(opts) {
        super(ClientEndpoints_1.ClientEndpoints.filterEndpoints(web3Config.endpoints, opts));
        this.platform = 'boba';
        this.chainId = 288;
        this.chainToken = 'ETH';
    }
    sign(txData, privateKey) {
        const key = Buffer.from(privateKey, 'hex');
        const common = new common_1.default({
            chain: 288,
            customChains: [{
                    chainId: 288,
                    networkId: 288,
                    url: 'https://mainnet.boba.network/',
                    name: 'boba',
                    comment: '',
                    hardforks: [],
                    genesis: {
                        hash: '0x0000000000000000000000000000000000000000000000000000000000000000',
                        timestamp: '0x5ED20F84',
                        difficulty: 0x1,
                        gasLimit: 0x989680,
                        nonce: '0x0',
                        stateRoot: '',
                        extraData: '',
                    }
                }]
        });
        const tx = tx_1.Transaction.fromTxData(txData, { common });
        const signedTx = tx.sign(key);
        return signedTx.serialize();
    }
}
exports.BobaWeb3Client = BobaWeb3Client;
