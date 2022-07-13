"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientEventsStream = void 0;
class ClientEventsStream {
    constructor(contract, eventAbi, stream) {
        this.contract = contract;
        this.eventAbi = eventAbi;
        this.stream = stream;
    }
    onData(cb) {
        this.stream.on('data', (event) => {
            let inputs = this.eventAbi.inputs.map(arg => {
                let val = event.returnValues[arg.name];
                return val;
            });
            cb(event, ...inputs);
        });
        return this;
    }
    onConnected(cb) {
        this.stream.on('connected', data => {
            cb(data);
        });
        return this;
    }
    onError(cb) {
        this.stream.on('error', error => {
            cb(error);
        });
        return this;
    }
}
exports.ClientEventsStream = ClientEventsStream;
