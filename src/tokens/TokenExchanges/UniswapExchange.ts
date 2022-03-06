import di from 'a-di';
import { $config } from '@dequanto/utils/$config';
import { AmmV2ExchangeBase } from './AmmV2ExchangeBase';
import { $is } from '@dequanto/utils/$is';
import { Etherscan } from '@dequanto/BlockchainExplorer/Etherscan';
import { EthWeb3Client } from '@dequanto/clients/EthWeb3Client';
import { IBlockChainExplorer } from '@dequanto/BlockchainExplorer/IBlockChainExplorer';
import { Web3Client } from '@dequanto/clients/Web3Client';


const config = $config.get('uniswapV2');

const factory = $is.Address(config.factory, 'Factory Address');
const vault = $is.Address(config.vault, 'Vault Address');
const masterChef = config.masterChef;

export class UniswapExchange extends AmmV2ExchangeBase {

    name = 'uniswap'
    factoryAddress = factory
    masterChefAddress = masterChef
    vaultAddress = vault

    constructor(
        public client: Web3Client = di.resolve(EthWeb3Client),
        public explorer: IBlockChainExplorer = di.resolve(Etherscan)
    ) {
        super(client, explorer);
    }
}
