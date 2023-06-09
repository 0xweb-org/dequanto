export namespace $error {
    export function normalizeEvmCustomError (error: Error & { data: { type, params }}) {
        if (typeof error?.data?.type !== 'string') {
            return;
        }
        let orig = error.message;
        let msg = error.message;
        msg = msg
            .replace(/unrecognized\s+/, '')
            .replace(/\(return data: 0x\w+\)/, '');

        msg += ` ${error.data.type} ${JSON.stringify(error.data.params)}`;
        error.message = msg;
        error.stack = error.stack.replace(orig, msg);
    }
}
