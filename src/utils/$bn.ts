import { $str } from '@dequanto/solidity/utils/$str';
import { $bigint } from './$bigint';
import { $require } from './$require';

type TNumeric = BigFloat | string | number | bigint;

// impl. https://github.com/MikeMcl/bignumber.js

enum EBigFloatType {
    FLOAT,
    POSITIVE_INFINITY,
    NEGATIVE_INFINITY,
    NAN,
}


class BigFloat {


    constructor(public value: bigint, public mantissa: bigint = 1n) {

    }

    toNumber () {
        return Number(this.value)/Number(this.mantissa);
    }
    toString () {
        let isNegative = this.value < 0n;
        let int = this.value / this.mantissa;
        let str = `${int}`;
        let [toExpMin, toExpMax] = CONFIG.EXPONENTIAL_AT;

        let fractional = $bigint.abs(this.value % this.mantissa);
        if (fractional > 0n) {
            let digitsMantissa = $num.getDigits(this.mantissa) - 1;
            let digitsFractional = $num.getDigits(fractional) - 1;
            let fractionalStr = $bigint.abs(fractional).toString().padStart(digitsMantissa, '0').replace(/0+$/, '');
            str += `.${fractionalStr}`;

            if (int === 0n && digitsFractional - digitsMantissa <= toExpMin) {
                // to exponential notation;
                let diff = digitsMantissa - digitsFractional;
                fractionalStr = $bigint.abs(fractional).toString().replace(/0+$/, '');
                let arr = [ fractionalStr[0] ];
                if (fractionalStr.length > 1) {
                    arr.push(fractionalStr.substring(1))
                }
                str = `${arr.join('.')}e-${diff}`;
            }
        }
        let intDigits = $num.getDigits(int);
        if (intDigits > toExpMax) {
            // to exponential notation;
            let [ intPart, fractionalPart ] = str.split('.');
            let intPartN, fractionalPartN;
            if (isNegative) {
                intPartN = `-${intPart[1]}`
                fractionalPartN = `${intPart.substring(2)}${fractionalPart ?? ''}`;
            } else {
                intPartN = intPart[0];
                fractionalPartN = `${intPart.substring(1)}${fractionalPart ?? ''}`;
            }
            fractionalPartN = fractionalPartN.replace(/0+$/, '');
            str = `${intPartN}.${fractionalPartN}e+${intDigits - 1}`;
        }
        if (isNegative && int === 0n && fractional > 0n) {
            str = `-${str}`;
        }
        return str;
    }
    toBigInt () {
        let int = this.value / this.mantissa;
        return int;
    }

    // a-b
    minus (mix: TNumeric) {
        return math.minus(this, from(mix));
    }
    // a+b
    plus (mix: TNumeric) {
        return math.plus(this, from(mix));
    }

    // a*b
    multipliedBy (mix: TNumeric) {
        return math.mult(this, from(mix));
    }
    // a*b
    times (mix: TNumeric) {
        return math.mult(this, from(mix));
    }
    // a*b
    mult (mix: TNumeric) {
        return math.mult(this, from(mix));
    }

    // a/b
    dividedBy (mix: TNumeric) {
        return math.div(this, from(mix));
    }
    // a/b
    div (mix: TNumeric) {
        return math.div(this, from(mix));
    }

    isLessThan(mix: TNumeric) {
        return math.lt(this, from(mix));
    }
    lt(mix: TNumeric) {
        return math.lt(this, from(mix));
    }
    isLessThanOrEqual(mix: TNumeric) {
        return math.lte(this, from(mix));
    }
    lte(mix: TNumeric) {
        return math.lte(this, from(mix));
    }

    isGreaterThan(mix: TNumeric) {
        return math.gt(this, from(mix));
    }
    gt(mix: TNumeric) {
        return math.gt(this, from(mix));
    }
    isGreaterThanOrEqualTo(mix: TNumeric) {
        return math.gte(this, from(mix));
    }
    gte(mix: TNumeric) {
        return math.gte(this, from(mix));
    }

    modulo(mix: TNumeric) {
        return math.mod(this, from(mix));
    }
    mod(mix: TNumeric) {
        return math.mod(this, from(mix));
    }

    //Supports negative and fractional numbers
    pow (exponent: number | bigint) {
        return math.pow(this, exponent)
    }

    squareRoot () {
        return math.rootNth(this, 2n);
    }
    sqrt () {
        return math.rootNth(this, 2n);
    }
    root (nth: bigint) {
        return math.rootNth(this, nth);
    }


    absoluteValue () {
        return math.abs(this);
    }
    abs () {
        return math.abs(this);
    }

