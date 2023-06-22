export namespace $regexp {
    export function matches (str: string, regexp: RegExp): RegExpExecArray[] {
        if (regexp.flags.includes('g') === false) {
            regexp = new RegExp(regexp.source, regexp.flags + 'g');
        }
        let matches = [] as RegExpExecArray[];
        while (true) {
            let match = regexp.exec(str);
            if (match === null) {
                break;
            }
            matches.push(match);
        }
        return matches;
    }
}
