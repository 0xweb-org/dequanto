import { config } from '@dequanto/config/Config';
import { $require } from '@dequanto/utils/$require';
import { EthWeb3Client } from './EthWeb3Client'
import { IWeb3EndpointOptions } from './interfaces/IWeb3EndpointOptions'


export class EvmWeb3Client extends EthWeb3Client {

    constructor(options: IWeb3EndpointOptions) {
        super(resolveOptions(options))
    }
}

function resolveOptions (options: IWeb3EndpointOptions) {
    $require.notNull(options?.platform, 'Platform is required when generic evm client is used');
    let cfg = config.web3?.[options.platform];
    if (cfg) {
        for (let key in cfg) {
            if (options[key] == null) {
                options[key] = cfg[key];
            }
        }
    }
    $require.Numeric(options.chainId, `ChainID should be numeric. Got ${options.chainId} for ${options.platform}`);
    return options;
}
