export namespace BigNumber {
    export function isInstance (mix): mix is bigint {
        return typeof mix === 'bigint';
    }

    export function isZero (mix: bigint) {
        return mix === 0n;
    }
}
