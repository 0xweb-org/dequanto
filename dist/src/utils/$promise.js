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
    async function catched(mix) {
        try {
            let promise = typeof mix === 'function' ? mix() : mix;
            let result = await promise;
            return { result };
        }
        catch (error) {
            return { error };
        }
    }
    $promise.catched = catched;
    function timeout(promise, ms) {
        let err = new Error(`Promise timeouted in ${ms}ms`);
        return new Promise((resolve, reject) => {
            let completed = false;
            let timeout = setTimeout(() => {
                if (completed) {
                    return;
                }
                completed = true;
                reject(err);
            }, ms);
            promise.then(result => {
                completed = true;
                clearTimeout(timeout);
                resolve(result);
            }, err => {
                completed = true;
                clearTimeout(timeout);
                reject(err);
            });
        });
    }
    $promise.timeout = timeout;
    function waitForTrue(check, opts) {
        return waitForObject(async () => {
            let result = await check();
            return [null, result === true ? {} : null];
        }, opts);
    }
    $promise.waitForTrue = waitForTrue;
    function waitForObject(check, opts) {
        let start = Date.now();
        let completed = false;
        let intervalMs = opts?.intervalMs ?? 500;
        let timeoutMs = opts?.timeoutMs ?? null;
        let timeoutMessage = opts?.timeoutMessage ?? `Waiting for object timeouted`;
        return new Promise(async (resolve, reject) => {
            async function tick() {
                let [error, result] = (await check()) ?? [null, null];
                if (result != null) {
                    completed = true;
                    resolve(result);
                    return;
                }
                if (error != null) {
                    completed = true;
                    reject(error);
                    return;
                }
                if (timeoutMs != null && (Date.now() - start) > timeoutMs) {
                    completed = true;
                    let message = typeof timeoutMessage === 'function'
                        ? timeoutMessage()
                        : timeoutMessage;
                    reject(new Error(message));
                    return;
                }
            }
            while (true) {
                try {
                    await tick();
                }
                finally { }
                if (completed === true) {
                    break;
                }
                await $promise.wait(intervalMs);
            }
        });
    }
    $promise.waitForObject = waitForObject;
})($promise = exports.$promise || (exports.$promise = {}));
