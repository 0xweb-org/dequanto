import type { Web3Client } from '@dequanto/clients/Web3Client';
import { IToken } from '@dequanto/models/IToken';
import { TAddress } from '@dequanto/models/TAddress';
import { TPlatform } from '@dequanto/models/TPlatform';
import { ITokenProvider } from './ITokenProvider';
import { ContractReader } from '@dequanto/contracts/ContractReader';

export class TPChain implements ITokenProvider {

    constructor (public platform: TPlatform, public client?: Web3Client) {

    }

    async getByAddress(platform: TPlatform, address: TAddress) {
        if (this.platform !== platform) {
            return null;
        }

        let reader = new ContractReader(this.client)
        try {
            let [
                symbol,
                name,
                decimals,
            ] = await Promise.all([
                reader.readAsync(address, 'function symbol() returns string'),
                reader.readAsync(address, 'function name() returns string'),
                reader.readAsync(address, 'function decimals() returns uint8'),
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
