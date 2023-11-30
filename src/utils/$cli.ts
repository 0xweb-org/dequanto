export namespace $cli {

    export function getParamValue(flag: string, parameters?: Record<string, string>): string | null {
        let k1 = cases.camelToHyphenCase(flag);
        let k2 = cases.hyphenToCamelCase(flag);

        if (parameters != null) {
            if (k1 in parameters) {
                return parameters[k1];
            }
            if (k2 in parameters) {
                return parameters[k2];
            }
        }
        let args = process.argv;
        for (let i = 0; i < args.length - 1; i++) {
            let key = args[i].replace(/^\-+/, '');
            if (key === k1 || key === k2) {
                return args[i + 1];
            }
        }
        return null;
    }


    namespace cases {
        export function hyphenToCamelCase(str: string): string {
            if (str.includes('-') === false) {
                return str;
            }
            return str.replace(/\-([a-z])/g, (g) => g[1].toUpperCase());
        }
        export function camelToHyphenCase(str: string): string {
            if (/[A-Z]/.test(str) === false) {
                return str;
            }
            return str.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
          }
    }
}
