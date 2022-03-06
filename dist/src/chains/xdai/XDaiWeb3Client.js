"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.XDaiWeb3Client = void 0;
const _config_1 = require("@dequanto/utils/$config");
const tx_1 = require("@ethereumjs/tx");
const common_1 = __importDefault(require("@ethereumjs/common"));
const Web3Client_1 = require("@dequanto/clients/Web3Client");
const ClientEndpoints_1 = require("@dequanto/clients/utils/ClientEndpoints");
const memd_1 = __importDefault(require("memd"));
const axios_1 = __importDefault(require("axios"));
const _bigint_1 = require("@dequanto/utils/$bigint");
const web3Config = _config_1.$config.get('web3.xdai');
class XDaiWeb3Client extends Web3Client_1.Web3Client {
    constructor(opts) {
        super(ClientEndpoints_1.ClientEndpoints.filterEndpoints(web3Config.endpoints, opts));
        this.platform = 'xdai';
        this.chainId = 100;
        this.chainToken = 'XDAI';
        this.defaultGasLimit = 500000;
    }
    sign(txData, privateKey) {
        const key = Buffer.from(privateKey, 'hex');
        const common = new common_1.default({
            chain: 100,
            customChains: [{
                    chainId: 100,
                    networkId: 100,
                    url: 'https://rpc.xdaichain.com/',
                    name: 'xdai',
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
    async getGasPrice() {
        let gasPrice;
        try {
            gasPrice = await this.loadGasPrice();
        }
        catch (err) {
            gasPrice = await super.getGasPrice();
        }
        // MIN 20gwei, max: 80gwei
        const MAX = _bigint_1.$bigint.toWeiFromGwei(80);
        const MIN = _bigint_1.$bigint.toWeiFromGwei(20);
        if (gasPrice < MIN)
            return MIN;
        if (gasPrice > MAX)
            return MAX;
        return gasPrice;
    }
    async loadGasPrice() {
        let resp = await axios_1.default.get(`https://blockscout.com/xdai/mainnet/api/v1/gas-price-oracle`);
        let avg = resp.data?.average;
        if (avg) {
            return _bigint_1.$bigint.toWeiFromGwei(avg);
        }
        throw new Error(`Field is missing`);
    }
}
__decorate([
    memd_1.default.deco.memoize({ maxAge: 10 })
], XDaiWeb3Client.prototype, "loadGasPrice", null);
exports.XDaiWeb3Client = XDaiWeb3Client;
