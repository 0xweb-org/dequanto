import alot from 'alot';

/**
 * Defines a RANGE: [FROM_NUMBER, TO_NUMBER | Infinity)
 *
 * - Walking/Iterating/Visiting through the range marks the visited number as ADD.
 *
 * - Possible to ADD the number manually, for example for persistance/restore properties
 *
 * - Check if NUMBER was already visited/iterated
 *
 */
export class PackedRanges {
    protected ranges: [number, number][] = [];

    from: number = 0
    to: number

    constructor(opts?: {
        from?: number
        to?: number
        ranges?: [ number, number ][]
    }) {

        if (opts != null) {
            this.to = opts.to;
            this.from = opts.from ?? opts.ranges?.[0]?.[0] ?? this.from;
            this.ranges = opts.ranges ?? [];
        }
    }

    total () {
        let min = this.from;
        let max = this.to ?? this.getMax();
        if (min == null || max == null) {
            return Infinity;
        }
        return max - min;
    }
    totalAdded () {
        let count = 0;
        for (let i = 0; i < this.ranges.length; i++) {
            let [min, max] = this.ranges[i];
            count += max - min + 1;
        }
        return count;
    }
    totalLeft () {
        return this.total() - this.totalAdded();
    }


    next(): number {
        let min = this.from;
        if (this.ranges.length === 0) {
            let x = min;
            this.ranges.push([x, x]);
            return x;
        }
        let [r0Min, r0Max] = this.ranges[0];
        if (min < r0Min) {
            this.add(min);
            return min;
        }
        while (this.ranges.length > 1) {
            let [r1Min, r1Max] = this.ranges[1];

            let next = r0Max + 1;
            if (next < r1Min) {
                this.ranges[0][1] = next;
                return next;
            }
            if (next === r1Min) {
                this.ranges[0][1] = r1Max;
                this.ranges.splice(1, 1);
                continue;
            }
            throw new Error(`Unsorted ranges r0Max: ${r0Max}, r1Min: ${r1Min}`);
        }

        r0Max = this.ranges[0][1] + 1;

        if (this.to != null && r0Max >= this.to) {
            return null;
        }

        this.ranges[0][1] = r0Max;
        return r0Max;
    }

    getMax() {
        if (this.ranges.length === 0) {
            return null;
        }
        let r = this.ranges[this.ranges.length - 1];
        return r[1];
    }

    includes(nr: number) {
        for (let i = 0; i < this.ranges.length; i++) {
            let [a, b] = this.ranges[i];
            if (a <= nr && nr <= b) {
                return true;
            }
        }
        return false;
    }

    add(nr: number) {
        let modified = false;
        for (let i = 0; i < this.ranges.length; i++) {
            let [a, b] = this.ranges[i];
            if (a <= nr && nr <= b) {
                return false;
            }
            if (a - 1 === nr) {
                this.ranges[i][0] = nr;
                modified = true;
                break;
            }
            if (b + 1 === nr) {
                this.ranges[i][1] = nr;
                modified = true;
                break;
            }
        }
        if (modified === false) {
            // insert
            let arr = [nr, nr] as [number, number];
            let inserted = false;
            for (let i = 0; i < this.ranges.length; i++) {
                let [a] = this.ranges[i];
                if (nr < a) {
                    this.ranges.splice(i, 0, arr);
                    inserted = true;
                    break;
                }
            }
            if (inserted === false) {
                this.ranges.push(arr);
            }
        }
        return true;
    }
    remove (nr: number) {
        for (let i = 0; i < this.ranges.length; i++) {
            let [min, max] = this.ranges[i];
            if (min <= nr && nr <= max) {

                if (min === max) {
                    this.ranges.splice(i, 1);
                    return true;
                }
                if (min === nr) {
                    this.ranges[i][0] = min + 1;
                    return true;
                }
                if (max === nr) {
                    this.ranges[i][1] = max - 1;
                    return true;
                }

                let arr1 = [min, nr - 1] as [ number, number];
                let arr2 = [nr + 1, max] as [ number, number];
                this.ranges.splice(i, 1, arr1, arr2);
                return true;
            }
        }
        return false;
    }

    compact() {
        for (let i = 0; i < this.ranges.length; i++) {
            let rangeA = this.ranges[i];
            for (let j = i + 1; j < this.ranges.length; j++) {
                let rangeB = this.ranges[j];
                if (Ranges.overlaps(rangeA, rangeB)) {
                    let [x1, y1] = rangeA;
                    let [x2, y2] = rangeB;

                    this.ranges[i] = [Math.min(x1, x2), Math.max(y1, y2)];
                    this.ranges.splice(j, 1);
                    j--;
                    continue;
                }
            }
        }

        this.ranges = alot(this.ranges)
            .sortBy(([x]) => x)
            .toArray();
    }

    set(ranges: [number, number][]) {
        this.ranges = ranges;
        this.compact();
    }
    serialize() {
        return JSON.stringify(this.ranges);
    }
}



namespace Ranges {
    export function overlaps (r1: [number, number], r2: [number, number]) {
        let [x1, y1] = r1;
        let [x2, y2] = r2;
        let d = Math.min(y1, y2) - Math.max(x1, x2);

        return d > -1;
    }
}
