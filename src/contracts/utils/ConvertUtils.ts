export namespace ConvertUtils {
    export function toWei (amount: number | bigint, dec: number | string = 18) {
        let decimals = BigInt(dec);

        return BigInt(amount) * 10n ** decimals;
    }
    export function toEther (amount: number | bigint, dec: number | string = 18) {
        const round = 100000n;
        let decimals = BigInt(dec);
        let val = BigInt(amount) * round / 10n ** decimals;
        if (val < Number.MAX_SAFE_INTEGER) {
            return Number(val) / Number(round);
        }
        return val / round;
    }
}
