import { IBlockChainExplorer } from '@dequanto/BlockchainExplorer/IBlockChainExplorer';
import { Web3Client } from '@dequanto/clients/Web3Client';
import { TAddress } from '@dequanto/models/TAddress';
import { ISlotVarDefinition } from '@dequanto/solidity/SlotsParser';
import { SlotsReader } from '@dequanto/solidity/SlotsReader';

export class ContractStorageReaderBase {



    $reader: SlotsReader;

    constructor (
        public address: TAddress,
        public client: Web3Client,
        public explorer: IBlockChainExplorer
    ) {

    }


    protected $createReader(slots: ISlotVarDefinition[]) {
        this.$reader = SlotsReader.createWithClient(this.client, this.address, slots);
    }
}
