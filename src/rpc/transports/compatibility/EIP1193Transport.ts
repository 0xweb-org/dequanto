import { $promise } from 'dequanto/utils/$promise';
import { TTransport } from '../ITransport';
import { RpcSubscription } from 'dequanto/rpc/RpcSubscription';
import { RpcError } from 'dequanto/rpc/RpcError';
import alot from 'alot';

export interface IEip1193Message {
    type: string;
    data: unknown;
}

export interface IEip1193SubscriptionMessage extends IEip1193Message {
    type: 'eth_subscription';
    data: {
        subscription: string;
        result: unknown;
    };
}

export interface IEip1193Provider {
    sendAsync? (request: Object, callback: Function): void;
    request? (args: {
        method: string;
        params?: readonly unknown[] | object;
    }): Promise<unknown>;
}

interface IEip1193EventProvider {
    on (event: 'message', listener: (message: IEip1193Message) => void): unknown;
    removeListener (event: 'message', listener: (message: IEip1193Message) => void): unknown;
}

export class EIP1193Transport implements TTransport.Transport {

    private subscriptions = new Map<string, RpcSubscription<any>>();
    private listening = false;

    private onMessage = (message: IEip1193Message) => {
        if (message?.type !== 'eth_subscription') {
            return;
        }
        let data = (message as IEip1193SubscriptionMessage).data;
        let subscription = this.subscriptions.get(String(data?.subscription));
        subscription?.next(data?.result);
    };

    constructor (private provider: IEip1193Provider) {

    }

    async request(req: TTransport.Request | TTransport.Request[]): Promise<any> {
        if (Array.isArray(req)) {
            // Hardhat in-memory does not support batch requests
            return alot(req).mapAsync(async x => {
                return this.request(x);
            }).toArrayAsync({ threads: 5 });
        }
        if (typeof this.provider.request === 'function') {
            let result = await this.provider.request({
                method: req.method,
                params: req.params
            });
            // Normalize response to JSON-RPC format
            return {
                id: req.id,
                jsonrpc: '2.0',
                result
            };
        }
        if (typeof this.provider.sendAsync === 'function') {
            let result = await $promise.fromCallbackCtx(this.provider, this.provider.sendAsync, req);
            return result;
        }
        throw new Error(`Invalid transport: no sendAsync or request methods`);
    }

    async subscribe<TResult = any>(req: TTransport.Request): Promise<RpcSubscription<TResult>> {
        this.startListening();

        let response;
        try {
            response = await this.request(req);
        } catch (error) {
            this.stopListeningWhenIdle();
            throw error;
        }
        if (response.error != null) {
            this.stopListeningWhenIdle();
            throw new RpcError(response.error, req);
        }

        let id = response.result as TTransport.SubscriptionId;
        if (id == null) {
            this.stopListeningWhenIdle();
            throw new Error(`EIP-1193 provider returned no subscription ID`);
        }

        let subscription = new RpcSubscription<TResult>(id, this);
        this.subscriptions.set(String(id), subscription);
        return subscription;
    }

    async unsubscribe(req: TTransport.Request & { method: 'eth_unsubscribe'; params: [TTransport.SubscriptionId]; }): Promise<RpcSubscription<any>> {
        let [ id ] = req.params;
        let subscription = this.subscriptions.get(String(id));
        if (subscription == null) {
            return null;
        }

        let response = await this.request(req);
        if (response.error != null) {
            throw new RpcError(response.error, req);
        }

        this.subscriptions.delete(String(id));
        this.stopListeningWhenIdle();
        return subscription;
    }

    private startListening() {
        if (this.listening) {
            return;
        }
        let provider = this.provider as IEip1193EventProvider;
        if (typeof provider.on !== 'function' || typeof provider.removeListener !== 'function') {
            throw new Error(`EIP-1193 provider does not support message events`);
        }
        provider.on('message', this.onMessage);
        this.listening = true;
    }

    private stopListeningWhenIdle() {
        if (this.listening === false || this.subscriptions.size > 0) {
            return;
        }
        (this.provider as IEip1193EventProvider).removeListener('message', this.onMessage);
        this.listening = false;
    }
}
