"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UDProvider = void 0;
const a_di_1 = __importDefault(require("a-di"));
const EthWeb3Client_1 = require("@dequanto/clients/EthWeb3Client");
const ContractReader_1 = require("@dequanto/contracts/ContractReader");
const _config_1 = require("@dequanto/utils/$config");
const _require_1 = require("@dequanto/utils/$require");
const _ns_1 = require("../utils/$ns");
class UDProvider {
    constructor(client = a_di_1.default.resolve(EthWeb3Client_1.EthWeb3Client)) {
        this.client = client;
    }
    supports(domain) {
        return /\.(x|crypto|coin|wallet|bitcoin|888|nft|dao|zil|blockchain)$/.test(domain);
    }
    async getAddress(domain) {
        let hash = _ns_1.$ns.namehash(domain);
        let resolverAddr = await this.getResolverAddress(hash);
        let address = await this.resolveAddress(hash, resolverAddr);
        return address;
    }
    async resolveAddress(hash, resolverAddr) {
        let reader = new ContractReader_1.ContractReader(this.client);
        let data = await reader.readAsync(resolverAddr, `getData(string[] keys, uint256 tokenId):(address,address,string[])`, ['crypto.ETH.address'], hash);
        let info = data[2];
        return info[0];
    }
    async getResolverAddress(hash) {
        let platform = this.client.platform;
        let registryAddr = _config_1.$config.get(`ns.ud.${platform}.registry`);
        _require_1.$require.Address(registryAddr);
        return registryAddr;
    }
}
exports.UDProvider = UDProvider;
