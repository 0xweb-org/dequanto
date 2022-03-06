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

export class SushiswapPolygonExchange extends AmmV2ExchangeBase {

    name = 'sushiswap'
    factoryAddress = '0xc35dadb65012ec5796536bd9864ed8773abc74c4'
    masterChefAddress = masterChef
    vaultAddress = '0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506'

    constructor(
        public client: Web3Client = di.resolve(BscWeb3Client),
        public explorer: IBlockChainExplorer = di.resolve(Bscscan)
    ) {
        super(client, explorer);
    }
}
