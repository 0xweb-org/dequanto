"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HardhatWeb3Client = void 0;
const _config_1 = require("@dequanto/utils/$config");
const tx_1 = require("@ethereumjs/tx");
const common_1 = __importDefault(require("@ethereumjs/common"));
const Web3Client_1 = require("./Web3Client");
const ClientEndpoints_1 = require("./utils/ClientEndpoints");
let web3Config = _config_1.$config.get('web3.hardhat');
let endpoints = web3Config?.endpoints ?? [{ url: web3Config?.url, safe: true }];
// https://hardhat.org/hardhat-network/reference/
class HardhatWeb3Client extends Web3Client_1.Web3Client {
    constructor(opts) {
        super(ClientEndpoints_1.ClientEndpoints.filterEndpoints(endpoints, opts));
        this.platform = 'hardhat';
        this.chainId = 31337;
    }
    sign(txData, privateKey) {
        const key = Buffer.from(privateKey, 'hex');
        const common = new common_1.default({
            chain: 31337,
            hardfork: 'london',
            customChains: [
                {
                    chainId: 31337,
                    //networkId: 31337,
                    url: 'http://127.0.0.1:8545/',
                    name: 'ETH',
                    comment: '',
                    hardforks: [
                        // {
                        //     name: "spuriousDragon",
                        //     block: 0
                        // },
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
            // customChains: [{
            //     chainId: 31337,
            //     networkId: 31337,
            //     url: 'http://127.0.0.1:8545/',
            //     name: 'eth',
            //     comment: '',
            //     hardforks: [{ name: 'berlin' }]
            // } as any]
        });
        const tx = tx_1.Transaction.fromTxData(txData, { common });
        const signedTx = tx.sign(key);
        return signedTx.serialize();
    }
}
exports.HardhatWeb3Client = HardhatWeb3Client;