    /**
     * Math.ceil = ROUNDING_MODE.ROUND_UP
     * Math.floor = ROUNDING_MODE.ROUND_DOWN
     * Math.round = ROUNDING_MODE.ROUND_HALF_CEIL
     */
    dp (dp: number, rm: ROUNDING_MODE = ROUNDING_MODE.ROUND_DOWN) {
        return math.dp(this, dp, rm);
    }
    decimalPlaces (dp: number, rm: ROUNDING_MODE = ROUNDING_MODE.ROUND_DOWN) {
        return math.dp(this, dp, rm);
    }

    compact () {
        let { value, mantissa } = this;
        let isNegative = value <= 0n;
        if (isNegative) {
            value = -value;
        }
        while (value >= 10n && mantissa >= 10n) {
            if (value % 10n === 0n && mantissa % 10n === 0n) {
                value /= 10n;
                mantissa /= 10n;
                continue;
            }
            break;
        }
        if (isNegative) {
            value = -value;
        }
        return new BigFloat(value, mantissa);
    }

    static from (mix: TNumeric) {
        return from(mix);
    }
}

function from (mix: TNumeric): BigFloat {
    if (mix instanceof BigFloat) {
        return mix;
    }
    if (typeof mix === 'string') {
        mix = mix.trim();
        let eps = 1n;
        if (/e/i.test(mix)) {
            let match = mix.match(/e(?<eps>[-+]?(?<value>\d+))/i);
            eps = 10n ** BigInt(match.groups.value);
            mix = mix.replace(match[0], '');
            if (match.groups.eps[0] === '-') {
                eps = -eps;
            }
        }

        let result: BigFloat;
        if (mix.includes('.')) {
            let [ integer, fractional ] = mix.split('.');
            let nr = BigInt(`${integer}${fractional}`);
            let mantissa = 10n**BigInt(fractional.length);
            result = new BigFloat(nr, mantissa);
        } else {
            // hex or any int
            result = BigFloat.from(BigInt(mix))
        }
        if (eps !== 1n) {
            if (eps > 0n) {
                result = result.mult(eps).compact();
            } else {
                result = result.div(-eps).compact();
            }
        }
        return result;
    }
    if (typeof mix === 'bigint') {
        return new BigFloat(mix);
    }
    if (typeof mix === 'number') {
        if (isFinite(mix) === false) {
            throw new Error(`Cannot calculate with Infinity`);
        }
        if (isNaN(mix)) {
            throw new Error(`Cannot calculate with NaN`);
        }

        if (Math.abs(mix) > Number.MAX_SAFE_INTEGER) {
            throw new Error(`Provided Number (${mix}) is out of safe integer range`);
        }
        let mantissa = $num.getMantissa(mix);
        let valueNr = Math.floor(mix * Number(mantissa));
        return new BigFloat( BigInt(valueNr), mantissa);
    }
    throw new Error(`Invalid numeric value ${mix}`);
}

namespace $num {
    export function getMantissa(value: number): bigint {
        let nr = value;
        let mantissa = 1n;
        while (nr - Math.trunc(nr) !== 0) {
            nr *= 10;
            mantissa *= 10n;
        }
        return mantissa;
    }
    export function getDigits (value: bigint) {
        let count = 0;
        if (value < 0n) {
            value = -value;
        }
        while (value > 0n) {
            value /= 10n;
            count++;
        }
        return count;
    }
}

export enum ROUNDING_MODE {
    // Rounds away from zero
    ROUND_UP = 0,
    // Rounds towards zero
    ROUND_DOWN = 1,
    // Rounds towards Infinity
    ROUND_CEIL = 2,
    // Rounds towards -Infinity
    ROUND_FLOOR = 3,

    // Rounds towards nearest neighbor. If equidistant, rounds away from zero
    ROUND_HALF_UP = 4,
    // Rounds towards nearest neighbor. If equidistant, rounds towards zero
    ROUND_HALF_DOWN = 5,
    // Rounds towards nearest neighbor. If equidistant, rounds towards even neighbor
    ROUND_HALF_EVEN = 6,
    // Rounds towards nearest neighbor. If equidistant, rounds towards Infinity
    // Equivalent to Math.round
    ROUND_HALF_CEIL = 7,
    // Rounds towards nearest neighbor. If equidistant, rounds towards -Infinity
    ROUND_HALF_FLOOR = 8,
}


namespace math {


