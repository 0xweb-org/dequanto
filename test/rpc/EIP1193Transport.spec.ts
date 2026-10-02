import { EIP1193Transport, IEip1193Message, IEip1193Provider } from 'dequanto/rpc/transports/compatibility/EIP1193Transport';
import { RpcTransport } from 'dequanto/rpc/transports/RpcTransport';
import { TTransport } from 'dequanto/rpc/transports/ITransport';
import Sinon from 'sinon';

UTest({
    async 'should subscribe and unsubscribe via EIP-1193 message events' () {
        let provider = new ProviderMock();
        let transport = RpcTransport.create(provider);

        eq_(transport instanceof EIP1193Transport, true);

        let first = await transport.subscribe(createRequest(1, 'eth_subscribe', [ 'newHeads' ]));
        let second = await transport.subscribe(createRequest(2, 'eth_subscribe', [ 'logs', { address: '0x01' } ]));

        eq_(first.id, '0x1');
        eq_(second.id, '0x2');
        eq_(provider.listenerCount, 1);
        deepEq_(provider.requests[0], {
            method: 'eth_subscribe',
            params: [ 'newHeads' ]
        });

        let firstSpy = Sinon.spy();
        let secondSpy = Sinon.spy();
        first.subscribe(firstSpy);
        second.subscribe(secondSpy);

        provider.emitMessage({
            type: 'eth_subscription',
            data: {
                subscription: '0x2',
                result: { number: '0x10' }
            }
        });
        provider.emitMessage({
            type: 'other',
            data: {
                subscription: '0x1',
                result: { number: '0x11' }
            }
        });

        eq_(firstSpy.callCount, 0);
        eq_(secondSpy.callCount, 1);
        deepEq_(secondSpy.firstCall.args[0], { number: '0x10' });

        await first.unsubscribe();
        eq_(provider.listenerCount, 1);
        deepEq_(provider.requests[2], {
            method: 'eth_unsubscribe',
            params: [ '0x1' ]
        });

        await second.unsubscribe();
        eq_(provider.listenerCount, 0);
        deepEq_(provider.requests[3], {
            method: 'eth_unsubscribe',
            params: [ '0x2' ]
        });

        provider.emitMessage({
            type: 'eth_subscription',
            data: {
                subscription: '0x2',
                result: { number: '0x12' }
            }
        });
        eq_(secondSpy.callCount, 1);
    }
});

function createRequest(id: number, method: string, params: any[]): TTransport.Request {
    return {
        id,
        jsonrpc: '2.0',
        method,
        params
    };
}

class ProviderMock implements IEip1193Provider {
    public requests: { method: string, params?: readonly unknown[] | object }[] = [];
    private listeners = new Set<(message: IEip1193Message) => void>();
    private subscriptionId = 0;

    get listenerCount() {
        return this.listeners.size;
    }

    async request(args: { method: string; params?: readonly unknown[] | object; }): Promise<unknown> {
        this.requests.push(args);
        if (args.method === 'eth_subscribe') {
            this.subscriptionId++;
            return `0x${this.subscriptionId.toString(16)}`;
        }
        if (args.method === 'eth_unsubscribe') {
            return true;
        }
        throw new Error(`Unexpected method ${args.method}`);
    }

    on(event: 'message', listener: (message: IEip1193Message) => void) {
        eq_(event, 'message');
        this.listeners.add(listener);
        return this;
    }

    removeListener(event: 'message', listener: (message: IEip1193Message) => void) {
        eq_(event, 'message');
        this.listeners.delete(listener);
        return this;
    }

    emitMessage(message: IEip1193Message) {
        for (let listener of this.listeners) {
            listener(message);
        }
    }
}
