export namespace $cli {

    export function getParamValue(flag: string, parameters?: any): string | null {
        if (parameters != null && parameters[flag] != null) {
            return parameters[flag];
        }
        let args = process.argv;
        for (let i = 0; i < args.length - 1; i++) {
            let key = args[i].replace(/^\-+/, '');
            if (key === flag) {
                return args[i + 1];
            }
        }
        return null;
    }
}
