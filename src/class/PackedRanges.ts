import alot from 'alot';

/**
 * Defines a RANGE: [FROM_NUMBER, TO_NUMBER | Infinity)
 *
 * - Walking/Iterating/Visiting through the range marks the visited number as ADD.
 *
 * - Possible to ADD the number manually, for example for persistence/restore properties
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
        ranges?: [number, number][]
    }) {

        if (opts != null) {
            this.to = opts.to;
            this.from = opts.from ?? opts.ranges?.[0]?.[0] ?? this.from;
            this.ranges = opts.ranges ?? [];
        }
    }

    // Get the outer range [from..to] total capacity (regardless of tracked ranges)
    total() {
        let min = this.from;
        let max = this.to ?? this.getMax();
        if (min == null || max == null) {
            return Infinity;
        }
        return max - min;
    }
    // Get the sum of all tracked range lengths (total numbers visited/added)
    totalAdded() {
        let count = 0;
        for (let i = 0; i < this.ranges.length; i++) {
            let [min, max] = this.ranges[i];
            count += max - min + 1;
        }
        return count;
    }

    /**
     * Calculates the number of elements remaining to be visited/added in the range.
     * This is the difference between the total capacity and the number of elements already tracked.
     */
    totalLeft() {
        return this.total() - this.totalAdded();
    }


    /**
     * Gets the next unvisited number in the range and marks it as visited.
     *
     * This method finds the next number that hasn't been added to the tracked ranges yet,
     * automatically adds it to the ranges, and returns it. It respects the boundaries
     * defined by `from` and `to` properties.
     *
     * The method works by:
     * - Starting from `this.from` if no ranges exist
     * - Filling gaps between existing ranges
     * - Extending the last range if no gaps exist
     * - Merging adjacent ranges when they become contiguous
     *
     * @returns The next unvisited number in the range, or `null` if all numbers up to `this.to` have been visited
     * @throws {Error} If the internal ranges array is in an invalid state (unsorted or overlapping)
     */
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

    /**
     * Gets the maximum (upper bound) value from all tracked ranges.
     *
     * This method returns the highest number that has been visited/added to the ranges.
     * It retrieves the upper bound of the last range in the sorted ranges array.
     *
     * @returns The maximum value in the tracked ranges, or `null` if no ranges have been added yet
     */
    getMax() {
        if (this.ranges.length === 0) {
            return null;
        }
        let r = this.ranges[this.ranges.length - 1];
        return r[1];
    }

    /**
     * Checks if a specific number has been visited/added to the tracked ranges.
     *
     * This method searches through all tracked ranges to determine if the given number
     * falls within any of them. It performs a linear search through the ranges array,
     * checking if the number is within the bounds (inclusive) of any range.
     *
     * @param nr - The number to check for inclusion in the tracked ranges
     * @returns `true` if the number exists within any of the tracked ranges, `false` otherwise
     */
    includes(nr: number) {
        for (let i = 0; i < this.ranges.length; i++) {
            let [a, b] = this.ranges[i];
            if (a <= nr && nr <= b) {
                return true;
            }
        }
        return false;
    }

    /**
     * Adds a number to the tracked ranges, marking it as visited.
     *
     * This method intelligently adds a number to the ranges by either:
     * - Extending an existing range if the number is adjacent to it
     * - Creating a new range if the number is isolated
     * - Doing nothing if the number is already included in an existing range
     *
     * The method maintains the sorted order of ranges and automatically merges
     * adjacent numbers into contiguous ranges for efficient storage.
     *
     * @param nr - The number to add to the tracked ranges
     * @returns `true` if the number was successfully added (new or extended a range),
     *          `false` if the number was already present in the ranges
     */
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

    /**
     * Adds a complete range to the tracked ranges and compacts the result.
     *
     * This method adds an entire range [min, max] to the tracked ranges array,
     * then automatically compacts the ranges to merge any overlapping or adjacent
     * ranges. This is useful for bulk operations where you want to mark multiple
     * consecutive numbers as visited at once.
     *
     * Unlike the `add()` method which adds individual numbers, this method adds
     * a complete range tuple and ensures the internal ranges array remains optimized
     * by calling `compact()` after insertion.
     *
     * @param range - A tuple [min, max] representing the range to add, where both bounds are inclusive
     */
    addRange(range: [number, number]) {
        this.ranges.push(range);
        this.compact();
    }

    /**
     * Removes a specific number from the tracked ranges, marking it as unvisited.
     *
     * This method searches for the number within the tracked ranges and removes it by either:
     * - Removing the entire range if it contains only the target number
     * - Shrinking the range by adjusting its lower bound if the number is at the start
     * - Shrinking the range by adjusting its upper bound if the number is at the end
     * - Splitting the range into two separate ranges if the number is in the middle
     *
     * The method maintains the sorted order of ranges and ensures efficient storage
     * by handling all edge cases appropriately.
     *
     * @param nr - The number to remove from the tracked ranges
     * @returns `true` if the number was found and successfully removed from the ranges,
     *          `false` if the number was not present in any of the tracked ranges
     */
    remove(nr: number) {
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

                let arr1 = [min, nr - 1] as [number, number];
                let arr2 = [nr + 1, max] as [number, number];
                this.ranges.splice(i, 1, arr1, arr2);
                return true;
            }
        }
        return false;
    }

    /**
     * Removes a range of numbers from the tracked ranges, marking them as unvisited.
     *
     * This method subtracts the specified range from all tracked ranges, effectively
     * removing all numbers within the given range from the visited/added set. It handles
     * overlapping ranges by splitting or trimming existing ranges as needed.
     *
     * The method maintains the sorted order of ranges and ensures efficient storage
     * by delegating to the `Ranges.subtract()` utility function.
     *
     * @param range - A tuple [min, max] representing the range to remove, where both bounds are inclusive
     * @returns The current `PackedRanges` instance for method chaining
     */
    subtractRange(range: [number, number]) {
        this.ranges = Ranges.subtract(this.ranges, range);
        return this;
    }

    /**
     * Removes multiple ranges of numbers from the tracked ranges, marking them as unvisited.
     *
     * This method subtracts all specified ranges from the tracked ranges, effectively
     * removing all numbers within the given ranges from the visited/added set. It handles
     * overlapping ranges by splitting or trimming existing ranges as needed for each
     * range in the input array.
     *
     * The method maintains the sorted order of ranges and ensures efficient storage
     * by delegating to the `Ranges.subtractMany()` utility function.
     *
     * @param ranges - An array of tuples [min, max] representing the ranges to remove, where both bounds are inclusive
     * @returns The current `PackedRanges` instance for method chaining
     */
    subtractRanges(ranges: [number, number][]) {
        this.ranges = Ranges.subtractMany(this.ranges, ranges);
        return this;
    }

    /**
     * Compacts the tracked ranges by merging overlapping and adjacent ranges.
     *
     * This method optimizes the internal ranges array by:
     * - Merging overlapping ranges into single contiguous ranges
     * - Joining adjacent ranges (e.g., [1,4] and [5,6] become [1,6])
     * - Sorting ranges by their starting values
     * - Removing redundant range entries
     *
     * This operation is useful after bulk modifications to ensure the ranges
     * array remains in its most efficient form for storage and querying.
     */
    compact() {
        this.ranges = Ranges.compact(this.ranges);
    }

    /**
     * Sets the tracked ranges to a new array of ranges and compacts them.
     *
     * This method replaces the entire internal ranges array with the provided ranges,
     * then automatically compacts them to merge any overlapping or adjacent ranges.
     * This is useful for bulk initialization or restoration of ranges from a saved state.
     *
     * After setting the ranges, the method ensures the internal ranges array is optimized
     * by calling `compact()`, which merges overlapping ranges and joins adjacent ones.
     *
     * @param ranges - An array of tuples [min, max] representing the ranges to set, where both bounds are inclusive
     */
    set(ranges: [number, number][]) {
        this.ranges = ranges;
        this.compact();
    }

    /**
     * Serializes the tracked ranges to a JSON string representation.
     *
     * This method converts the internal ranges array into a JSON string format,
     * which can be used for persistence, transmission, or storage purposes.
     * The serialized string can later be parsed and used to restore the ranges
     * via the constructor's `ranges` option.
     *
     * @returns A JSON string representation of the tracked ranges array
     */
    serialize() {
        return JSON.stringify(this.ranges);
    }

    /**
     * Creates a new PackedRanges instance containing only the ranges starting from a specified number.
     *
     * This method filters the tracked ranges to include only those that contain or come after
     * the specified `from` value. If a range overlaps with the `from` value, it is trimmed
     * to start at `from`. All ranges before `from` are excluded from the result.
     *
     * The original PackedRanges instance remains unchanged; a new instance is returned with
     * the filtered ranges.
     *
     * @param from - The starting number from which to pick ranges (inclusive)
     * @returns A new PackedRanges instance containing only the ranges from the specified number onwards
     */
    pickFrom(from: number): PackedRanges {
        let arr = Ranges.pickFrom(this.ranges, from);
        return new PackedRanges({ ranges: arr });
    }

    /**
     * Creates a new PackedRanges instance containing only the ranges up to a specified number.
     *
     * This method filters the tracked ranges to include only those that contain or come before
     * the specified `to` value. If a range overlaps with the `to` value, it is trimmed
     * to end at `to`. All ranges after `to` are excluded from the result.
     *
     * The original PackedRanges instance remains unchanged; a new instance is returned with
     * the filtered ranges.
     *
     * @param to - The ending number up to which to pick ranges (inclusive)
     * @returns A new PackedRanges instance containing only the ranges up to the specified number
     */
    pickTo(to: number): PackedRanges {
        let arr = Ranges.pickTo(this.ranges, to);
        return new PackedRanges({ ranges: arr });
    }


    /**
     * Computes the intersection of multiple range arrays, returning only the ranges that are common to all inputs.
     *
     * This method performs a set intersection operation across multiple arrays of ranges,
     * finding only those number ranges that appear in every input array. The result is
     * compacted to merge any overlapping or adjacent ranges for efficient storage.
     *
     * For example:
     * - Input: [[[1,5], [10,15]], [[3,7], [12,20]]]
     * - Output: [[3,5], [12,15]] (ranges common to both arrays)
     *
     * @param rangesArr - An array of range arrays, where each range array contains tuples [min, max] representing inclusive number ranges
     * @returns A compacted array of ranges representing the intersection of all input range arrays, or an empty array if no common ranges exist or if the input is empty
     */
    static intersection(rangesArr: ([number, number][])[]): [number, number][] {
        if (rangesArr.length === 0) {
            return [];
        }
        let arr = Ranges.clone(rangesArr[0]);
        for (let i = 1; i < rangesArr.length; i++) {
            arr = Ranges.intersection(arr, rangesArr[i]);
        }
        return Ranges.compact(arr);
    }

    /**
     * Computes the union of multiple range arrays, returning all ranges that appear in any of the inputs.
     *
     * This method performs a set union operation across multiple arrays of ranges,
     * combining all number ranges from every input array. The result is compacted to
     * merge any overlapping or adjacent ranges for efficient storage.
     *
     * For example:
     * - Input: [[[1,5], [10,15]], [[3,7], [12,20]]]
     * - Output: [[1,7], [10,20]] (all ranges merged and compacted)
     *
     * @param rangesArr - An array of range arrays, where each range array contains tuples [min, max] representing inclusive number ranges
     * @returns A compacted array of ranges representing the union of all input range arrays, or an empty array if the input is empty
     */
    static union(rangesArr: ([number, number][])[]): [number, number][] {
        let arr = alot(rangesArr)
            .mapMany(x => x)
            .toArray();
        return Ranges.compact(arr);
    }

    /**
     * Computes the difference between two range arrays, removing all ranges in B from ranges in A.
     *
     * This method performs a set difference operation (A − B), subtracting all number ranges
     * in `rangesB` from `rangesA`. The result contains only those portions of `rangesA` that
     * do not overlap with any range in `rangesB`. The result is compacted to merge any
     * overlapping or adjacent ranges for efficient storage.
     *
     * For example:
     * - Input: rangesA = [[1,10], [20,30]], rangesB = [[5,15], [25,35]]
     * - Output: [[1,4], [20,24]] (parts of A not covered by B)
     *
     * @param rangesA - The array of ranges to subtract from, where each range is a tuple [min, max] representing inclusive number ranges
     * @param rangesB - The array of ranges to subtract, where each range is a tuple [min, max] representing inclusive number ranges
     * @returns A compacted array of ranges representing the difference (A − B), or an empty array if all of A is covered by B
     */
    static subtract(rangesA: [number, number][], rangesB: [number, number][]): [number, number][] {
        let arr = Ranges.subtractMany(rangesA, rangesB);
        return Ranges.compact(arr);
    }


    static pickFrom(ranges: [number, number][], from: number): [number, number][] {
        let arr = Ranges.pickFrom(ranges, from);
        return arr;
    }

    static pickTo(ranges: [number, number][], to: number): [number, number][] {
        let arr = Ranges.pickTo(ranges, to);
        return arr;
    }
}

