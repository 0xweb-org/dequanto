import { SubjectStream } from '@dequanto/class/SubjectStream';
import { TEth } from '@dequanto/models/TEth';
import { TTransport } from './transports/ITransport';
import { class_EventEmitter } from 'atma-utils';

export class RpcSubscription<T> extends SubjectStream<T> implements TTransport.Subscription<T> {

    private _emitter: class_EventEmitter

    constructor (public id: number, public transport: TTransport.Transport,  mapper?: (value) => T) {
        super();
        this._mapper = mapper;
    }

    map (mapper: (x: T) => any): RpcSubscription<T> {
        let stream = new RpcSubscription<T>(this.id, this.transport, mapper);
        stream.fromStream(this);
        return stream;
    }

    async unsubscribe(cb?: Function): Promise<boolean> {
        super.unsubscribe(cb);

        if (this._cbs.length === 0) {
            await this.transport.unsubscribe({
                id: Date.now(),
                jsonrpc: '2.0',
                method: 'eth_unsubscribe',
                params: [ this.id ]
            });
        }
        return true;
    }

    static createMapping <T> (subscription: TTransport.Subscription<any>, transport: TTransport.Transport, mapper: (x: any) => any): RpcSubscription<T> {
        let stream = new RpcSubscription<T>(subscription.id, transport, mapper);
        //@TODO: fix 'any'
        stream.fromStream(subscription as any);
        return stream;
    }
}

export type RpcLogFilterOptions = {
    address?: TEth.Address | TEth.Address[]
    topics?: TEth.Hex[]
}
