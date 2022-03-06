"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
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
exports.$csv = void 0;
const Papa = __importStar(require("papaparse"));
var $csv;
(function ($csv) {
    function stringify(data) {
        if (Array.isArray(data.rows) === false) {
            console.error('Rows', data.rows);
            throw new Error(`To serialize data to csv, it should be an array of rows`);
        }
        if (data.rows.length > 0) {
            data.rows.forEach((row, i) => {
                if (row != null && Array.isArray(row) === false) {
                    console.error(`Columns at row ${i} must be an array, got`, row);
                    throw new Error(`To serialize data to csv, each row must be an array`);
                }
            });
        }
        let str = Papa.unparse({
            fields: data.header,
            data: data.rows
        });
        return str;
    }
    $csv.stringify = stringify;
    function parseToObjects(csv, columns, opts) {
        let result = Papa.parse(csv);
        let rows = result.data;
        if (opts?.hasHeader === true) {
            rows = rows.slice(1);
        }
        return rows.map(row => {
            if (row.length === 0) {
                return null;
            }
            if (row.length === 1 && row[0] === '') {
                return null;
            }
            let obj = {};
            columns.map((key, i) => {
                if (key) {
                    obj[key] = row[i];
                }
            });
            return obj;
        }).filter(Boolean);
    }
    $csv.parseToObjects = parseToObjects;
    function parseToRows(csv) {
        let result = Papa.parse(csv);
        let rows = result.data;
        return rows;
    }
    $csv.parseToRows = parseToRows;
})($csv = exports.$csv || (exports.$csv = {}));
