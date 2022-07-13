"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GnosisSafeFactory = void 0;
const safe_core_sdk_1 = require("@gnosis.pm/safe-core-sdk");
const _gnosis_1 = require("./$gnosis");
const GnosisSafeHandler_1 = require("./GnosisSafeHandler");
class GnosisSafeFactory {
    static async create(owner, client, config) {
        const ethAdapter = await _gnosis_1.$gnosis.getAdapter(owner, client);
        const safeFactory = await safe_core_sdk_1.SafeFactory.create({
            ethAdapter,
            contractNetworks: config.contracts
        });
        const safeAccountConfig = {
            owners: config.owners,
            threshold: config.threshold ?? config.owners.length,
        };
        const safeSdk = await safeFactory.deploySafe({ safeAccountConfig });
        const safe = new GnosisSafeHandler_1.GnosisSafeHandler({
            safeAddress: safeSdk.getAddress(),
            owner: owner,
            client: client,
        });
        return safe;
    }
}
exports.GnosisSafeFactory = GnosisSafeFactory;
