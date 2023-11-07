import di from 'a-di';
import { IBlockChainExplorer } from '@dequanto/explorer/IBlockChainExplorer';
import { Web3Client } from '@dequanto/clients/Web3Client';
import { TAddress } from '@dequanto/models/TAddress';
import { TokensService } from '@dequanto/tokens/TokensService';
import { TPlatform } from '@dequanto/models/TPlatform';
import { ERC20 } from '@dequanto-contracts/openzeppelin/ERC20';

export class Wallet {

    tokensService: TokensService

    constructor (
        public account: { platform: TPlatform, address: TAddress },
        public client: Web3Client,
        public explorer: IBlockChainExplorer
    ) {
        this.tokensService = di.resolve(TokensService, this.account.platform, this.explorer)
    }

    async balanceOf (tokenAddress: TAddress)
    async balanceOf (tokenSymbol: string)
    async balanceOf (mix: string) {
        let token = await this.tokensService.getToken(mix);
        if (token == null) {
            throw new Error(`Token ${mix} not found`);
        }

        let erc20 = new ERC20(token.address, this.client, this.explorer);
        return erc20.balanceOf(this.account.address);
    }

}