namespace Range {

    // Check if two ranges overlap
    export function overlaps(r1: [number, number], r2: [number, number]) {
        let [x1, y1] = r1;
        let [x2, y2] = r2;
        let d = Math.min(y1, y2) - Math.max(x1, x2);
        return d > -1;
    }

    // AND: A ∩ B
    export function intersection(r1: [number, number], r2: [number, number]) {
        let [x1, y1] = r1;
        let [x2, y2] = r2;
        let minY = Math.min(y1, y2);
        let maxX = Math.max(x1, x2);
        if (minY >= maxX) {
            return [maxX, minY] as [number, number];
        }
        return null;
    }

}



namespace Ranges {
    export function clone(ranges: [number, number][]) {
        let arr = [] as [number, number][];
        for (let [x, y] of ranges) {
            arr.push([x, y]);
        }
        return arr;
    }

    // AND: A ∩ B
    export function intersection(rangesA: [number, number][], rangesB: [number, number][]) {
        let arr = [] as [number, number][];
        for (let i = 0; i < rangesA.length; i++) {
            let rA = rangesA[i];
            for (let j = 0; j < rangesB.length; j++) {
                let union = Range.intersection(rA, rangesB[j]);
                if (union) {
                    arr.push(union);
                    continue;
                }
            }
        }
        return arr;
    }

