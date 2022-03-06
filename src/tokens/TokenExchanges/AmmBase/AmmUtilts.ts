import { IToken } from '@dequanto/models/IToken';

export namespace AmmUtils {
    export function toSameBase (a: Pick<IToken, 'decimals'>, b: Pick<IToken, 'decimals'>, aAmount: bigint, bAmount: bigint): [bigint, bigint] {
        return [aAmount, bAmount];

        let diff = (a.decimals ?? 18) - (b.decimals ?? 18);
        if (diff === 0) {
            return [aAmount, bAmount];
        }
        let aAmountOut = diff > 0 ? aAmount : (aAmount * 10n ** BigInt(diff * -1));
        let bAmountOut = diff < 0 ? bAmount : (bAmount * 10n ** BigInt(diff));

        return [aAmountOut, bAmountOut];
    }
}
