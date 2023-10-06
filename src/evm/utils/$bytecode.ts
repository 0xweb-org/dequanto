import { TEth } from '@dequanto/models/TEth';

export namespace $bytecode {

    /**
     * remove the constructor code, leave the runtime bytecode only
     */
    export function trimConstructorCode (code: TEth.Hex) {
        let initCode = code.indexOf('60806040', 4);
        if (initCode > -1) {
            code = `0x${code.substring(initCode)}`;
        }
        return code;
    }
}
