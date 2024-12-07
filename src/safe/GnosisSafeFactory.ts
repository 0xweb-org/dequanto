import { EoAccount } from "@dequanto/models/TAccount";
import { Web3Client } from '@dequanto/clients/Web3Client';
import { TAddress } from '@dequanto/models/TAddress';
import { GnosisSafeHandler } from './GnosisSafeHandler';
import { Safe } from '@dequanto/prebuilt/safe/Safe';
import { config } from '@dequanto/config/Config';
import { $require } from '@dequanto/utils/$require';
import { SafeProxyFactory } from '@dequanto/prebuilt/safe/SafeProxyFactory';
import { TEth } from '@dequanto/models/TEth';
import { TAbiItem } from '@dequanto/types/TAbi';


// https://github.com/safe-global/safe-deployments/blob/main/src/assets/v1.4.1/safe_l2.json

// keccak256(toUtf8Bytes('Safe Account Abstraction'))
export const PREDETERMINED_SALT_NONCE = '0xb1073742015cbcf5a3a4d9d1ae33ecf619439710b89475f92e2abd2117e90f90';


export abstract class GnosisSafeFactory {

    static async create (owner: EoAccount, client: Web3Client, params: {
        owners: TAddress[],
        threshold?: number,
        saltNonce?: bigint | TEth.Hex

        contracts?: typeof config.safe.contracts
    }): Promise<GnosisSafeHandler> {

        const safeAccountConfig: SafeAccountConfig = {
          owners: params.owners,
          threshold: params.threshold ?? params.owners.length,
        };

        const cfg = params.contracts?.[client.platform] ?? config.safe?.contracts[client.platform];
        $require.notNull(cfg, `No safe contracts for ${client.platform}`);

        const safeContract = new Safe(cfg.SafeL2 ?? cfg.Safe, client);
        const safeFactoryContract = new SafeProxyFactory(cfg.SafeProxyFactory, client);

        const setupData = await safeContract.$data().setup(owner,
                params.owners,
                BigInt(params.threshold ?? params.owners.length),
                null, //to,
                null, //data,
                null, //fallbackHandler,
                null, //paymentToken,
                null, //payment,
                null, //paymentReceiver
        );


        let tx = await safeFactoryContract.createProxyWithNonce(owner,
            safeContract.address, // _singleton,
            setupData.data, // initializer,
            BigInt(params.saltNonce ?? (BigInt(PREDETERMINED_SALT_NONCE) + BigInt(Date.now())))
        );
        let receipt = await tx.wait();

        let logs = safeFactoryContract.extractLogsProxyCreation(receipt);

        $require.eq(logs.length, 1, `Unexpected ProxyCreation Log count: ${ logs.length }. In transaction ${ receipt.transactionHash } `);
        let [ log ] = logs;

        const safe = new GnosisSafeHandler({
            safeAddress: log.params.proxy,
            owners: [ owner ],
            client: client,
        });
        return safe;
    }
}

interface SafeAccountConfig {
    owners: string[];
    threshold: number;
    to?: string;
    data?: string;
    fallbackHandler?: string;
    paymentToken?: string;
    payment?: number;
    paymentReceiver?: string;
}
interface SafeDeploymentConfig {
    saltNonce: number;
}

export interface ContractNetworkConfig {
    /** multiSendAddress - Address of the MultiSend contract deployed on a specific network */
    multiSendAddress: string;
    /** multiSendAbi - Abi of the MultiSend contract deployed on a specific network */
    multiSendAbi?: TAbiItem | TAbiItem[];
    /** safeMasterCopyAddress - Address of the Gnosis Safe Master Copy contract deployed on a specific network */
    safeMasterCopyAddress: string;
    /** safeMasterCopyAbi - Abi of the Gnosis Safe Master Copy contract deployed on a specific network */
    safeMasterCopyAbi?: TAbiItem | TAbiItem[];
    /** safeProxyFactoryAddress - Address of the Gnosis Safe Proxy Factory contract deployed on a specific network */
    safeProxyFactoryAddress: string;
    /** safeProxyFactoryAbi - Abi of the Gnosis Safe Proxy Factory contract deployed on a specific network */
    safeProxyFactoryAbi?: TAbiItem | TAbiItem[];
}
export interface ContractNetworksConfig {
    /** id - Network id */
    [id: string]: ContractNetworkConfig;
}
