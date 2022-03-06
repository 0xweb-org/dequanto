"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.$fn = void 0;
const _promise_1 = require("./$promise");
var $fn;
(function ($fn) {
    function retriable(fn, ctx) {
        return new Retriable(fn, ctx);
    }
    $fn.retriable = retriable;
    function timeoutPromise(promise, ms) {
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
    $fn.timeoutPromise = timeoutPromise;
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
                await _promise_1.$promise.wait(intervalMs);
            }
        });
    }
    $fn.waitForObject = waitForObject;
    class Retriable {
        constructor(fn, ctx) {
            this.fn = fn;
            this.ctx = ctx;
            this._retries = 0;
            this._options = {
                timeout: null,
                retries: null,
                onError: null
            };
        }
        options(opts) {
            this._options = opts;
            return this;
        }
        call(...args) {
            return this.tick(...args);
        }
        async tick(...args) {
            try {
                let result = await this.fn.apply(this.ctx, args);
                return result;
            }
            catch (error) {
                let { timeout, retries = 3, onError } = this._options;
                if (timeout != null) {
                    await _promise_1.$promise.wait(timeout);
                }
                if (++this._retries > retries) {
                    throw error;
                }
                if (onError) {
                    error.message += ` Will be re-executed ${this._retries}/${retries}`;
                    let overridenArgs = await onError(error);
                    if (Array.isArray(overridenArgs)) {
                        args = overridenArgs;
                    }
                }
                return this.tick(...args);
            }
        }
    }
})($fn = exports.$fn || (exports.$fn = {}));
