import { IBlockchainExplorer } from '@dequanto/explorer/IBlockchainExplorer';
import { IToken } from '@dequanto/models/IToken';
import { TAddress } from '@dequanto/models/TAddress';
import { TPlatform } from '@dequanto/models/TPlatform';
import { ITokenProvider } from './ITokenProvider';

export class TPExplorer implements ITokenProvider {

    constructor (public platform: TPlatform, public explorer?: IBlockchainExplorer) {

    }

    async getByAddress(platform: TPlatform, address: TAddress) {
        if (this.platform !== platform) {
            return null;
        }

        try {
            let source = await this.explorer?.getContractSource(address);
            return <Partial<IToken>> {
                address: address,
                symbol: source
                    .ContractName
                    ?.replace(/bep20/i, ''),
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
