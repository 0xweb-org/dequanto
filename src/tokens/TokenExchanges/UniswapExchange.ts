import di from 'a-di';
import { $config } from '@dequanto/utils/$config';
import { AmmV2ExchangeBase } from './AmmV2ExchangeBase';

import { Etherscan } from '@dequanto/BlockchainExplorer/Etherscan';
import { EthWeb3Client } from '@dequanto/clients/EthWeb3Client';
import { IBlockChainExplorer } from '@dequanto/BlockchainExplorer/IBlockChainExplorer';
import { Web3Client } from '@dequanto/clients/Web3Client';
import { $require } from '@dequanto/utils/$require';


export class UniswapExchange extends AmmV2ExchangeBase {

    name = 'uniswap'

    config = $config.get('uniswapV2')

    factoryAddress = $require.Address(this.config.factory, 'Factory Address')
    masterChefAddress = $require.Address(this.config.vault, 'Vault Address')
    vaultAddress = this.config.masterChef

    constructor(
        public client: Web3Client = di.resolve(EthWeb3Client),
        public explorer: IBlockChainExplorer = di.resolve(Etherscan)
    ) {
        super(client, explorer);
    }
}
