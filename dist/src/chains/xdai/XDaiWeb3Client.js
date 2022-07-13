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
const Web3Client_1 = require("@dequanto/clients/Web3Client");
const ClientEndpoints_1 = require("@dequanto/clients/utils/ClientEndpoints");
const memd_1 = __importDefault(require("memd"));
const axios_1 = __importDefault(require("axios"));
const _bigint_1 = require("@dequanto/utils/$bigint");
class XDaiWeb3Client extends Web3Client_1.Web3Client {
    constructor(opts) {
        super({
            ...(opts ?? {}),
            endpoints: ClientEndpoints_1.ClientEndpoints.filterEndpoints(_config_1.$config.get('web3.xdai.endpoints'), opts)
        });
        this.platform = 'xdai';
        this.chainId = this.options.chainId ?? 100;
        this.chainToken = 'XDAI';
        this.defaultGasLimit = 500000;
        this.defaultTxType = 1;
    }
    async getGasPrice() {
        let gasPrice;
        try {
            gasPrice = await this.loadGasPrice();
        }
        catch (err) {
            let { price } = await super.getGasPrice();
            gasPrice = price;
        }
        // MIN 20gwei, max: 80gwei
        const MAX = _bigint_1.$bigint.toWeiFromGwei(80);
        const MIN = _bigint_1.$bigint.toWeiFromGwei(20);
        if (gasPrice < MIN)
            gasPrice = MIN;
        if (gasPrice > MAX)
            gasPrice = MAX;
        return {
            price: gasPrice
        };
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
