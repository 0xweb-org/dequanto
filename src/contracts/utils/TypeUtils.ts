export namespace TypeUtils {
    export function normalize (args: any[]) {
        args = Array.from(args);

        for (let i = 0; i < args.length; i++) {

            let val = args[i];
            if (val == null || typeof val !== 'object') {
                continue;
            }
            if (Array.isArray(val)) {
                args[i] = normalize(val);
                continue;
            }
            if (val._isBigNumber) {
                args[i] = BigInt(val.toString());
            }
        }
        return args;
    }
}
