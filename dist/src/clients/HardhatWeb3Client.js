"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HardhatWeb3Client = void 0;
const common_1 = __importDefault(require("@ethereumjs/common"));
const _config_1 = require("@dequanto/utils/$config");
const Web3Client_1 = require("./Web3Client");
const ClientEndpoints_1 = require("./utils/ClientEndpoints");
const TxFactory_1 = require("./utils/TxFactory");
// https://hardhat.org/hardhat-network/reference/
class HardhatWeb3Client extends Web3Client_1.Web3Client {
    constructor(opts) {
        super(ClientEndpoints_1.ClientEndpoints.filterEndpoints(_config_1.$config.get('web3.hardhat.endpoints'), opts));
        this.platform = 'hardhat';
        this.chainId = 31337;
        this.chainToken = 'ETH';
        this.TIMEOUT = 5 * 60 * 1000;
        this.defaultGasLimit = 2000000;
    }
    sign(txData, privateKey) {
        const key = Buffer.from(privateKey, 'hex');
        const common = new common_1.default({
            chain: 31337,
            hardfork: 'london',
            customChains: [
                {
                    chainId: 31337,
                    url: 'http://127.0.0.1:8545/',
                    name: 'ETH',
                    comment: '',
                    hardforks: [
                        {
                            name: 'london',
                            block: 0
                        }
                    ],
                    genesis: {
                        hash: '0x0000000000000000000000000000000000000000000000000000000000000000',
                        timestamp: '0x5ED20F84',
                        difficulty: 0x1,
                        gasLimit: 0x989680,
                        nonce: '0x0',
                        stateRoot: '',
                        extraData: '',
                    }
                }
            ]
        });
        const tx = TxFactory_1.TxFactory.fromTxData(txData, { common });
        const signedTx = tx.sign(key);
        return signedTx.serialize();
    }
}
exports.HardhatWeb3Client = HardhatWeb3Client;
