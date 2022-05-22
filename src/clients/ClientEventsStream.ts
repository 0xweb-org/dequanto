import type { AbiItem } from 'web3-utils';
import type { Contract } from 'web3-eth-contract';
import type { Subscription } from 'web3-core-subscriptions';
import type { EventLog } from 'web3-core';

export class ClientEventsStream<T = any> {
    constructor(public contract: Contract, public eventAbi: AbiItem, public stream: Subscription<EventLog> ) {

    }

    onData (cb: (event: EventLog, ...args) => void): this {
        this.stream.on('data', (event: EventLog) => {
            let inputs = this.eventAbi.inputs.map(arg => {
                let val = event.returnValues[arg.name];
                return val;
            })
            cb(event, ...inputs);
        });
        return this;
    }
    onConnected (cb): this {
        this.stream.on('connected', data => {
            cb(data);
        });
        return this;
    }
    onError (cb: (error: Error) => void): this {
        this.stream.on('error', error => {
            cb(error);
        });
        return this;
    }
}
