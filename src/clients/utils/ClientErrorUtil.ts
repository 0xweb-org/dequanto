

export namespace ClientErrorUtil {
    export function isConnectionFailed (error: Error & { code?, reason? }) {
        if (error.code === 1006 || error.reason === 'connection failed') {
            return true;
        }
        let str = error.message;
        if (str.includes('CONNECTION ERROR') || str.includes('Invalid JSON RPC response') || str.includes('getaddrinfo ENOTFOUND') ) {
            return true;
        }
        return false;
    }
    export function isAlreadyKnown (error: Error & { code?, reason? }) {
        return /already known/i.test(error.message);
    }

    export function IsInsufficientFunds (error: Error) {
        // @TODO - is there a future proof way to check for the error?
        return /insufficient funds/i.test(error.message);
    }

    export function IsNonceTooLow(error: Error) {
        return /nonce too low/i.test(error.message);
    }
}