    export function compact (ranges: [number, number][]): [number, number][] {
        for (let i = 0; i < ranges.length; i++) {
            let rangeA = ranges[i];
            for (let j = i + 1; j < ranges.length; j++) {
                let rangeB = ranges[j];
                if (Range.overlaps(rangeA, rangeB)) {
                    let [x1, y1] = rangeA;
                    let [x2, y2] = rangeB;

                    ranges[i] = [Math.min(x1, x2), Math.max(y1, y2)];
                    ranges.splice(j, 1);
                    j--;
                    continue;
                }
            }
        }

        ranges = alot(ranges)
            .sortBy(([x]) => x)
            .toArray();

        // Join non overlapping ranges: [1,4],[5, 6] -> [1,6]
        for (let i = 0; i < ranges.length - 1; i++) {
            let A = ranges[i];
            let B = ranges[i + 1];
            let aLast = A[A.length - 1];
            let bFirst = B[0];
            if (aLast + 1 === bFirst) {
                let bLast = B[B.length - 1];
                A[A.length - 1] = bLast;
                ranges.splice(i + 1, 1);
            }
        }

        return ranges;
    }

    // Difference: A \ B
    export function subtract(ranges:[number, number][], range: [number, number]) {
        let arr = [] as [number, number][];
        let [rmFrom, rmTo] = range;
        for (let i = 0; i < ranges.length; i++) {
            let A = ranges[i];
            if (Range.overlaps(A, range) === false) {
                arr.push(A);
                continue;
            }
            let [Amin, Amax] = ranges[i];
            if (Amin < rmFrom) {
                arr.push([Amin, rmFrom - 1]);
            }
            if (Amax > rmTo) {
                arr.push([rmTo + 1, Amax]);
            }
        }
        return arr;
    }

