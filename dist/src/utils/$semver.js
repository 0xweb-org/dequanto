"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.$semver = void 0;
var $semver;
(function ($semver) {
    function compare(semverA, operator, semverB) {
        if (semverA == null) {
            return false;
        }
        let aParts = semverA.split('.').map(Number);
        let bParts = semverB.split('.').map(Number);
        let max = Math.max(aParts.length, bParts.length);
        for (let i = 0; i < max; i++) {
            let aPart = aParts[i] ?? 0;
            let bPart = bParts[i] ?? 0;
            if (aPart === bPart) {
                continue;
            }
            if (operator === '<') {
                return aPart < bPart;
            }
            if (operator === '>') {
                return aPart > bPart;
            }
            throw new Error(`Unsupported relational operator: ${operator}`);
        }
        // are equal
        return false;
    }
    $semver.compare = compare;
})($semver = exports.$semver || (exports.$semver = {}));
