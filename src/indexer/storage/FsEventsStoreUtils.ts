import alot from 'alot';
import { Web3Client } from '@dequanto/clients/Web3Client';
import { $hex } from '@dequanto/utils/$hex';
import { $is } from '@dequanto/utils/$is';
import { ContractBase } from '@dequanto/contracts/ContractBase';
import { $contract } from '@dequanto/utils/$contract';
import { TAddress } from '@dequanto/models/TAddress';
import { $require } from '@dequanto/utils/$require';

export namespace FsEventsStoreUtils {
    export function getDirectory (contract: ContractBase, options?: {
        path?: string
        name?: string
        directory?: string
        addresses?: TAddress[]
    }): string {
        if (options?.path) {
            $require.True(options.path.endsWith('/'), `Path for the events store should end with '/'`);
            return options.path;
        }

        let key = contract.client.network.replace(':', '-');
        let directly = options?.directory ?? `./data/tx-logs/`;

        let addressKey = contract.address;
        if ($is.notEmpty(options?.addresses)) {
            let sorted = alot(options.addresses)
                .map(x => $hex.raw(x))
                .distinct()
                .sortBy(x => x)
                .toArray()
                .join('-');
            let hash = $contract.keccak256(sorted, 'hex');
            addressKey = hash;
        }
        let pfxKey = '';
        if (options.name) {
            pfxKey = options.name + '-';
        }

        return `${directly}${key}/${pfxKey}${addressKey}/`;
    }
}
