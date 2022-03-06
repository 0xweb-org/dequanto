import di from 'a-di';
import { Etherscan } from '@dequanto/BlockchainExplorer/Etherscan';
import { EthWeb3Client } from '@dequanto/clients/EthWeb3Client';
import { TAddress } from '@dequanto/models/TAddress';
import { ContractBase } from '@dequanto/contracts/ContractBase';

export class PoolPair extends ContractBase {
    abi = null

    constructor(
        public address: TAddress,
        public client = di.resolve(EthWeb3Client),
        public explorer = di.resolve(Etherscan)
    ) {
        super(address, client, explorer)
    }

    async getReserves (): Promise<{reserve0: bigint, reserve1: bigint }> {
        return await this.$read('getReserves() returns (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast)');
    }

}
