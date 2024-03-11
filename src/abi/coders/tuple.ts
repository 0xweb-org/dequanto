import { Coder } from './abstract-coder';
import { pack, unpack } from './array';
import type { Reader, Writer } from './abstract-coder';


export class TupleCoder extends Coder {
    readonly coders!: ReadonlyArray<Coder>;

    constructor(coders: Array<Coder>, localName: string, dynamic?: boolean) {

        dynamic ??= coders.some(x => x.dynamic);

        const types = coders.map(x => x.type);
        const type = ('tuple(' + types.join(',') + ')');

        super('tuple', type, localName, dynamic);

        this.coders = coders.slice();
    }

    defaultValue(): any {
        const values: any = [ ];
        this.coders.forEach((coder) => {
            values.push(coder.defaultValue());
        });

        // We only output named properties for uniquely named coders
        const uniqueNames = this.coders.reduce((accum, coder) => {
            const name = coder.localName;
            if (name) {
                if (!accum[name]) { accum[name] = 0; }
                accum[name]++;
            }
            return accum;
        }, <{ [ name: string ]: number }>{ });

        // Add named values
        this.coders.forEach((coder: Coder, index: number) => {
            let name = coder.localName;
            if (!name || uniqueNames[name] !== 1) { return; }

            if (name === 'length') { name = '_length'; }

            if (values[name] != null) { return; }

            values[name] = values[index];
        });

        return Object.freeze(values);
    }

    encode(writer: Writer, _value: Array<any> | { [ name: string ]: any }): number {
        const value = _value;;
        return pack(writer, this.coders, value);
    }

    decode(reader: Reader): any {
        return unpack(reader, this.coders);
    }
}

