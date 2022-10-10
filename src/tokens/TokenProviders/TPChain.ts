import { ERC20 } from '@dequanto-contracts/openzeppelin/ERC20';
import type { Web3Client } from '@dequanto/clients/Web3Client';
import { IToken } from '@dequanto/models/IToken';
import { TAddress } from '@dequanto/models/TAddress';
import { TPlatform } from '@dequanto/models/TPlatform';
import { ITokenProvider } from './ITokenProvider';

export class TPChain implements ITokenProvider {

    constructor (public platform: TPlatform, public client?: Web3Client) {

    }

    async getByAddress(platform: TPlatform, address: TAddress) {
        if (this.platform !== platform) {
            return null;
        }

        let erc20 = new ERC20(address, this.client);

        try {
            let [
                symbol,
                name,
                decimals,
            ] = await Promise.all([
                erc20.symbol(),
                erc20.name(),
                erc20.decimals(),
            ]);

            return <IToken> {
                platform,
                address,
                symbol,
                name,
                decimals,
            };

        } catch (error) {
            // just ignore if not resolved
            return null;
        }
    }
    getBySymbol(platform: TPlatform, symbol: string) {
        // Does not support by name
        return null;
    }

    async redownloadTokens(): Promise<any> {
        return [];
    }

}
