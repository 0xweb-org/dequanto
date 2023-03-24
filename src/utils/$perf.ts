import { $date } from './$date';

export namespace $perf {
    export function start () {
        let start = Date.now();

        return function end (opts?: { reset?: boolean, return: 'ms' | 'format' }) {
            let ms = Date.now() - start;

            if (opts?.reset ?? true) {
                start = Date.now();
            }
            if (opts?.return === 'ms') {
                return ms;
            }

            return $date.formatTimespan(ms);
        }
    }
}
