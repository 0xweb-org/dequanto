import { IToken } from '@dequanto/models/IToken';
import { ITokenGlob } from '@dequanto/models/ITokenGlob';
import { $bigint } from '@dequanto/utils/$bigint';
import { $number } from '@dequanto/utils/$number';
import alot from 'alot';

export namespace TokenUtils {
    export function isStable (symbol: string) {
        return /^[tb]?usd[tc]?$/i.test(symbol) || /^(dai)$/i.test(symbol);
    }
    export function calcUsdIfStable (amount: bigint, token: IToken) {
        if (isStable(token.symbol) === false) {
            return null;
        }
        let tokenBase = 10n ** BigInt(token.decimals);
        return $bigint.divToFloat(amount, tokenBase, 10n**8n);
    }
    export function calcPrice (amount: bigint, token: IToken, usd: number) {
        if (usd == null) {
            return null;
        }
        let tokenBase = 10n ** BigInt(token.decimals);
        let tokenAmount = $bigint.divToFloat(amount, tokenBase, 10n**8n);
        return $number.div(usd, tokenAmount);
    }
    export function calcTotal (token: IToken, amount: bigint, price: number) {
        if (price == null) {
            return null;
        }
        let tokenBase = 10n ** BigInt(token.decimals);
        let tokenAmount = $bigint.divToFloat(amount, tokenBase, 10n**8n);
        return tokenAmount * price;
    }



    export function merge (...tokens: IToken[][]): ITokenGlob[] {
        let all = alot(tokens)
            .mapMany(arr => arr)
            .groupBy(x => x.symbol)
            .map(group => {
                let logo = group.values.find(x => x.logo)?.logo;
                let token = group.values[0];

                return <ITokenGlob> {
                    symbol: token.symbol,
                    name: token.name,
                    logo: logo,

                    platforms: group.values.map(t => {
                        return <ITokenGlob['platforms'][0]>{
                            address: t.address,
                            decimals: t.decimals,
                            platform: t.platform,
                        };
                    })
                };
            })
            .toArray();

        return all;
    }
}
