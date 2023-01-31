"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientEventsStream = void 0;
const SubjectStream_1 = require("@dequanto/class/SubjectStream");
const _abiUtils_1 = require("@dequanto/utils/$abiUtils");
const _contract_1 = require("@dequanto/utils/$contract");
class ClientEventsStream {
    constructor(address, eventAbi, stream) {
        this.address = address;
        this.subscriptions = {
            data: null,
            connection: null
        };
        this.streams = {
            onData: new SubjectStream_1.SubjectStream(),
            onConnected: new SubjectStream_1.SubjectStream()
        };
        this.abi = Array.isArray(eventAbi) ? eventAbi : [eventAbi];
        this.onDataInner = this.onDataInner.bind(this);
        this.onConnectedInner = this.onConnectedInner.bind(this);
        if (stream != null) {
            this.fromSubscription(stream);
        }
    }
    fromSubscription(web3Subscription) {
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
    subscribe(cb, onError) {
        return this.streams.onData.subscribe(cb, onError);
    }
    onData(cb) {
        this.subscribe(cb);
        return this;
    }
    onConnected(cb) {
        this.streams.onConnected.subscribe(cb);
        return this;
    }
    error(error) {
        this.streams.onData.error(error);
    }
    onErrorInner(error) {
        let stream = this.streams.onData;
        stream.error(error);
    }
    onDataInner(event) {
        let stream = this.streams.onData;
        let eventsAbi = this.abi.filter(x => x.type === 'event');
        let eventTopic = event.topics[0];
        let abi = eventsAbi.find(x => _abiUtils_1.$abiUtils.getMethodHash(x) === eventTopic);
        if (abi == null) {
            stream.error(new Error(`ABI for the topic ${eventTopic} not found. Supports: ${eventsAbi.map(x => x.name).join(', ')}`));
            return;
        }
        let data = _contract_1.$contract.parseLogWithAbi(event, abi);
        stream.next({
            name: data.event,
            arguments: data.arguments,
            event: event,
        });
    }
    onConnectedInner(event) {
        this.streams.onConnected.next(event);
        return this;
    }
}
exports.ClientEventsStream = ClientEventsStream;
