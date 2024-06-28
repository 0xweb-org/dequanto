import { class_Dfr, class_EventEmitter } from 'atma-utils';

/** web3js compat */
export class PromiseEvent<TResult> extends class_Dfr<TResult> {
    private _events = new class_EventEmitter

    on(event: string, fn: any): this {
        this._events.on(event, fn);
        return this;
    }
    once (event: string, fn: Function): this {
        this._events.once(event, fn);
        return this;
    }
    emit(event: string, ...args: any[]): this {
        this._events.emit(event, ...args);
        return this;
    }
}


