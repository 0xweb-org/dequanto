export namespace $hex {
    export function ensure (mix: string) {
        if (mix.startsWith('0x')) {
            return mix;
        }
        return `0x${mix}`;
    }
}
