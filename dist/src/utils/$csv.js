"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.$csv = void 0;
var $csv;
(function ($csv) {
    class CSV {
        constructor() {
            /** Lazy library reference */
            this.papa = require('papaparse');
        }
        parse(csv) {
            return this.papa.parse(csv);
        }
        serialize(params) {
        }
    }
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
        let csv = new CSV();
        let str = csv.serialize({
            fields: data.header,
            data: data.rows
        });
        return str;
    }
    $csv.stringify = stringify;
    function parseToObjects(csv, columns, opts) {
        let csvParser = new CSV();
        let result = csvParser.parse(csv);
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
        let csvParser = new CSV();
        let result = csvParser.parse(csv);
        let rows = result.data;
        return rows;
    }
    $csv.parseToRows = parseToRows;
})($csv = exports.$csv || (exports.$csv = {}));
