export namespace $semver {
    export function compare (semverA: string, operator: '<' | '>', semverB: string) {
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
}
