
export namespace InputDataUtils {
    export function split (inputData: string): { method: string, args: string[] } {
        let str = inputData.substring(2);
        if (str === '') {
            return { method: '', args: [] }
        }
        let methodName = str.substring(0, 8);
        let params = str.substring(8);
        let args = [];
        while (params.length > 0) {
            args.push(params.substring(0, 64));
            params = params.substring(64);
        }
        return {
            method: methodName,
            args
        };
    }


    export function normalizeArgs (args: any[]) {
        return args.map(val => {
            if (val?._isBigNumber) {
                return BigInt(val.toString());
            }

            return val;
        })
    }

}
