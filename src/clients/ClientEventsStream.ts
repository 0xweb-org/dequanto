import { type AbiItem } from 'web3-utils';
import { Contract, EventData } from 'web3-eth-contract';
import { Subscription } from 'web3-core-subscriptions';

export class ClientEventsStream<T = any> {
    constructor(public contract: Contract, public eventAbi: AbiItem, public stream: Subscription<EventData> ) {

    }

    onData (cb: (event: EventData, ...args) => void): this {
        this.stream.on('data', (event: EventData) => {
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
            console.log('CONNECTED', data);
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
