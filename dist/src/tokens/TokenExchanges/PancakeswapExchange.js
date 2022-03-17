"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PancakeswapExchange = void 0;
const a_di_1 = __importDefault(require("a-di"));
const Bscscan_1 = require("@dequanto/BlockchainExplorer/Bscscan");
const BscWeb3Client_1 = require("@dequanto/clients/BscWeb3Client");
const _config_1 = require("@dequanto/utils/$config");
const AmmV2ExchangeBase_1 = require("./AmmV2ExchangeBase");
const _require_1 = require("@dequanto/utils/$require");
const config = _config_1.$config.get('pancackeswap');
const factory = _require_1.$require.Address(config.factory, 'Factory Address');
const masterChef = _require_1.$require.Address(config.masterChef, 'MasterChef Address');
const vault = _require_1.$require.Address(config.vault, 'Vault Address');
class PancakeswapExchange extends AmmV2ExchangeBase_1.AmmV2ExchangeBase {
    constructor(client = a_di_1.default.resolve(BscWeb3Client_1.BscWeb3Client), explorer = a_di_1.default.resolve(Bscscan_1.Bscscan)) {
        super(client, explorer);
        this.client = client;
        this.explorer = explorer;
        this.name = 'pancake';
        this.factoryAddress = factory;
        this.masterChefAddress = masterChef;
        this.vaultAddress = vault;
    }
}
exports.PancakeswapExchange = PancakeswapExchange;
