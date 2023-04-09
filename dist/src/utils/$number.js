"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.$number = void 0;
const _require_1 = require("./$require");
var $number;
(function ($number) {
    function div(a, b, digits = 5) {
        let r = 10 ** digits;
        return Math.round(a * r / b) / r;
    }
    $number.div = div;
    /**
     * [min, max)
     * @param min: includes
     * @param max: excludes
     */
    function random(min, max) {
        _require_1.$require.True(min < max, `Random Int expects max to be greater then min: ${min}..${max}`);
        return Math.random() * (max - min) + min;
    }
    $number.random = random;
    /**
     * [min, max)
     * @param min: includes
     * @param max: excludes
     */
    function randomInt(min, max) {
        _require_1.$require.True(min < max, `Random Int expects max to be greater then min: ${min}..${max}`);
        return Math.floor(Math.random() * (max - min)) + min;
    }
    $number.randomInt = randomInt;
    /**
     * [min, max)
     * @param min: includes
     * @param max: excludes
     */
    function randomFloat(min, max, decimals = 0) {
        let decimalsFromNumber = 0;
        while (min * 10 ** decimalsFromNumber % 1 > 0 || max * 10 ** decimalsFromNumber % 1 > 0) {
            decimalsFromNumber++;
        }
        let val = 10 ** Math.max(decimals, decimalsFromNumber);
        return randomInt(min * val, max * val) / val;
    }
    $number.randomFloat = randomFloat;
    function parse(mix) {
        if (!mix)
            return 0;
        if (typeof mix === 'number') {
            return mix;
        }
        let factor = null;
        // string
        let c = mix[mix.length - 1];
        if (c === 'k' || c === 'K') {
            factor = 1000;
            mix = mix.substring(0, mix.length - 1);
        }
        if (c === 'm' || c === 'M') {
            factor = 1000000;
            mix = mix.substring(0, mix.length - 1);
        }
        if (c === 'b' || c === 'B') {
            factor = 1000000000;
            mix = mix.substring(0, mix.length - 1);
        }
        let value = parseFloat(mix.replace(/,+/g, '.'));
        if (isNaN(value)) {
            throw new Error(`Invalid number to parse: ${mix}`);
        }
        if (factor != null) {
            value *= factor;
        }
        return value;
    }
    $number.parse = parse;
    function round(mix, digits = 0, round = 'round') {
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
    $number.round = round;
    function parseOptional(mix, default_ = null) {
        if (mix == null) {
            return default_;
        }
        if (typeof mix === 'number') {
            return mix;
        }
        if (typeof mix === 'string') {
            let num = parseFloat(mix.replace(/,+/g, '.'));
            if (Number.isFinite(num) === false) {
                return default_;
            }
            return num;
        }
        throw new Error('Unsupported type to convert to number ' + typeof mix);
    }
    $number.parseOptional = parseOptional;
    function toHex(num) {
        return `0x` + Number(num).toString(16);
    }
    $number.toHex = toHex;
})($number = exports.$number || (exports.$number = {}));
