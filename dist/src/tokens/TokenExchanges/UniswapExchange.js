"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UniswapExchange = void 0;
const a_di_1 = __importDefault(require("a-di"));
const _config_1 = require("@dequanto/utils/$config");
const AmmV2ExchangeBase_1 = require("./AmmV2ExchangeBase");
const _is_1 = require("@dequanto/utils/$is");
const Etherscan_1 = require("@dequanto/BlockchainExplorer/Etherscan");
const EthWeb3Client_1 = require("@dequanto/clients/EthWeb3Client");
const config = _config_1.$config.get('uniswapV2');
const factory = _is_1.$is.Address(config.factory, 'Factory Address');
const vault = _is_1.$is.Address(config.vault, 'Vault Address');
const masterChef = config.masterChef;
class UniswapExchange extends AmmV2ExchangeBase_1.AmmV2ExchangeBase {
    constructor(client = a_di_1.default.resolve(EthWeb3Client_1.EthWeb3Client), explorer = a_di_1.default.resolve(Etherscan_1.Etherscan)) {
        super(client, explorer);
        this.client = client;
        this.explorer = explorer;
        this.name = 'uniswap';
        this.factoryAddress = factory;
        this.masterChefAddress = masterChef;
        this.vaultAddress = vault;
    }
}
exports.UniswapExchange = UniswapExchange;
