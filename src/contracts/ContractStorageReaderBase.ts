import { IBlockChainExplorer } from '@dequanto/explorer/IBlockChainExplorer';
import { Web3Client } from '@dequanto/clients/Web3Client';
import { TAddress } from '@dequanto/models/TAddress';
import { ISlotVarDefinition } from '@dequanto/solidity/SlotsParser/models';
import { SlotsStorage } from '@dequanto/solidity/SlotsStorage';

export class ContractStorageReaderBase {

    public $storage: SlotsStorage;

    constructor (
        public address: TAddress,
        public client: Web3Client,
        public explorer: IBlockChainExplorer
    ) {

    }

    public $get (...args: Parameters<SlotsStorage['get']>) {
        return this.$storage.get(...args);
    }
    public $set (...args: Parameters<SlotsStorage['set']>) {
        return this.$storage.set(...args);
    }

    protected $createHandler(slots: ISlotVarDefinition[]) {
        this.$storage = SlotsStorage.createWithClient(this.client, this.address, slots);
    }
}
