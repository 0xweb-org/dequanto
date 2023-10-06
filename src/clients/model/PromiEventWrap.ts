
import { PromiseEvent } from '@dequanto/class/PromiseEvent';
import { class_Dfr, class_EventEmitter } from 'atma-utils';


export class PromiseEventWrap extends class_Dfr {

    private _events = new class_EventEmitter();

    $source: PromiseEvent<any>

    on (event, cb): this {

        if (event !== 'error' && this.$source) {
            this.bindOn(event);
        }
        this._events.on(event, cb);
        return this;
    }
    once (event, cb): this {
        if (event !== 'error' && this.$source) {
            this.bindOnOnce(event);
        }
        this._events.once(event, cb);
        return this;
    }
    emit (event, ...args) {
        this._events.emit(event, ...args);
    }

    /** Attach this wrapper to the promiseEvent */
    bind (promiseEvent: PromiseEvent<any>) {

        this.$source = promiseEvent;

        for (let event in this._events._listeners) {
            if (event !== 'error') {
                this.bindOn(event);
            }
        }
        promiseEvent.then(
            result => {
                this.resolve(result)
            },
            err => {
                this.reject(err);
            }
        );
    }


    private bindOn (event) {
        this.$source.on(event as any, (...args) => {
            this.emit(event, ...args);
        });
    }
    private bindOnOnce (event) {
        this.$source.once(event as any, (...args) => {
            this.emit(event, ...args);
        });
    }
}
