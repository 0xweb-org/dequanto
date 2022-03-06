import { TAddress } from '@dequanto/models/TAddress';
import { $logger } from '@dequanto/utils/$logger';
import { ClientStatus } from './model/ClientStatus';


interface IClientCallLog {
    url: string
    time: number
    error?: Error
    status: ClientStatus
}


class ClientPoolStatsHandler {
    calls: IClientCallLog[] = []
    addCall (log: Partial<IClientCallLog>) {
        this.calls.push(log as any);
    }

    log () {
        $logger.log(this.calls);
    }
}
export class ClientPoolTraceError extends Error {

    static create ($error: Error, trace: ClientPoolTrace) {
        let traceLog = trace?.toString() ?? '';
        return {
            name: $error.name,
            stack: $error.stack,
            message:  traceLog + '\n' + $error.message
        };
    }
}

export class ClientPoolTrace {

    action: string
    calls: IClientCallLog[] = []

    onComplete (log) {
        this.calls.push(log);
    }

    toString () {
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

    static createContractCall (address: TAddress, methodName: string, ...args) {
        let trace = new ClientPoolTrace();
        trace.action = `Contact: ${address} ${methodName}(${args.join(', ')})`;
        return trace;
    }
}

export const ClientPoolStats = new ClientPoolStatsHandler();
