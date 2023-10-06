export class Logger {

    static errors = {
        BUFFER_OVERRUN: 'BUFFER_OVERRUN',
        INVALID_ARGUMENT: 'INVALID_ARGUMENT',
    }
    constructor (private v = '') {

    }

    throwArgumentError (message, localVar, value) {
        throw new Error(`${message}: Invalid ${localVar}: ${value}`)
    }

    throwError (message, name, params) {
        throw new Error(`${name}: ${message} ${ JSON.stringify(params) }`);
    }
    checkArgumentCount(length: number, count: number, message: string) {
        if (length !== count) {
            throw new Error(message);
        }
    }

}
