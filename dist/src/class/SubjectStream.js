"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubjectStream = void 0;
const Subscription_1 = require("./Subscription");
const SubjectKind_1 = require("./SubjectKind");
class SubjectStream {
    constructor() {
        this.value = void 0;
        this._error = void 0;
        /// [SuccessCb, ErrorCb, Options][]
        this._cbs = [];
        this.kind = SubjectKind_1.SubjectKind.Stream;
        this.canceled = false;
        this.next = this.next.bind(this);
        this.error = this.error.bind(this);
        this.onInnerChanged = this.onInnerChanged.bind(this);
    }
    next(x) {
        this.onValue(x);
    }
    onValue(val) {
        this._error = void 0;
        this.value = val;
        this.call(0, val);
    }
    error(err) {
        this._error = err;
        this.call(1, err);
    }
    current() {
        return this.value;
    }
    isBusy() {
        return this.value === void 0;
    }
    fromStream(stream, inner) {
        this._pipe = stream;
        this._inner = inner;
        if (this._cbs.length !== 0) {
            this._pipeSub = stream.subscribe(this.next, this.error);
        }
        if (this.value === void 0 && stream.value != null) {
            this.value = stream.value;
        }
        this._innerSub = this._inner?.subscribe(this.onInnerChanged);
    }
    subscribe(cb, onError, once) {
        if (this._pipe != null && this._cbs.length === 0) {
            this._pipe.subscribe(this.next, this.error);
        }
        this._cbs.push([cb, onError, once === true ? CB_ONCE : null]);
        if (this.value !== void 0) {
            this.onValue(this.value);
        }
        return new Subscription_1.Subscription(this, cb);
    }
    unsubscribe(cb) {
        for (let i = 0; i < this._cbs.length; i++) {
            if (this._cbs[i][0] === cb) {
                this._cbs.splice(i, 1);
            }
        }
        if (this._pipe != null && this._cbs.length === 0) {
            this._pipe.unsubscribe?.(this.next);
            this._innerSub?.unsubscribe?.(this.onInnerChanged);
            return;
        }
    }
    // When binding the to expression like: 'foo.bar.quxStream()' we create additional stream to listen to `foo.bar` properties reassignment
    onInnerChanged(newStream) {
        this._pipe?.unsubscribe?.(this.next);
        this._pipe = newStream;
        if (this._pipe != null && this._cbs.length > 0) {
            this._pipe.subscribe(this.next, this.error);
        }
        if (newStream.value !== void 0) {
            this.next(newStream.value);
        }
    }
    call(index, x) {
        for (let i = 0; i < this._cbs.length; i++) {
            let row = this._cbs[i];
            let fn = row[index];
            let opts = row[2];
            if (opts?.once === true) {
                this._cbs.splice(i, 1);
            }
            if (fn == null) {
                if (index === 1) {
                    console.info(`Error not handled`, x);
                }
                return;
            }
            fn(x);
        }
    }
}
exports.SubjectStream = SubjectStream;
var CallbackType;
(function (CallbackType) {
    CallbackType[CallbackType["OK"] = 0] = "OK";
    CallbackType[CallbackType["Error"] = 1] = "Error";
})(CallbackType || (CallbackType = {}));
const CB_ONCE = { once: true };
