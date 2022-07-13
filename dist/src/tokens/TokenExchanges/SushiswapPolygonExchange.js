"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SushiswapPolygonExchange = void 0;
const a_di_1 = __importDefault(require("a-di"));
const Bscscan_1 = require("@dequanto/BlockchainExplorer/Bscscan");
const BscWeb3Client_1 = require("@dequanto/clients/BscWeb3Client");
const _config_1 = require("@dequanto/utils/$config");
const AmmV2ExchangeBase_1 = require("./AmmV2ExchangeBase");
const _require_1 = require("@dequanto/utils/$require");
class SushiswapPolygonExchange extends AmmV2ExchangeBase_1.AmmV2ExchangeBase {
    // private factory = $require.Address(this.config.factory, 'Factory Address');
    // private vault = $require.Address(this.config.vault, 'Vault Address');
    constructor(client = a_di_1.default.resolve(BscWeb3Client_1.BscWeb3Client), explorer = a_di_1.default.resolve(Bscscan_1.Bscscan)) {
        super(client, explorer);
        this.client = client;
        this.explorer = explorer;
        this.name = 'sushiswap';
        this.config = _config_1.$config.get('sushiswap');
        this.factoryAddress = '0xc35dadb65012ec5796536bd9864ed8773abc74c4';
        this.masterChefAddress = _require_1.$require.Address(this.config.masterChef, 'MasterChef Address');
        this.vaultAddress = '0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506';
    }
}
exports.SushiswapPolygonExchange = SushiswapPolygonExchange;
