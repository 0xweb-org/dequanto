
export namespace $csv {
    class CSV {
        /** Lazy library reference */
        private papa = require('papaparse');
        parse (csv: string) {
            return this.papa.parse(csv);
        }
        serialize (params: {
            fields?: string[]
            data: string[][]
        }) {

        }
    }

    export function stringify(data: { header?: string[], rows: (any[])[]}) {
        if (Array.isArray(data.rows) === false) {
            console.error('Rows', data.rows);
            throw new Error(`To serialize data to csv, it should be an array of rows`)
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

    export function parseToObjects <T = any> (csv: string, columns: string[], opts?: { hasHeader: boolean }): T[] {
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

            let obj = {} as T;
            columns.map((key, i) => {
                if (key) {
                    obj[key] = row[i];
                }
            });
            return obj;
        }).filter(Boolean);
    }

    export function parseToRows (csv: string): string[][] {
        let csvParser = new CSV();

        let result = csvParser.parse(csv);
        let rows = result.data;
        return rows;
    }
}
