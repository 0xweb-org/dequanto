"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnsProvider = void 0;
const a_di_1 = __importDefault(require("a-di"));
const EthWeb3Client_1 = require("@dequanto/clients/EthWeb3Client");
const ContractReader_1 = require("@dequanto/contracts/ContractReader");
const _config_1 = require("@dequanto/utils/$config");
const _require_1 = require("@dequanto/utils/$require");
const _ns_1 = require("../utils/$ns");
class EnsProvider {
    constructor(client = a_di_1.default.resolve(EthWeb3Client_1.EthWeb3Client)) {
        this.client = client;
    }
    supports(domain) {
        return /\.eth$/.test(domain);
    }
    async getAddress(domain) {
        let hash = _ns_1.$ns.namehash(domain);
        let resolverAddr = await this.getResolverAddress(hash);
        let address = await this.resolveAddress(hash, resolverAddr);
        return address;
    }
    async resolveAddress(hash, resolverAddr) {
        let registryAddr = _config_1.$config.get('ns.ens.registry');
        _require_1.$require.Address(registryAddr);
        let reader = new ContractReader_1.ContractReader(this.client);
        let address = await reader.readAsync(resolverAddr, `addr(bytes32):address`, hash);
        return address;
    }
    async getResolverAddress(hash) {
        let registryAddr = _config_1.$config.get('ns.ens.registry');
        _require_1.$require.Address(registryAddr);
        let reader = new ContractReader_1.ContractReader(this.client);
        let address = await reader.readAsync(registryAddr, `resolver(bytes32):address`, hash);
        return address;
    }
}
exports.EnsProvider = EnsProvider;
