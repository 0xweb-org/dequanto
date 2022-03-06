import di from 'a-di';
import { Bscscan } from '@dequanto/BlockchainExplorer/Bscscan';
import { BscWeb3Client } from '@dequanto/clients/BscWeb3Client';
import { $config } from '@dequanto/utils/$config';
import { AmmV2ExchangeBase } from './AmmV2ExchangeBase';
import { $is } from '@dequanto/utils/$is';
import { IBlockChainExplorer } from '@dequanto/BlockchainExplorer/IBlockChainExplorer';
import { Web3Client } from '@dequanto/clients/Web3Client';


const config = $config.get('pancackeswap');

const factory = $is.Address(config.factory, 'Factory Address');
const masterChef = $is.Address(config.masterChef, 'MasterChef Address');
const vault = $is.Address(config.vault, 'Vault Address');

export class PancakeswapExchange extends AmmV2ExchangeBase {

    name = 'pancake'
    factoryAddress = factory
    masterChefAddress = masterChef
    vaultAddress = vault

    constructor(
        public client: Web3Client = di.resolve(BscWeb3Client),
        public explorer: IBlockChainExplorer = di.resolve(Bscscan)
    ) {
        super(client, explorer);
    }
}
