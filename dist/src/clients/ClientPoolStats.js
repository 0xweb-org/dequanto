"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientPoolStats = exports.ClientPoolTrace = exports.ClientPoolTraceError = void 0;
const _logger_1 = require("@dequanto/utils/$logger");
class ClientPoolStatsHandler {
    constructor() {
        this.calls = [];
    }
    addCall(log) {
        this.calls.push(log);
    }
    log() {
        _logger_1.$logger.log(this.calls);
    }
}
class ClientPoolTraceError extends Error {
    static create($error, trace) {
        let traceLog = trace?.toString() ?? '';
        return {
            name: $error.name,
            stack: $error.stack,
            message: traceLog + '\n' + $error.message
        };
    }
}
exports.ClientPoolTraceError = ClientPoolTraceError;
class ClientPoolTrace {
    constructor() {
        this.calls = [];
    }
    onComplete(log) {
        this.calls.push(log);
    }
    toString() {
        return [
            `${this.action} using clients:`,
            ...this.calls.map(call => {
                return [
                    `${call.url} ${call.status} ${call.time}ms`,
                    `${call.error?.message}`
                ].join('\n');
            })
        ].join('\n');
    }
    static createContractCall(address, methodName, ...args) {
        let trace = new ClientPoolTrace();
        trace.action = `Contact: ${address} ${methodName}(${args.join(', ')})`;
        return trace;
    }
}
exports.ClientPoolTrace = ClientPoolTrace;
exports.ClientPoolStats = new ClientPoolStatsHandler();
