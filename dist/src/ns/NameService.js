"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NameService = void 0;
const _require_1 = require("@dequanto/utils/$require");
const EnsProvider_1 = require("./providers/EnsProvider");
class NameService {
    constructor(client) {
        this.client = client;
        this.providers = [
            new EnsProvider_1.EnsProvider(this.client)
        ];
    }
    getAddress(domain) {
        let provider = this.providers.find(x => x.supports(domain));
        _require_1.$require.notNull(provider, `NS Provider for ${domain} not found`);
        return provider.getAddress(domain);
    }
    supports(mix) {
        return this.providers.some(x => x.supports(mix));
    }
}
exports.NameService = NameService;
