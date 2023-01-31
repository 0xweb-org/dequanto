"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContractStream = void 0;
const ClientEventsStream_1 = require("@dequanto/clients/ClientEventsStream");
const _require_1 = require("@dequanto/utils/$require");
class ContractStream {
    constructor(address, abi, client) {
        this.address = address;
        this.abi = abi;
        this.client = client;
        _require_1.$require.Address(address);
    }
    on(event) {
        if (event === '*') {
            let stream = new ClientEventsStream_1.ClientEventsStream(this.address, this.abi);
            this
                .client
                .subscribe('logs', {
                address: this.address,
                fromBlock: 'latest'
            })
                .then(subscription => {
                stream.fromSubscription(subscription);
            }, error => {
                stream.error(error);
            });
            return stream;
        }
        let stream = this.client.getEventStream(this.address, this.abi, event);
        return stream;
    }
}
exports.ContractStream = ContractStream;
