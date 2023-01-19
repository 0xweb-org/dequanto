import { Subscription } from "./Subscription";
import { SubjectKind } from "./SubjectKind";

export class SubjectStream<T = any> {
    public value: T = void 0;

    protected _error: Error | any = void 0;
    protected _inner: SubjectStream;
    protected _innerSub: Subscription;

    protected _pipe: SubjectStream;
    protected _pipeSub: Subscription

    /// [SuccessCb, ErrorCb, Options][]
    protected _cbs: [((x: T) => void), ((err: Error | any) => void), {
        once?: boolean;
    }][] = [];
    public kind = SubjectKind.Stream;
    public canceled: boolean = false;
    constructor() {
        this.next = this.next.bind(this);
        this.error = this.error.bind(this);
        this.onInnerChanged = this.onInnerChanged.bind(this);
    }
    next(x: T) {
        this.onValue(x)
    }
    onValue (val) {
        this._error = void 0;
        this.value = val;
        this.call(0, val);
    }
    error(err: Error | any) {
        this._error = err;
        this.call(1, err);
    }
    current(): T {
        return this.value;
    }
    isBusy() {
        return this.value === void 0;
    }
    fromStream(stream: SubjectStream, inner?: SubjectStream) {
        this._pipe = stream;
        this._inner = inner;
        if (this._cbs.length !== 0) {
            this._pipeSub = stream.subscribe(this.next, this.error);
        }
        if (this.value === void 0 && stream.value != null) {
            this.value = stream.value;
        }
        this._innerSub = this._inner?.subscribe(this.onInnerChanged)
    }
    subscribe(cb: (x: T) => void, onError?: (x: Error | any) => void, once?): Subscription {
        if (this._pipe != null && this._cbs.length === 0) {
            this._pipe.subscribe(this.next, this.error);
        }
        this._cbs.push([cb, onError, once === true ? CB_ONCE : null]);
        if (this.value !== void 0) {
            this.onValue(this.value);
        }
        return new Subscription(this, cb);
    }
    unsubscribe(cb: Function) {
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
    private onInnerChanged (newStream) {
        this._pipe?.unsubscribe?.(this.next);
        this._pipe = newStream;
        if (this._pipe != null && this._cbs.length > 0) {
            this._pipe.subscribe(this.next, this.error);
        }
        if (newStream.value !== void 0) {
            this.next(newStream.value);
        }
    }
    private call(index: CallbackType, x: any) {
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

enum CallbackType {
    OK = 0,
    Error = 1
}

const CB_ONCE = { once: true };
