"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.$date = exports.DateTool = void 0;
class DateTool {
    constructor(date = new Date()) {
        this.date = date;
    }
    /**
     * - DD-MM-YYYYY (HH:mm)?
     * - DD.MM.YYYYY (HH:mm)?
     * - ISODate
     * - Ticks
     */
    static with(mix) {
        let date;
        if (typeof mix === 'string' || typeof mix === 'number') {
            date = $date.parse(mix);
        }
        else {
            date = mix;
        }
        return new DateTool(date);
    }
    static withNow() {
        return new DateTool();
    }
    clone() {
        this.date = new Date(this.date);
        return this;
    }
    add(x) {
        this.date = $date.additive(this.date, x);
        return this;
    }
    dayStart() {
        this.date = $date.dayStart(this.date);
        return this;
    }
    dayEnd() {
        this.date = $date.dayEnd(this.date);
        return this;
    }
    weekStart() {
        this.date = $date.weekStart(this.date);
        return this;
    }
    weekEnd() {
        this.date = $date.weekEnd(this.date);
        return this;
    }
    monthStart() {
        this.date = $date.monthStart(this.date);
        return this;
    }
    monthEnd() {
        this.date = $date.monthEnd(this.date);
        return this;
    }
    daysBetween(b) {
        return $date.daysBetween(this.date, b);
    }
    /** e.g. yyyy-MM-dd HH:mm */
    format(format) {
        return $date.format(this.date, format);
    }
    setMilliseconds(v) {
        this.date.setMilliseconds(v);
        return this;
    }
    setSeconds(v) {
        this.date.setSeconds(v);
        return this;
    }
    setMinutes(v) {
        this.date.setMinutes(v);
        return this;
    }
    setHours(h, min, sec, ms) {
        this.date.setHours(h);
        if (min != null)
            this.date.setMinutes(min);
        if (sec != null)
            this.date.setSeconds(sec);
        if (ms != null)
            this.date.setMilliseconds(ms);
        return this;
    }
    /** Sets the numeric day-of-the-month value of the Date object using local time. */
    setDate(v) {
        this.date.setDate(v);
        return this;
    }
    setMonth(v) {
        this.date.setMonth(v);
        return this;
    }
    setFullYear(v) {
        this.date.setFullYear(v);
        return this;
    }
    nextDay(h, min, s, ms) {
        this.date = $date.additive(this.date, '1d');
        if (h != null) {
            this.date.setHours(h);
        }
        if (min != null) {
            this.date.setMinutes(min);
        }
        if (s != null) {
            this.date.setSeconds(s);
        }
        if (ms != null) {
            this.date.setMilliseconds(ms);
        }
        return this;
    }
    toUnixTimestamp() {
        return $date.toUnixTimestamp(this.date);
    }
}
exports.DateTool = DateTool;
var $date;
(function ($date) {
    function tool(date = new Date()) {
        return DateTool.with(date);
    }
    $date.tool = tool;
    /** e.g. yyyy-MM-dd HH:mm */
    function format(date, format) {
        if (typeof date === 'string' || typeof date === 'number') {
            date = parse(date);
        }
        return Formatter.format(date, format);
    }
    $date.format = format;
    function formatTimespan(ms) {
        ms = Math.round(ms);
        let str = '';
        const SECOND = 1000;
        const MINUTE = 60 * SECOND;
        const HOUR = 60 * MINUTE;
        const DAY = 24 * HOUR;
        if (DAY < ms) {
            let days = Math.floor(ms / DAY);
            str += `${days}d`;
            ms -= days * DAY;
        }
        if (HOUR < ms) {
            let hours = Math.floor(ms / HOUR);
            str += ` ${hours}h`;
            ms -= hours * HOUR;
        }
        if (MINUTE < ms) {
            let minutes = Math.floor(ms / MINUTE);
            str += ` ${minutes}min`;
            ms -= minutes * MINUTE;
        }
        if (SECOND < ms) {
            let seconds = Math.floor(ms / SECOND);
            str += ` ${seconds}s`;
            ms -= seconds * SECOND;
        }
        if (0 < ms) {
            str += ` ${ms}ms`;
        }
        return str.trim();
    }
    $date.formatTimespan = formatTimespan;
    function dayStart(date = new Date()) {
        let result = new Date(date);
        result.setHours(0, 0, 0, 0);
        return result;
    }
    $date.dayStart = dayStart;
    function hourStart(date = new Date()) {
        let result = new Date(date);
        result.setMinutes(0, 0, 0);
        return result;
    }
    $date.hourStart = hourStart;
    function dayEnd(date = new Date()) {
        let result = new Date(date);
        result.setHours(23, 59, 59, 999);
        return result;
    }
    $date.dayEnd = dayEnd;
    function weekStart(date = new Date()) {
        let result = new Date(date);
        let day = result.getDay() - 1;
        if (day === -1) {
            day = 6;
        }
        result.setDate(result.getDate() - day);
        result.setHours(0, 0, 0, 0);
        return result;
    }
    $date.weekStart = weekStart;
    function weekEnd(date = new Date()) {
        let result = new Date(date);
        let day = result.getDay() - 1;
        if (day === -1) {
            day = 6;
        }
        result.setDate(result.getDate() + (6 - day));
        result.setHours(23, 59, 59, 999);
        return result;
    }
    $date.weekEnd = weekEnd;
    function monthStart(date = new Date()) {
        let result = new Date(date);
        result.setDate(1);
        result.setHours(0, 0, 0, 0);
        return result;
    }
    $date.monthStart = monthStart;
    function monthEnd(date = new Date()) {
        let result = new Date(date);
        result.setMonth(result.getMonth() + 1);
        result.setDate(1);
        result.setHours(0, 0, 0, -1);
        return result;
    }
    $date.monthEnd = monthEnd;
    /** date1 + X === date2 */
    function daysBetween(a, b, abs = true) {
        let aStart = dayStart(a);
        let bStart = dayStart(b);
        let diff = bStart.valueOf() - aStart.valueOf();
        if (abs)
            diff = Math.abs(diff);
        return Math.floor(diff / (24 * 60 * 60 * 1000));
    }
    $date.daysBetween = daysBetween;
    /** hour1 + X === hour2 */
    function hoursBetween(a, b, abs = true) {
        let aStart = hourStart(a);
        let bStart = hourStart(b);
        let diff = bStart.valueOf() - aStart.valueOf();
        if (abs)
            diff = Math.abs(diff);
        return Math.floor(diff / (60 * 60 * 1000));
    }
    $date.hoursBetween = hoursBetween;
    function minsBetween(a, b, abs = true) {
        if (typeof a === 'string') {
            a = parse(a);
        }
        if (typeof b === 'string') {
            b = parse(b);
        }
        let ms = b.valueOf() - a.valueOf();
        if (abs)
            ms = Math.abs(ms);
        return Math.floor(ms / (60 * 1000));
    }
    $date.minsBetween = minsBetween;
    /**
     * - DD-MM-YYYYY (HH:mm)?
     * - DD.MM.YYYYY (HH:mm)?
     * - ISODate
     * - Ticks
     */
    function parse(mix, default_) {
        if (mix instanceof Date) {
            return mix;
        }
        if (typeof mix === 'number') {
            return new Date(mix);
        }
        if (mix == null || mix === '') {
            return null;
        }
        if (mix.includes('T') || mix.includes('Z')) {
            return new Date(mix);
        }
        let format = mix;
        let H = 0;
        let Min = 0;
        let hours = /(\d{2}):(\d{2})/.exec(format);
        if (hours) {
            H = Number(hours[1]);
            Min = Number(hours[2]);
        }
        let Y = 0;
        let M = 1;
        let D = 1;
        let dateMatch = /(\d{2})[\.\-](\d{2})[\.\-](\d{4})/.exec(format);
        if (dateMatch) {
            D = Number(dateMatch[1]);
            M = Number(dateMatch[2]);
            Y = Number(dateMatch[3]);
        }
        else {
            dateMatch = /(\d{4})[\.\-](\d{2})[\.\-](\d{2})/.exec(format);
            if (dateMatch) {
                Y = Number(dateMatch[1]);
                M = Number(dateMatch[2]);
                D = Number(dateMatch[3]);
            }
        }
        if (Y === 0) {
            if (arguments.length > 1) {
                return default_;
            }
            throw new Error(`Invalid format ${format}`);
        }
        return new Date(Y, M - 1, D, H, Min);
    }
    $date.parse = parse;
    /**
     * s|sec|seconds|m|mins?|h|hours?|d|days?|w|weeks?|months?|y|years?
     * e.g: 2h
     * @param str
     * @param opts Default: ms
     */
    function parseTimespan(str, opts) {
        let direction = str[0] === '-' ? -1 : +1;
        if (direction === -1) {
            str = str.substring(1);
        }
        let rgx = /^(?<value>[\d\.]+)?(ms|s|sec|seconds|m|mins?|h|hours?|d|days?|w|weeks?|months?|y|years?)$/;
        let match = rgx.exec(str);
        if (match == null) {
            throw new Error(`Invalid Humanize seconds. Pattern: ${rgx.toString()}. Got: ${str}`);
        }
        let val = match.groups.value ? parseFloat(match[1]) : 1;
        let unit = match[2];
        let MS = 1000;
        if (opts?.get === 's') {
            MS = 1;
        }
        MS *= direction;
        switch (unit) {
            case 'ms':
                return val;
            case 's':
            case 'sec':
                return val * MS;
            case 'm':
            case 'min':
            case 'mins':
                return val * 60 * MS;
            case 'h':
            case 'hour':
            case 'hours':
                return val * 60 * 60 * MS;
            case 'd':
            case 'day':
            case 'days':
                return val * 60 * 60 * 24 * MS;
            case 'w':
            case 'week':
            case 'weeks':
                return val * 60 * 60 * 24 * 7 * MS;
            case 'month':
            case 'months':
                if (opts?.anchor) {
                    let date = new Date(opts.anchor);
                    date.setMonth(date.getMonth() + val * direction);
                    let result = date.valueOf() - opts.anchor.valueOf();
                    if (opts?.get === 's') {
                        result = Math.round(result / 1000);
                    }
                    return result;
                }
                return val * 60 * 60 * 24 * 31 * MS;
            case 'y':
            case 'year':
            case 'years':
                if (opts?.anchor) {
                    let date = new Date(opts.anchor);
                    date.setFullYear(date.getFullYear() + val * direction);
                    let result = date.valueOf() - opts.anchor.valueOf();
                    if (opts?.get === 's') {
                        result = Math.round(result / 1000);
                    }
                    return result;
                }
                return val * 60 * 60 * 24 * 365 * MS;
        }
        throw new Error(`Invalid units ${str}`);
    }
    $date.parseTimespan = parseTimespan;
    function additive(date, x) {
        let d = parse(date);
        let timestamp = d.getTime();
        if (typeof x === 'number') {
            return new Date(timestamp + x);
        }
        let ms = parseTimespan(x, { anchor: d });
        let target = new Date(timestamp + ms);
        let offset = d.getTimezoneOffset();
        var diff = offset - target.getTimezoneOffset();
        if (diff !== 0) {
            const h = diff / 60 | 0;
            target.setHours(target.getHours() - h);
        }
        return target;
    }
    $date.additive = additive;
    function equal(a, b, precision = 'ms') {
        let aYear = a.getFullYear();
        let bYear = b.getFullYear();
        if (aYear !== bYear) {
            return false;
        }
        if (precision === 'year') {
            return true;
        }
        let aMonth = a.getMonth();
        let bMonth = b.getMonth();
        if (aMonth !== bMonth) {
            return false;
        }
        if (precision === 'month') {
            return true;
        }
        let aDate = a.getDate();
        let bDate = b.getDate();
        if (aDate !== bDate) {
            return false;
        }
        if (precision === 'date') {
            return true;
        }
        let aHours = a.getHours();
        let bHours = b.getHours();
        if (aHours !== bHours) {
            return false;
        }
        if (precision === 'hour') {
            return true;
        }
        let aMins = a.getMinutes();
        let bMins = b.getMinutes();
        if (aMins !== bMins) {
            return false;
        }
        if (precision === 'minute') {
            return true;
        }
        let aSec = a.getSeconds();
        let bSec = b.getSeconds();
        if (aSec !== bSec) {
            return false;
        }
        if (precision === 'second') {
            return true;
        }
        let aMs = a.getMilliseconds();
        let bMs = b.getMilliseconds();
        if (aMs !== bMs) {
            return false;
        }
        return true;
    }
    $date.equal = equal;
    function isSameDay(a, b) {
        if (a.getFullYear() !== b.getFullYear()) {
            return false;
        }
        if (a.getMonth() !== b.getMonth()) {
            return false;
        }
        if (a.getDate() !== b.getDate()) {
            return false;
        }
        return true;
    }
    $date.isSameDay = isSameDay;
    function toUnixTimestamp(date) {
        return Math.floor(date.getTime() / 1000);
    }
    $date.toUnixTimestamp = toUnixTimestamp;
    let Formatter;
    (function (Formatter) {
        const _cultureInfo = {
            MONTH: [
                'January',
                'February',
                'March',
                'April',
                'May',
                'June',
                'July',
                'August',
                'September',
                'October',
                'November',
                'December',
            ],
            MONTH_SHORT: [
                'Jan',
                'Feb',
                'Mar',
                'Apr',
                'May',
                'June',
                'July',
                'Aug',
                'Sept',
                'Oct',
                'Nov',
                'Dec',
            ],
            DAY: [
                'Sunday',
                'Monday',
                'Tuesday',
                'Wednesday',
                'Thursday',
                'Friday',
                'Saturday',
            ],
            DAY_SHORT: [
                'Mon',
                'Tues',
                'Weds',
                'Thurs',
                'Fri',
                'Sat',
                'Sun',
            ],
        };
        let _date;
        function format(date, format) {
            _date = date;
            return format
                .replace('Mm', Mm)
                .replace('MMM', MMM)
                .replace('MM', MM)
                .replace('#M', $M)
                .replace('yyyy', yyyy)
                .replace('yy', yy)
                .replace('dd', dd)
                .replace('#d', $d)
                .replace('Dd', Dd)
                .replace('DDD', DDD)
                .replace('HH', HH)
                .replace('hh', hh)
                .replace('#h', $h)
                .replace('mm', mm)
                .replace('#m', $m)
                .replace('ss', ss)
                .replace('#s', $s)
                .replace('ms', ms);
        }
        Formatter.format = format;
        ;
        const yyyy = function () {
            return String(_date.getFullYear());
        };
        const yy = function () {
            return String(_date.getFullYear() % 100);
        };
        const $M = function () {
            return String(_date.getMonth() + 1);
        };
        const MM = function () {
            return pad(_date.getMonth() + 1);
        };
        const Mm = function () {
            return _cultureInfo.MONTH_SHORT[_date.getMonth()];
        };
        const MMM = function () {
            return _cultureInfo.MONTH[_date.getMonth()];
        };
        const $d = function () {
            return String(_date.getDate());
        };
        const dd = function () {
            return pad(_date.getDate());
        };
        const Dd = function () {
            return _cultureInfo.DAY_SHORT[_date.getMonth()];
        };
        const DDD = function () {
            return _cultureInfo.DAY_SHORT[_date.getMonth()];
        };
        const $H = function () {
            return String(_date.getHours());
        };
        const HH = function () {
            return pad(_date.getHours());
        };
        const hh = HH;
        const $h = $H;
        const $m = function () {
            return String(_date.getMinutes());
        };
        const mm = function () {
            return pad(_date.getMinutes());
        };
        const $s = function () {
            return String(_date.getSeconds());
        };
        const ss = function () {
            return pad(_date.getSeconds());
        };
        const ms = function () {
            return pad(_date.getMilliseconds());
        };
        function pad(value) {
            return value > 9 ? value : '0' + value;
        }
    })(Formatter || (Formatter = {}));
})($date = exports.$date || (exports.$date = {}));
