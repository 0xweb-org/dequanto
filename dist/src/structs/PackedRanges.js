"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PackedRanges = void 0;
const alot_1 = __importDefault(require("alot"));
/**
 *  Allows in a compact way to add/remove a number to the range; check if number was added.
 */
class PackedRanges {
    constructor(opts) {
        this.ranges = [];
        this.from = 0;
        if (opts != null) {
            this.to = opts.to;
            this.from = opts.from ?? opts.ranges?.[0]?.[0] ?? this.from;
            this.ranges = opts.ranges ?? [];
        }
    }
    total() {
        let min = this.from;
        let max = this.to ?? this.getMax();
        if (min == null || max == null) {
            return Infinity;
        }
        return max - min;
    }
    totalAdded() {
        let count = 0;
        for (let i = 0; i < this.ranges.length; i++) {
            let [min, max] = this.ranges[i];
            count += max - min + 1;
        }
        return count;
    }
    totalLeft() {
        return this.total() - this.totalAdded();
    }
    next() {
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
    includes(nr) {
        for (let i = 0; i < this.ranges.length; i++) {
            let [a, b] = this.ranges[i];
            if (a <= nr && nr <= b) {
                return true;
            }
        }
        return false;
    }
    add(nr) {
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
            let arr = [nr, nr];
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
    remove(nr) {
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
                let arr1 = [min, nr - 1];
                let arr2 = [nr + 1, max];
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
        this.ranges = (0, alot_1.default)(this.ranges)
            .sortBy(([x]) => x)
            .toArray();
    }
    set(ranges) {
        this.ranges = ranges;
        this.compact();
    }
    serialize() {
        return JSON.stringify(this.ranges);
    }
}
exports.PackedRanges = PackedRanges;
var Ranges;
(function (Ranges) {
    function overlaps(r1, r2) {
        let [x1, y1] = r1;
        let [x2, y2] = r2;
        let d = Math.min(y1, y2) - Math.max(x1, x2);
        return d > -1;
    }
    Ranges.overlaps = overlaps;
})(Ranges || (Ranges = {}));
