import memd from 'memd';
import { BlockChainExplorerProvider } from '@dequanto/BlockchainExplorer/BlockChainExplorerProvider';
import { IBlockChainExplorer } from '@dequanto/BlockchainExplorer/IBlockChainExplorer';
import { Web3Client } from '@dequanto/clients/Web3Client';
import { Web3ClientFactory } from '@dequanto/clients/Web3ClientFactory';
import { TAddress } from '@dequanto/models/TAddress';
import { TPlatform } from '@dequanto/models/TPlatform';
import { $logger, l } from '@dequanto/utils/$logger';
import { $perf } from '@dequanto/utils/$perf';
import { $require } from '@dequanto/utils/$require';
import { class_Dfr } from 'atma-utils';
import { SlotsParser } from './SlotsParser';
import { ISlotVarDefinition } from './SlotsParser/models';
import { SlotsStorage } from './SlotsStorage';
import { SourceCodeProvider } from './SourceCodeProvider';
import { MappingKeysLoader } from './storage/MappingKeysLoader';
import { SlotsStorageTransport } from './storage/SlotsStorageTransport';
import { $hex } from '@dequanto/utils/$hex';
import alot from 'alot';

export class SlotsDump {
    private address = this.params.address;
    private implementation = this.params.implementation;

    private client = this.params.client ?? Web3ClientFactory.get(this.params.platform ?? 'eth')
    private explorer = this.params.explorer ?? BlockChainExplorerProvider.get(this.client.platform)
    private sourceCodeProvider = this.params.sourceCodeProvider ?? new SourceCodeProvider(this.client, this.explorer)

    private logger = this.params.logger ?? $logger;

    private keysLoader = new MappingKeysLoader({
        address: this.address,
        implementation: this.implementation,
        client: this.client,
        explorer: this.explorer,
        logger: this.logger,
        platform: this.params.platform,
        sourceCodeProvider: this.sourceCodeProvider
    })

    constructor(private params: {
        address: TAddress
        /** Optionally, the implementation contract to load sources from. Otherwise it will detect automatically if the "address" is the proxy contract */
        implementation?: TAddress

        platform?: TPlatform
        client?: Web3Client
        explorer?: IBlockChainExplorer
        sourceCodeProvider?: SourceCodeProvider
        logger?: typeof $logger
        fields?: string[],
        sources?: {
            files?: {
                [file: string]: { content: string }
            },
        }
    }) {
        $require.Address(this?.address);
    }

    async getStorage () {
        let slots = await this.getSlots();
        return slots;
    }

    private async getSlots (): Promise<{ json: any, memory: [string, string][] }> {

        let sources = await this.sourceCodeProvider.getSourceCode({
            address: this.address,
            implementation: this.implementation,
            sources: this.params.sources?.files
        });

        let slots = await SlotsParser.slots({
            path: sources.main.path,
            code: sources.main.content
        }, sources.main.contractName, {
            files: sources.files
        });

        let transport = new MockedStorageTransport(this.keysLoader, this.client, this.address);

        let reader = new SlotsStorage(transport, slots);
        let json = Array.isArray(this.params.fields)
            ? await alot(this.params.fields)
                .mapAsync(async field => {
                    return { key: field, value: await reader.get(field) }
                })
                .toDictionaryAsync(x => x.key, x => x.value)
            : await reader.fetchAll();
        let memory = alot(transport.memory).sortBy(slot => BigInt(slot[0])).toArray();
        return {
            json,
            memory: memory,
        };
    }
}

class MockedStorageTransport extends SlotsStorageTransport {

    private loader = new BatchLoader(this.address, this.client, this.params)

    memory = [] as [string, string][];

    constructor ( public keysLoader: MappingKeysLoader, client: Web3Client, address: TAddress, params?: { blockNumber: number }) {
        super(client, address, params)
    }

    protected async getStorageAtInner(slot: string): Promise<string> {
        slot = $hex.padBytes(slot, 32);

        let data = await this.loader.getStorageAt(slot);
        this.memory.push([slot, data] as [string, string]);
        return data;
    }
    setStorageAt(slot: string | number | bigint, position: number, size: number, buffer: string | number | bigint | boolean): Promise<void> {
        throw new Error('Method not implemented.');
    }

    async extractMappingKeys (ctx: { slot: ISlotVarDefinition }): Promise<{ keys: (string | number | bigint)[][] }> {
        let keys = await this.keysLoader.load(ctx.slot.name);
        return { keys };
    }
}

class BatchLoader {
    private total: number = 0;
    private loaded: number = 0;
    private queueArr = [] as string[];
    private queueHash = {} as { [slot: string]: class_Dfr };
    private isBusy = false;

    constructor(public address: TAddress, public client: Web3Client, public params?: { blockNumber: number }) {

    }

    getStorageAt(slot: string): Promise<string> {

        let dfr = new class_Dfr();
        this.total++;
        this.queueArr.push(slot);
        this.queueHash[slot] = dfr;
        this.tick();
        return dfr;
    }

    @memd.deco.debounce(30)
    private async tick () {
        if (this.isBusy || this.queueArr.length === 0) {
            return;
        }

        this.isBusy = true;
        let slotsListeners = this.queueHash;
        let slots = this.queueArr.slice(0);

        this.queueArr = [];
        this.queueHash = {};

        try {
            let tick = $perf.start();
            if (slots.length > 50) {
                l`<SlotsDump.BatchLoader> Loading ${slots.length} slots`;
            }
            let memory = await this.client.getStorageAtBatched(this.address, slots, this.params?.blockNumber);

            this.loaded += slots.length;
            l`<SlotsDump.BatchLoader> ${memory.length} slots loaded in ${ tick() }. ${this.loaded}/${this.total}`;

            for (let i = 0; i < memory.length; i++) {
                let slot = slots[i];
                let data = memory[i];

                let dfr = slotsListeners[slot];
                dfr.resolve(data);
            }
        } catch (error) {
            $logger.error(`Storage batched loader errored`, error);
            for (let i = 0; i < slots.length; i++) {
                let slot = slots[i];
                let dfr = slotsListeners[slot];
                dfr.reject(error);
            }
        } finally {
            this.isBusy = false;
            this.tick();
        }
    }
}
