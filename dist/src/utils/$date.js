"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.$date = exports.DateTool = void 0;
const Formatter = __importStar(require("atma-formatter"));
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
        return Formatter.formatDate(date, format);
    }
    $date.format = format;
    function formatTimespan(ms) {
        let str = '';
        let SECOND = 1000;
        let MINUTE = 60 * SECOND;
        let HOUR = 60 * MINUTE;
        let DAY = 24 * HOUR;
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
        let rgx = /^([\d\.]+)(s|sec|seconds|m|mins?|h|hours?|d|days?|w|weeks?|months?|y|years?)$/;
        let match = rgx.exec(str);
        if (match == null) {
            throw new Error(`Invalid Humanize seconds. Pattern: ${rgx.toString()}. Got: ${str}`);
        }
        let val = parseFloat(match[1]);
        let unit = match[2];
        let MS = 1000;
        if (opts?.get === 's') {
            MS = 1;
        }
        MS *= direction;
        switch (unit) {
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
})($date = exports.$date || (exports.$date = {}));
