import { Rpc } from 'dequanto/rpc/Rpc';
import { HttpTransport } from 'dequanto/rpc/transports/HttpTransport';
import { MessageBasedTransport } from 'dequanto/rpc/transports/MessageBasedTransport';
import { RpcRequestTimeoutError, TTransport } from 'dequanto/rpc/transports/ITransport';
import { $promise } from 'dequanto/utils/$promise';

UTest({
    async 'should time out a custom transport request' () {
        let rpc = new Rpc(new HangingTransport(20) as TTransport.Transport);
        let started = Date.now();

        let { error } = await $promise.caught(rpc.eth_blockNumber());

        eq_(error instanceof RpcRequestTimeoutError, true);
        eq_(error.code, 1006);
        eq_(error.reason, 'connection failed');
        lt_(Date.now() - started, 500);
    },
    async 'should allow disabling the timeout' () {
        let rpc = new Rpc(new DelayedTransport(0, 20) as any as TTransport.Transport);

        let blockNumber = await rpc.eth_blockNumber();

        eq_(blockNumber, 1);
    },
    async 'should abort a timed out HTTP request' () {
        let fetchOriginal = globalThis.fetch;
        let aborted = false;
        globalThis.fetch = ((url: string, options: RequestInit) => {
            return new Promise((resolve, reject) => {
                options.signal.addEventListener('abort', () => {
                    aborted = true;
                    reject(options.signal.reason ?? new Error('Aborted'));
                });
            });
        }) as typeof fetch;

        try {
            let transport = new HttpTransport({
                url: 'http://localhost:8545',
                timeout: 20
            });
            let response = await transport.request(createRequest());

            eq_(aborted, true);
            eq_(response.error?.reason, 'connection failed');
            eq_(response.error?.code, 1006);
        } finally {
            globalThis.fetch = fetchOriginal;
        }
    },
    async 'should remove a timed out WebSocket request' () {
        let transport = new HangingMessageTransport(20);

        let response = await transport.request(createRequest());

        eq_(response.error?.reason, 'connection failed');
        eq_(transport.pending, 0);
    }
});

function createRequest(): TTransport.Request {
    return {
        id: 1,
        jsonrpc: '2.0',
        method: 'eth_blockNumber',
        params: []
    };
}

class HangingTransport implements TTransport.Transport {
    id = 'hanging';
    constructor(public timeout: number) {}

    request(req): Promise<any> {
        return new Promise(() => {});
    }
    subscribe(): Promise<any> {
        return new Promise(() => {});
    }
    unsubscribe(): Promise<any> {
        return new Promise(() => {});
    }
}

class DelayedTransport extends HangingTransport {
    constructor(timeout: number, private delay: number) {
        super(timeout);
    }

    request(req: TTransport.Request): Promise<TTransport.Response> {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve({
                    id: req.id,
                    result: '0x1'
                });
            }, this.delay);
        });
    }
}

class HangingMessageTransport extends MessageBasedTransport {
    constructor(timeout: number) {
        super({
            url: 'ws://localhost:8545',
            timeout
        });
    }

    get pending() {
        return this.requests.size;
    }

    protected async send() {}
}