    export function abs (a: BigFloat) {
        return new BigFloat(a.value < 0n ? -a.value : a.value, a.mantissa);
    }
    export function dp (a: BigFloat, dp: number, rm: ROUNDING_MODE = ROUNDING_MODE.ROUND_DOWN) {
        let precision = $num.getDigits(a.mantissa) - 1;
        if (precision <= dp) {
            return new BigFloat(a.value, a.mantissa);
        }
        let truncMantissa = 10n**BigInt(precision - dp);
        let truncValue = a.value % truncMantissa;
        // rounded down
        let value = a.value / truncMantissa;
        let roundingBit = getRoundingBit(value, truncValue, truncMantissa, rm);
        return new BigFloat(value + roundingBit, 10n ** BigInt(dp));
    }
    export function mult (a: BigFloat, b: BigFloat): BigFloat {
        let value = a.value * b.value;
        let mantissa = a.mantissa * b.mantissa;
        return new BigFloat(value, mantissa);
    }
    export function div (a: BigFloat, b: BigFloat): BigFloat {
        if (a.value === 0n) {
            return from(0);
        }
        if ($bigint.abs(a.value) < $bigint.abs(b.value)) {
            let aDigits = $num.getDigits(a.value);
            let bDigits = $num.getDigits(b.value);
            let increasedMantissa = 10n ** BigInt(bDigits - aDigits);
            a = new BigFloat(a.value * increasedMantissa, a.mantissa * increasedMantissa);
        }

        let precisionExp = Math.max(CONFIG.DECIMAL_PLACES + 6, 18) + Math.max($num.getDigits(a.mantissa), $num.getDigits(b.mantissa)) - 1;
        let precision = 10n**BigInt(precisionExp);
        let aValue = a.value * precision;
        let aMantissa = a.mantissa * precision;

        let value = aValue / b.value;
        let mantissa = aMantissa / b.mantissa;
        // console.log(a, b);
        //console.log(`Value`, aValue, b.value, 'Result\n', value);

        let fractional = $bigint.abs((aValue * 10n / b.value) % value);
        let fractionalMantissa = 10n;
        let roundingBit = getRoundingBit(value, fractional, fractionalMantissa, ROUNDING_MODE.ROUND_DOWN);
        //console.log(a, b, 'bit', roundingBit, `result`, value, mantissa, 'dp', CONFIG.DECIMAL_PLACES, precisionExp);
        value += roundingBit;
        return new BigFloat(value, mantissa);
    }
    export function mod (a: BigFloat, b: BigFloat): BigFloat {
        let [ aCommon, bCommon ] = toSameMantissa(a, b);
        let value = aCommon.value % bCommon.value;
        return new BigFloat(value, aCommon.mantissa);
    }
    export function pow(basis: BigFloat, exponent: number | bigint) {
        if (typeof exponent === 'number' && Math.floor(exponent) === exponent) {
            exponent = BigInt(exponent);
        }
        if (typeof exponent === 'bigint') {
            if (exponent >= 0n) {
                return new BigFloat(basis.value ** exponent, basis.mantissa ** exponent);
            }
            return from(1).div(pow(basis, -exponent));
        }
        // convert float to x^(m/n)
        let m = exponent;
        let n = 1n;
        while (Math.floor(m) !== m) {
            m *= 10;
            n *= 10n;
        }
        return rootNth(pow(basis, BigInt(m)), n);

    }
    export function rootNth(a: BigFloat, k = 2n) {
        const mantissa = 10n**18n;
        let rootValue = calcRootNthBigInt(a.value * mantissa, k);
        let rootMantissa = calcRootNthBigInt(a.mantissa * mantissa, k);

        console.log(a.value, rootValue, rootMantissa);
        return div(new BigFloat(rootValue, mantissa), new BigFloat(rootMantissa, mantissa));
    }

    function calcRootNthBigInt(value: bigint, k = 2n) {
        if (value < 0n) {
            throw Error(`Root of ${value} is not allowed`);
        }

        let o = 0n;
        let x = value;
        let limit = 1000;

        while (x ** k !== k && x !== o && --limit) {
            o = x;
            x = ((k - 1n) * x + value / x ** (k - 1n)) / k;
        }
        return x;
    }

    export function plus (a: BigFloat, b: BigFloat): BigFloat {
        let [ aCommon, bCommon ] = toSameMantissa(a, b);
        return new BigFloat(aCommon.value + bCommon.value, aCommon.mantissa);
    }
    export function minus (a: BigFloat, b: BigFloat): BigFloat {
        let [ aCommon, bCommon ] = toSameMantissa(a, b);
        return new BigFloat(aCommon.value - bCommon.value, aCommon.mantissa);
    }

    export function lt (a: BigFloat, b: BigFloat): boolean {
        let [ aCommon, bCommon ] = toSameMantissa(a, b);
        return aCommon.value < bCommon.value;
    }
    export function lte (a: BigFloat, b: BigFloat): boolean {
        let [ aCommon, bCommon ] = toSameMantissa(a, b);
        return aCommon.value <= bCommon.value;
    }
    export function gt (a: BigFloat, b: BigFloat): boolean {
        let [ aCommon, bCommon ] = toSameMantissa(a, b);
        return aCommon.value > bCommon.value;
    }
    export function gte (a: BigFloat, b: BigFloat): boolean {
        let [ aCommon, bCommon ] = toSameMantissa(a, b);
        return aCommon.value >= bCommon.value;
    }