    // Difference: A \ ∩B
    export function subtractMany(ranges:[number, number][], rangeArr: [number, number][]) {
        let arr = ranges;
        for (let range of rangeArr) {
            arr = subtract(arr, range);
        }
        return arr;
    }

    export function pickFrom(ranges: [number, number][], from: number): [number, number][] {
        if (ranges == null || ranges.length === 0) {
            return [];
        }
        let arr = [] as [number, number][];
        for (let i = 0; i < ranges.length; i++) {
            let A = ranges[i];
            let aFirst = A[0];
            let aLast = A[A.length - 1];
            if (aLast < from) {
                // This part is fully before from, ignore, search for the next part
                continue;
            }
            if (from < aFirst) {
                // No overlapping, pick all ranges
                arr = ranges.slice(i).map(([x, y]) => [x, y]);
                break;
            }
            let overlapped = [from, aLast] as [number, number];
            arr = ranges.slice(i + 1).map(([x, y]) => [x, y]);
            arr.unshift(overlapped)
            break;
        }
        return arr
    }

    export function pickTo(ranges: [number, number][], to: number): [number, number][] {
        if (ranges == null || ranges.length === 0) {
            return [];
        }
        let arr = [] as [number, number][];
        for (let i = 0; i < ranges.length; i++) {
            let A = ranges[i];
            let aFirst = A[0];
            let aLast = A[A.length - 1];

            if (aFirst > to) {
                // This part starts after 'to' => break (as sorted, next parts also start after 'to')
                break;
            }

            if (aLast < to) {
                // No overlapping, pick full range
                arr.push([aFirst, aLast]);
            } else {
                // Overlapps
                arr.push([aFirst, to]);
            }
        }
        return arr;
    }
}
