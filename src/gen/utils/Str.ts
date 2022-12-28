import alot from 'alot';

export namespace Str {
    export function formatMethod(str: string) {

        str = trim(str);
        str = indent(str, '    ');
        return str;
    }
    export function trim(str: string) {
        let lines = str.split('\n');
        let min = alot(lines).min(line => {
            if (line.trim() === '') {
                return Number.MAX_SAFE_INTEGER;
            }
            let match = /^\s*/.exec(line);
            if (match == null) {
                return Number.MAX_SAFE_INTEGER;
            }
            return match[0].length;
        });

        lines = lines.map((line, i) => {
            let x = line.substring(min);
            if ((i === 0) || (lines.length === i + 1)) {
                if (x === '') {
                    return null;
                }
            }
            return x;
        }).filter(Boolean);
        return lines.join('\n');
    }
    export function indent(str: string, indent: string) {
        return str
            .split('\n')
            .map(x => `${indent}${x}`)
            .join('\n');
    }
}