    export function toSameMantissa (a: BigFloat, b: BigFloat): [ BigFloat, BigFloat ] {
        if (a.mantissa === b.mantissa) {
            return [ a, b ]
        }
        let min = a.mantissa < b.mantissa ? a : b;
        let max = min === a ? b : a;
        let increasePrecision = 1n;
        let common = min.mantissa;
        while (common < max.mantissa) {
            common *= 10n;
            increasePrecision *= 10n;
        }
        $require.eq(common, max.mantissa);

        let minNew = new BigFloat(min.value * increasePrecision, common);
        let maxNew = new BigFloat(max.value, common);
        return min === a ? [ minNew, maxNew ] : [ maxNew, minNew ];
    }


    function getRoundingBit (value: bigint, truncatedValue: bigint, truncMantissa: bigint, rm?: ROUNDING_MODE): 1n | -1n | 0n {
        if (truncatedValue === 0n ) {
            return 0n;
        }

        //|| truncatedValue * 10n / truncMantissa === 0n
        if (rm == null) {
            rm = CONFIG.ROUNDING_MODE;
        }
        if (rm === ROUNDING_MODE.ROUND_DOWN) {
            // 1.1 -> 1 | -1.1 -> -1
            return 0n;
        }
        if (rm === ROUNDING_MODE.ROUND_UP) {
            // 1.1 -> 2 | -1.1 -> -2
            return truncatedValue > 0n ? 1n : -1n;
        }
        if (rm === ROUNDING_MODE.ROUND_CEIL) {
            // 1.1 -> 2 | -1.1 -> -1
            return truncatedValue > 0n? 1n : 0n;
        }
        if (rm === ROUNDING_MODE.ROUND_FLOOR) {
            // 1.1 -> 1 | -1.1 -> -2
            return truncatedValue > 0n ? 0n : -1n;
        }

        let half = 5n * truncMantissa / 10n
        if (rm === ROUNDING_MODE.ROUND_HALF_UP) {
            // Rounds towards nearest neighbor. If equidistant, rounds away from zero
            if (truncatedValue > 0n) {
                // 1.3 -> 0 | 1.6 -> 1
                return truncatedValue >= half ? 1n : 0n;
            }
            // -2.6 -> -1 | -2.5 -> 0
            return -truncatedValue < half ? 0n : -1n;
        }
        if (rm === ROUNDING_MODE.ROUND_HALF_DOWN) {
            // Rounds towards nearest neighbor. If equidistant, rounds towards zero
            if (truncatedValue > 0n) {
                // 1.3 -> 0 | 1.6 -> 1
                return truncatedValue > half ? 1n : 0n;
            }
            // -2.6 -> 1 | -2.5 -> 0
            return -truncatedValue <= half ? 0n : -1n;
        }
        if (rm === ROUNDING_MODE.ROUND_HALF_EVEN) {
            if (value % 2n === 0n) {
                return getRoundingBit(value, truncatedValue, truncMantissa, ROUNDING_MODE.ROUND_HALF_DOWN);
            } else {
                return getRoundingBit(value, truncatedValue, truncMantissa, ROUNDING_MODE.ROUND_HALF_UP);
            }
        }
        if (rm === ROUNDING_MODE.ROUND_HALF_CEIL) {
            // Rounds towards nearest neighbor. If equidistant, rounds towards Infinity
            // ~~ Math.round
            if (truncatedValue > 0n) {
                // 1.3 -> 0 | 1.6 -> 1
                return truncatedValue >= half ? 1n : 0n;
            }
            // -2.5 -> -1 | -2.3 -> -0
            return -truncatedValue <= half ? 0n : -1n;
        }

        if (rm === ROUNDING_MODE.ROUND_HALF_FLOOR) {
            // Rounds towards nearest neighbor. If equidistant, rounds towards -Infinity
            if (truncatedValue > 0n) {
                // 1.3 -> 0 | 1.6 -> 1
                return truncatedValue > half ? 1n : 0n;
            }
            // -2.5 -> -1 | -2.3 -> -0
            return -truncatedValue < half ? 0n : -1n;
        }

        return 0n;
    }
}


const CONFIG = {
    DECIMAL_PLACES: 18,
    ROUNDING_MODE: ROUNDING_MODE.ROUND_HALF_UP,
    EXPONENTIAL_AT: [-7, 21],
    RANGE: 1E9
}



export namespace $bignumber {
    export function from (mix: TNumeric) {
        return BigFloat.from(mix);
    }
    export function config (cfg: {
        DECIMAL_PLACES?: number
        ROUNDING_MODE?: number
        EXPONENTIAL_AT?: [number, number]
        RANGE?: number
    }) {
        for (let key in cfg) {
            CONFIG[key] = cfg[key];
        }
    }
}
