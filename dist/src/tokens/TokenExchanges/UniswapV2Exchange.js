"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UniswapV2Exchange = void 0;
const a_di_1 = __importDefault(require("a-di"));
const _config_1 = require("@dequanto/utils/$config");
const AmmV2ExchangeBase_1 = require("./AmmV2ExchangeBase");
const Etherscan_1 = require("@dequanto/BlockchainExplorer/Etherscan");
const EthWeb3Client_1 = require("@dequanto/clients/EthWeb3Client");
const _require_1 = require("@dequanto/utils/$require");
class UniswapV2Exchange extends AmmV2ExchangeBase_1.AmmV2ExchangeBase {
    constructor(client = a_di_1.default.resolve(EthWeb3Client_1.EthWeb3Client), explorer = a_di_1.default.resolve(Etherscan_1.Etherscan)) {
        super(client, explorer);
        this.client = client;
        this.explorer = explorer;
        this.name = 'uniswapV2';
        this.config = _config_1.$config.get('uniswapV2');
        this.factoryAddress = _require_1.$require.Address(this.config.factory, 'Factory Address');
        this.masterChefAddress = _require_1.$require.Address(this.config.vault, 'Vault Address');
        this.vaultAddress = this.config.masterChef;
    }
}
exports.UniswapV2Exchange = UniswapV2Exchange;
