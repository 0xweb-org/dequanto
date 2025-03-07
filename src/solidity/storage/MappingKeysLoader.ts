import alot from 'alot';
import memd from 'memd';
import type { TAbiItem } from '@dequanto/types/TAbi';

import { BlockchainExplorerFactory } from '@dequanto/explorer/BlockchainExplorerFactory';
import { TAddress } from '@dequanto/models/TAddress';
import { $require } from '@dequanto/utils/$require';
import { MappingSettersResolver } from '../SlotsParser/MappingSettersResolver';
import { SourceCodeProvider } from '../SourceCodeProvider';
import { TPlatform } from '@dequanto/models/TPlatform';
import { Web3ClientFactory } from '@dequanto/clients/Web3ClientFactory';
import { Web3Client } from '@dequanto/clients/Web3Client';
import { IBlockchainExplorer } from '@dequanto/explorer/IBlockchainExplorer';
import { $logger } from '@dequanto/utils/$logger';
import { ContractReader } from '@dequanto/contracts/ContractReader';

export class MappingKeysLoader {

    private address: TAddress
    private implementation?: TAddress
    private contractName: string

    private client: Web3Client
    private explorer: IBlockchainExplorer
    private sourceCodeProvider: SourceCodeProvider

    private logger: typeof $logger

    constructor(params: {
        address: TAddress
        /** Optionally, the implementation contract to load sources from. Otherwise it will detect automatically if the "address" is the proxy contract */
        implementation?: TAddress

        contractName: string
        platform?: TPlatform
        client?: Web3Client
        explorer?: IBlockchainExplorer
        sourceCodeProvider?: SourceCodeProvider
        logger?: typeof $logger
    }) {
        $require.Address(params?.address);

        this.address = params.address;
        this.implementation = params.implementation;
        this.contractName = params.contractName;

        this.client = params.client ?? Web3ClientFactory.get(params.platform ?? 'eth')
        this.explorer = params.explorer ?? BlockchainExplorerFactory.get(this.client.platform)
        this.sourceCodeProvider = params.sourceCodeProvider ?? new SourceCodeProvider(this.client, this.explorer)
        this.logger = params.logger ?? $logger;
    }

    async load(mappingVarName: string) {
        let source = await this.loadSourceCode();
        let { errors, events, methods } = await MappingSettersResolver.getEventsForMappingMutations(mappingVarName, {
            path: source.main.path,
            code: source.main.content
        }, source.main.contractName, { files: source.files });

        let error = errors?.[0];
        if (error != null) {
            throw error;
        }

        let eventCountStr = `${events.length > 0 ? 'green': 'red' }<${events.length}>`;
        let eventNames = events.map(x => `gray<${x.event.name}>`).join(',');
        this.logger.log(`For the mapping "bold<${mappingVarName}>" found:`);
        this.logger.log(`    • ${eventCountStr} mutation Events (${eventNames})`)
        if (methods.length > 0) {
            let methodCountStr = `red<${ methods.length }>`;
            let methodNames = methods.map(x => `red<${x.method.name}>`).join(',');
            this.logger.log(`    • ${methodCountStr} mutation methods without Events (${methodNames})`)
        }

        let keys = await alot(events)
            .mapManyAsync(async eventInfo => {
                const logs = await this.loadEvents(eventInfo.event);
                this.logger.log(`Loaded ${logs.length} ${ eventInfo.event.name } Events to pick arguments at ${eventInfo.accessorsIdxMapping.join(', ')}`);

                const keys = logs.map(log => {
                    return eventInfo
                        .accessorsIdxMapping
                        .map(idx => log.arguments[idx]?.value);
                });
                return keys;
            })
            .toArrayAsync();

        let unique = alot(keys).distinctBy(x => x.join('')).toArray();
        return unique;
    }

    @memd.deco.memoize({ perInstance: true })
    private async loadSourceCode() {
        let source = await this.sourceCodeProvider.getSourceCode({
            contractName: this.contractName,
            address: this.address,
            implementation: this.implementation,
        });
        this.logger.log(`The source code for "bold<${ source.main.contractName }>" has been loaded`);
        return source;
    }

    @memd.deco.memoize({ perInstance: true })
    private async loadEvents(ev: TAbiItem) {
        let reader = new ContractReader(this.client);
        return reader.getLogsParsed(ev, {
            address: this.address,
            fromBlock: 'deployment'
        });
    }
}
