import { $promise } from '@dequanto/utils/$promise';
import { TTransport } from '../ITransport';
import { RpcSubscription } from '@dequanto/rpc/RpcSubscription';
import alot from 'alot';

export interface IEip1193Provider {
    sendAsync
    request
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

        let result = await $promise.fromCallbackCtx(this.provider, this.provider.sendAsync, req);
        return result;
    }

    async subscribe(req: TTransport.Request): Promise<TTransport.Subscription<any>> {
        throw new Error('Method not implemented.');
    }
    unsubscribe(req: TTransport.Request & { method: 'eth_unsubscribe'; params: [number]; }): Promise<RpcSubscription<any>> {
        throw new Error('Method not implemented.');
    }


}
