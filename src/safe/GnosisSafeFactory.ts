import Safe, { ContractNetworksConfig, SafeAccountConfig, SafeFactory } from '@gnosis.pm/safe-core-sdk'
import { ChainAccount } from "@dequanto/models/TAccount";
import { Web3Client } from '@dequanto/clients/Web3Client';
import { TAddress } from '@dequanto/models/TAddress';
import { $gnosis } from './$gnosis';
import { GnosisSafeHandler } from './GnosisSafeHandler';


export abstract class GnosisSafeFactory {

    static async create (owner: ChainAccount, client: Web3Client, config: {
        owners: TAddress[],
        threshold?: number,

        contracts?: ContractNetworksConfig
    }): Promise<GnosisSafeHandler> {

        const ethAdapter = await $gnosis.getAdapter(owner, client);
        const safeFactory = await SafeFactory.create({
            ethAdapter,
            contractNetworks: config.contracts
        });
        const safeAccountConfig: SafeAccountConfig = {
          owners: config.owners,
          threshold: config.threshold ?? config.owners.length,
        };
        const safeSdk: Safe = await safeFactory.deploySafe({ safeAccountConfig });
        const safe = new GnosisSafeHandler({
            safeAddress: safeSdk.getAddress(),
            owner: owner,
            client: client,
        });
        return safe;
    }
}

