import type { TAbiItem } from '@dequanto/types/TAbi';
import { SubjectStream } from '@dequanto/class/SubjectStream';
import { TAddress } from '@dequanto/models/TAddress';
import { $abiUtils } from '@dequanto/utils/$abiUtils';
import { $contract } from '@dequanto/utils/$contract';
import { TEth } from '@dequanto/models/TEth';
import { RpcSubscription } from '@dequanto/rpc/RpcSubscription';

export interface TClientEventsStreamData<T extends any[] = any[]> {
    name: string
    event: TEth.Log
    arguments: T
}

export class ClientEventsStream<T extends TClientEventsStreamData<unknown[]> = any> {

    private abi: TAbiItem[];
    private streams = {
        onData: new SubjectStream<TClientEventsStreamData>(),
        onConnected: new SubjectStream<any>()
    };
    private innerStream: RpcSubscription<TEth.Log>;

    constructor(public address: TAddress, eventAbi: TAbiItem | TAbiItem[], stream?: RpcSubscription<TEth.Log> ) {
        this.abi = Array.isArray(eventAbi) ? eventAbi : [ eventAbi ];
        this.onDataInner = this.onDataInner.bind(this);
        this.onConnectedInner = this.onConnectedInner.bind(this);

        if (stream != null) {
            this.fromSubscription(stream);
        }
    }

    fromSubscription (web3Subscription: RpcSubscription<TEth.Log>) {
        // if (this.subscriptions.data) {
        //     this.subscriptions.data.unsubscribe();
        //     this.subscriptions.data = null;
        // }
        // if (this.subscriptions.connection) {
        //     this.subscriptions.connection.unsubscribe();
        //     this.subscriptions.connection = null;
        // }
        this.innerStream = web3Subscription;
        web3Subscription.on('data', this.onDataInner);
        web3Subscription.on('connected', this.onConnectedInner);
        web3Subscription.on('error', this.onErrorInner);
    }

    subscribe (cb: (x: T) => void, onError?: (x: Error | any) => void) {
        return this.streams.onData.subscribe(cb, onError)
    }

    onData (cb: (event: TClientEventsStreamData) => void): this {
        this.subscribe(cb);
        return this;
    }
    onConnected (cb): this {
        this.streams.onConnected.subscribe(cb);
        return this;
    }

    error (error: Error) {
        this.streams.onData.error(error);
    }


    private onErrorInner (error: Error) {
        let stream = this.streams.onData;
        stream.error(error);
    }

    private onDataInner (event: TEth.Log) {
        let stream = this.streams.onData;
        let eventsAbi = this.abi.filter(x => x.type === 'event');

        let eventTopic = event.topics[0];
        let abi = eventsAbi.find(x => $abiUtils.getMethodHash(x) === eventTopic);
        if (abi == null) {
            stream.error(new Error(`ABI for the topic ${eventTopic} not found. Supports: ${ eventsAbi.map(x => x.name).join(', ') }`));
            return;
        }

        let data = $contract.parseLogWithAbi(event, abi);

        stream.next({
            name: data.event,
            arguments: data.arguments,
            event: event,
        });
    }
    private onConnectedInner (event): this {
        this.streams.onConnected.next(event);
        return this;
    }
}
