"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.$promise = void 0;
var $promise;
(function ($promise) {
    function wait(ms) {
        return new Promise(resolve => {
            setTimeout(resolve, ms);
        });
    }
    $promise.wait = wait;
    ;
    function fromEvent(eventEmitter, event) {
        return new Promise((resolve, reject) => {
            const cb = (value) => {
                resolve(value);
                eventEmitter.off(event, cb);
            };
            eventEmitter.on(event, cb);
        });
    }
    $promise.fromEvent = fromEvent;
})($promise = exports.$promise || (exports.$promise = {}));
