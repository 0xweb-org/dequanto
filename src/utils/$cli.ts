export namespace $cli {

    export function getParamValue(flag: string): string | null {
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
