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
class PancakeswapExchange extends AmmV2ExchangeBase_1.AmmV2ExchangeBase {
    constructor(client = a_di_1.default.resolve(BscWeb3Client_1.BscWeb3Client), explorer = a_di_1.default.resolve(Bscscan_1.Bscscan)) {
        super(client, explorer);
        this.client = client;
        this.explorer = explorer;
        this.name = 'pancake';
        this.config = _config_1.$config.get('pancackeswap');
        this.factoryAddress = _require_1.$require.Address(this.config.factory, 'Factory Address');
        this.masterChefAddress = _require_1.$require.Address(this.config.masterChef, 'MasterChef Address');
        this.vaultAddress = _require_1.$require.Address(this.config.vault, 'Vault Address');
    }
}
exports.PancakeswapExchange = PancakeswapExchange;
