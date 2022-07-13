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
exports.GnosisServiceTransport = void 0;
const safe_service_client_1 = __importDefault(require("@gnosis.pm/safe-service-client"));
const memd_1 = __importDefault(require("memd"));
const _gnosis_1 = require("../$gnosis");
class GnosisServiceTransport {
    constructor(client, owner) {
        this.client = client;
        this.owner = owner;
    }
    async getTx(safeTxHash) {
        let service = await this.getService();
        let resp = await service.getTransaction(safeTxHash);
        return resp;
    }
    async getTxConfirmations(safeTxHash) {
        let service = await this.getService();
        let resp = await service.getTransactionConfirmations(safeTxHash);
        return resp;
    }
    async confirmTx(safeTxHash, sig) {
        let service = await this.getService();
        let resp = await service.confirmTransaction(safeTxHash, sig.signature);
        return resp;
    }
    async getSafeInfo(safeAddress) {
        let service = await this.getService();
        let safeInfo = await service.getSafeInfo(safeAddress);
        return safeInfo;
    }
    async estimateSafeTransaction(safeAddress, safeTxEstimation) {
        let service = await this.getService();
        let safeInfo = await service.estimateSafeTransaction(safeAddress, safeTxEstimation);
        return safeInfo;
    }
    async proposeTransaction(args) {
        let service = await this.getService();
        await service.proposeTransaction(args);
    }
    async getService() {
        let adapter = await this.getAdapter();
        const safeService = new safe_service_client_1.default({
            txServiceUrl: this.getServiceApiEndpoint(Number(this.client.chainId)),
            ethAdapter: adapter
        });
        return safeService;
    }
    getServiceApiEndpoint(chainId) {
        let network = '';
        if (chainId === 100) {
            network = `xdai.`;
        }
        if (chainId === 137) {
            network = `polygon.`;
        }
        return `https://safe-transaction.${network}gnosis.io/`;
    }
    async getAdapter() {
        return _gnosis_1.$gnosis.getAdapter(this.owner, this.client);
    }
}
__decorate([
    memd_1.default.deco.memoize({ perInstance: true })
], GnosisServiceTransport.prototype, "getService", null);
__decorate([
    memd_1.default.deco.memoize({ perInstance: true })
], GnosisServiceTransport.prototype, "getAdapter", null);
exports.GnosisServiceTransport = GnosisServiceTransport;
