"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PolyWeb3Client = void 0;
const common_1 = __importDefault(require("@ethereumjs/common"));
const _config_1 = require("@dequanto/utils/$config");
const Web3Client_1 = require("./Web3Client");
const ClientEndpoints_1 = require("./utils/ClientEndpoints");
const _bigint_1 = require("@dequanto/utils/$bigint");
const TxFactory_1 = require("./utils/TxFactory");
class PolyWeb3Client extends Web3Client_1.Web3Client {
    constructor(opts) {
        super(ClientEndpoints_1.ClientEndpoints.filterEndpoints(_config_1.$config.get('web3.polygon.endpoints'), opts));
        this.platform = 'polygon';
        this.chainId = 137;
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
    // https://raw.githubusercontent.com/maticnetwork/launch/master/mainnet-v1/sentry/sentry/bor/genesis.json
    // https://raw.githubusercontent.com/maticnetwork/launch/master/mainnet-v1/sentry/sentry/heimdall/config/genesis.json
    sign(txData, privateKey) {
        const key = Buffer.from(privateKey, 'hex');
        const common = new common_1.default({
            chain: 137,
            hardfork: 'london',
            customChains: [
                {
                    chainId: 137,
                    networkId: 137,
                    url: 'https://rpc-mainnet.maticvigil.com',
                    name: 'MATIC',
                    comment: '',
                    hardforks: [
                        {
                            name: "spuriousDragon",
                            block: 0
                        },
                        {
                            name: 'berlin',
                            block: 14750000
                        },
                        {
                            name: 'london',
                            block: 23850000
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
exports.PolyWeb3Client = PolyWeb3Client;
