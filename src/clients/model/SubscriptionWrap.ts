
import { class_Dfr, class_EventEmitter, mixin } from 'atma-utils';


export class SubscriptionWrap extends mixin(class_Dfr, class_EventEmitter) {

    private $source
    private $wrapped = [] as [string, Function][]

    declare _listeners: { [event: string]: Function[] }



    on (event, cb) {

        if (event !== 'error' && this.$source) {
            this.bindOn(event);
        }
        return super.on(event, cb);
    }

    bind (stream) {
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


    private bindOn (event) {
        let fn = (...args) => {
            this.emit(event, ...args);
        };
        this.$wrapped.push([event, fn]);
        this.$source.on(event as any, fn);
    }
    private unbindAll () {
        this.$wrapped.forEach(([event, cb]) => {
            this.$source.off(event, cb);
        })
        this.$wrapped = [];
    }

}
