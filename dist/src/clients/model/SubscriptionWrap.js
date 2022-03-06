"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionWrap = void 0;
const atma_utils_1 = require("atma-utils");
class SubscriptionWrap extends (0, atma_utils_1.mixin)(atma_utils_1.class_Dfr, atma_utils_1.class_EventEmitter) {
    constructor() {
        super(...arguments);
        this.$wrapped = [];
    }
    on(event, cb) {
        if (event !== 'error' && this.$source) {
            this.bindOn(event);
        }
        return super.on(event, cb);
    }
    bind(stream) {
        if (this.$source) {
            this.unbindAll();
        }
        this.$source = stream;
        for (let event in this._listeners) {
            if (event !== 'error') {
                this.bindOn(event);
            }
        }
        //stream.on('error', ())
    }
    bindOn(event) {
        let fn = (...args) => {
            this.emit(event, ...args);
        };
        this.$wrapped.push([event, fn]);
        this.$source.on(event, fn);
    }
    unbindAll() {
        this.$wrapped.forEach(([event, cb]) => {
            this.$source.off(event, cb);
        });
        this.$wrapped = [];
    }
}
exports.SubscriptionWrap = SubscriptionWrap;
