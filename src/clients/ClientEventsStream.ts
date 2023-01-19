import type { AbiItem } from 'web3-utils';
import type { Contract } from 'web3-eth-contract';
import { Subscription } from 'web3-core-subscriptions';
import type { EventLog, Log } from 'web3-core';
import { SubjectStream } from '@dequanto/class/SubjectStream';
import { TAddress } from '@dequanto/models/TAddress';
import { $abiUtils } from '@dequanto/utils/$abiUtils';
import { $contract } from '@dequanto/utils/$contract';

export interface TClientEventsStreamData<T extends any[] = any[]> {
    name: string
    event: Log
    arguments: T
}

export class ClientEventsStream<T extends TClientEventsStreamData<unknown[]> = any> {

    private abi: AbiItem[];
    private subscriptions = {
        data: null as Subscription<Log>,
        connection: null as Subscription<any>
    };
    private streams = {
        onData: new SubjectStream<TClientEventsStreamData>(),
        onConnected: new SubjectStream<any>()
    };
    private innerStream: Subscription<Log>;

    constructor(public address: TAddress, eventAbi: AbiItem | AbiItem[], stream?: Subscription<Log> ) {
        this.abi = Array.isArray(eventAbi) ? eventAbi : [ eventAbi ];
        this.onDataInner = this.onDataInner.bind(this);
        this.onConnectedInner = this.onConnectedInner.bind(this);

        if (stream != null) {
            this.fromSubscription(stream);
        }
    }

    fromSubscription (web3Subscription: Subscription<Log>) {
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

    private onDataInner (event: Log) {
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
