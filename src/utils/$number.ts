import { $require } from './$require';

export namespace $number {

    export function div (a: number, b: number, digits: number = 5) {
        let r = 10 ** digits;
        return Math.round(a * r / b) / r;
    }

    /**
     * [min, max)
     * @param min: includes
     * @param max: excludes
     */
     export function random(min: number, max: number) {
        $require.True(min < max, `Random Int expects max to be greater then min: ${min}..${max}`);
        return Math.random() * (max - min) + min;
    }
    /**
     * [min, max)
     * @param min: includes
     * @param max: excludes
     */
    export function randomInt(min: number, max: number) {
        $require.True(min < max, `Random Int expects max to be greater then min: ${min}..${max}`);
        return Math.floor(Math.random() * (max - min)) + min;
    }
    /**
     * [min, max)
     * @param min: includes
     * @param max: excludes
     */
    export function randomFloat(min: number, max: number, decimals: number = 0) {
        let decimalsFromNumber = 0;
        while (min * 10 ** decimalsFromNumber % 1 > 0 || max * 10 ** decimalsFromNumber % 1 > 0) {
            decimalsFromNumber++;
        }
        let val = 10 ** Math.max(decimals, decimalsFromNumber);
        return randomInt(min * val, max * val) / val;
    }
    export function parse (mix: string | number) {
        if (!mix) return 0;
        if (typeof mix === 'number') {
            return mix;
        }
        return parseFloat(mix.replace(/,+/g, '.'));
    }
    export function round (mix: string | number, digits: number = 0, round: 'ceil' | 'round' | 'floor' = 'round') {
        let number = typeof mix === 'string' ? Number(mix) : mix;
        if (isNaN(number)) {
            return number;
        }
        let factor = Math.pow(10, digits);
        let val = number * factor;
        let e = val - (val | 0);
        if (e < 0) {
            e *= -1;
        }
        if (e < .0001) {
            val = val | 0;
        }
        return Math[round](val) / factor;
    }
    export function parseOptional (mix, default_ = null) {
        if (mix == null) {
            return default_;
        }
        if (typeof mix === 'number') {
            return mix;
        }
        if (typeof mix === 'string') {

            switch (mix.toLowerCase()) {
                case 'einweg':
                    return 0.25;
                case 'mehrweg':
                    return 0.15;
            }

            let num = parseFloat(mix.replace(/,+/g, '.'));
            if (Number.isFinite(num) === false) {
                return default_;
            }
            return num;
        }
        throw new Error('Unsupported type to convert to number ' + typeof mix);
    }

}
