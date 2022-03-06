"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PromiEventWrap = void 0;
const atma_utils_1 = require("atma-utils");
class PromiEventWrap extends atma_utils_1.class_Dfr {
    constructor() {
        super(...arguments);
        this._events = new atma_utils_1.class_EventEmitter();
    }
    on(event, cb) {
        if (event !== 'error' && this.$source) {
            this.bindOn(event);
        }
        this._events.on(event, cb);
        return this;
    }
    once(event, cb) {
        if (event !== 'error' && this.$source) {
            this.bindOnOnce(event);
        }
        this._events.once(event, cb);
        return this;
    }
    emit(event, ...args) {
        this._events.emit(event, ...args);
    }
    /** Attach this wrapper to the promievent */
    bind(promiEvent) {
        this.$source = promiEvent;
        for (let event in this._events._listeners) {
            if (event !== 'error') {
                this.bindOn(event);
            }
        }
        promiEvent.then(result => {
            this.resolve(result);
        }, err => {
            this.reject(err);
        });
    }
    bindOn(event) {
        this.$source.on(event, (...args) => {
            this.emit(event, ...args);
        });
    }
    bindOnOnce(event) {
        this.$source.once(event, (...args) => {
            this.emit(event, ...args);
        });
    }
}
exports.PromiEventWrap = PromiEventWrap;
