export namespace $bytecode {

    /**
     * remove the constructor code, leave the runtime bytecode only
     */
    export function trimConstructorCode (code: string) {
        let initCode = code.indexOf('6080604052', 4);
        if (initCode > -1) {
            code = '0x' + code.substring(initCode);
        }
        return code;
    }
}
