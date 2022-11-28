import { TAddress } from '@dequanto/models/TAddress';
import { TPlatform } from '@dequanto/models/TPlatform';

export interface ITokenProvider {
    getByAddress (platform: TPlatform, address: TAddress)
    getBySymbol  (platform: TPlatform, symbol: string)

    redownloadTokens(): Promise<void | any>
}
