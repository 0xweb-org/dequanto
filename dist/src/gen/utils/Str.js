"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Str = void 0;
const alot_1 = __importDefault(require("alot"));
var Str;
(function (Str) {
    function formatMethod(str) {
        str = trim(str);
        str = indent(str, '    ');
        return str;
    }
    Str.formatMethod = formatMethod;
    function trim(str) {
        let lines = str.split('\n');
        let min = (0, alot_1.default)(lines).min(line => {
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
    Str.trim = trim;
    function indent(str, indent) {
        return str
            .split('\n')
            .map(x => `${indent}${x}`)
            .join('\n');
    }
    Str.indent = indent;
})(Str = exports.Str || (exports.Str = {}));
