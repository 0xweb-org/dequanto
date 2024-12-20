import di from 'a-di';
import { Bscscan } from '@dequanto/explorer/Bscscan';
import { BscWeb3Client } from '@dequanto/clients/BscWeb3Client';
import { $config } from '@dequanto/utils/$config';
import { AmmV2ExchangeBase } from './AmmV2ExchangeBase';
import { IBlockchainExplorer } from '@dequanto/explorer/IBlockchainExplorer';
import { Web3Client } from '@dequanto/clients/Web3Client';
import { $require } from '@dequanto/utils/$require';





export class SushiswapPolygonExchange extends AmmV2ExchangeBase {

    name = 'sushiswap'
    config = $config.get('sushiswap');

    factoryAddress = `0xc35dadb65012ec5796536bd9864ed8773abc74c4` as const
    masterChefAddress = $require.Address(this.config?.masterChef ?? '0x0769fd68dFb93167989C6f7254cd0D766Fb2841F', 'MasterChef Address');
    vaultAddress = `0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506` as const

    // private factory = $require.Address(this.config.factory, 'Factory Address');
    // private vault = $require.Address(this.config.vault, 'Vault Address');


    constructor(
        public client: Web3Client = di.resolve(BscWeb3Client),
        public explorer: IBlockchainExplorer = di.resolve(Bscscan)
    ) {
        super(client, explorer);
    }
}
