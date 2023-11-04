import di from 'a-di';
import { Bscscan } from '@dequanto/explorer/Bscscan';
import { BscWeb3Client } from '@dequanto/clients/BscWeb3Client';
import { $config } from '@dequanto/utils/$config';
import { AmmV2ExchangeBase } from './AmmV2ExchangeBase';
import { IBlockChainExplorer } from '@dequanto/explorer/IBlockChainExplorer';
import { Web3Client } from '@dequanto/clients/Web3Client';
import { $require } from '@dequanto/utils/$require';

export class PancakeswapExchange extends AmmV2ExchangeBase {

    name = 'pancake'
    config = $config.get('pancackeswap');
    factoryAddress = $require.Address(this.config.factory, 'Factory Address')
    masterChefAddress = $require.Address(this.config.masterChef, 'MasterChef Address');
    vaultAddress = $require.Address(this.config.vault, 'Vault Address')


    constructor(
        public client: Web3Client = di.resolve(BscWeb3Client),
        public explorer: IBlockChainExplorer = di.resolve(Bscscan)
    ) {
        super(client, explorer);
    }
}
