import { $promise } from '@dequanto/utils/$promise';
import { TTransport } from '../ITransport';
import { RpcSubscription } from '@dequanto/rpc/RpcSubscription';
import alot from 'alot';

export interface IEip1193Provider {
    sendAsync? (request: Object, callback: Function): void;
    request (args: {
        method: string;
        params?: any[];
      }): Promise<unknown>;
}


export class EIP1193Transport implements TTransport.Transport {

    constructor (private provider: IEip1193Provider) {

    }

    async request(req: TTransport.Request | TTransport.Request[]): Promise<any> {

        if (Array.isArray(req)) {
            // Hardhat in-memory doesn't support batch requests
            return alot(req).mapAsync(async x => {
                return this.request(x);
            }).toArrayAsync({ threads: 5 });
        }
        if (typeof this.provider.request === 'function') {
            let result = await this.provider.request(req);
            return result;
        }

        if (typeof this.provider.sendAsync === 'function') {
            let result = await $promise.fromCallbackCtx(this.provider, this.provider.sendAsync, req);
            return result;
        }
        throw new Error(`Invalid transport with no sendAsync, request methods`);
    }

    async subscribe(req: TTransport.Request): Promise<TTransport.Subscription<any>> {
        throw new Error('Method not implemented.');
    }
    unsubscribe(req: TTransport.Request & { method: 'eth_unsubscribe'; params: [number]; }): Promise<RpcSubscription<any>> {
        throw new Error('Method not implemented.');
    }
}
