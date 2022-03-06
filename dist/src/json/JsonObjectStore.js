"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JsonObjectStore = void 0;
const memd_1 = __importDefault(require("memd"));
const atma_io_1 = require("atma-io");
const atma_utils_1 = require("atma-utils");
const class_json_1 = require("class-json");
const _csv_1 = require("@dequanto/utils/$csv");
class JsonObjectStore {
    constructor(options) {
        this.options = options;
        this.fs = new JsonFs(this.options.path, this.options.Type, this.options.map, this.options.format);
    }
    async get(opts) {
        if (this.fs.errored != null) {
            throw this.fs.errored;
        }
        if (this.data == null) {
            await this.restore();
        }
        let arr = this.data;
        if (opts?.cloned) {
            arr = class_json_1.JsonConvert.fromJSON(class_json_1.JsonConvert.toJSON(arr));
        }
        return arr;
    }
    async save(arr) {
        this.data = arr;
        await this.fs.write(arr);
        return arr;
    }
    getLock() {
        return this.fs.lock;
    }
    async restore() {
        let data = await this.fs.read(this.options.default);
        if (this.data != null) {
            // write was called inbetween
            return;
        }
        this.data = data;
    }
    async flush() {
        return await this.fs.write(this.data);
    }
}
exports.JsonObjectStore = JsonObjectStore;
class JsonFs {
    constructor(path, Type, mapFn, format) {
        this.path = path;
        this.Type = Type;
        this.mapFn = mapFn;
        this.format = format;
        this.errored = null;
        this.listeners = [];
        this.version = 0;
        this.busy = false;
        // private pathBak = this.path + '.bak';
        // private pathFilename = this.path.substring(this.path.lastIndexOf('/') + 1);
        this.lock = new atma_utils_1.class_Dfr;
        this._file = new atma_io_1.File(this.path, { threadSafe: true });
    }
    write(value) {
        this.value = value;
        let dfr = new atma_utils_1.class_Dfr;
        this.listeners.push({
            version: ++this.version,
            promise: dfr
        });
        if (this.busy === true) {
            this.pending = value;
            return dfr;
        }
        this.busy = true;
        this.lock.defer();
        this.writeInner(value);
        return dfr;
    }
    async read($default) {
        if (this.value != null) {
            return Promise.resolve(this.value);
        }
        let arr = await this.readInner();
        return this.value = arr ?? $default ?? {};
    }
    async readInner() {
        if (await this._file.existsAsync() === false) {
            return null;
        }
        let str = await this._file.readAsync({ skipHooks: true });
        let data = JsonUtil.fromString(str, {}, this.Type, this._file.uri.toLocalFile());
        if (this.mapFn) {
            data = Array.isArray(data)
                ? data.map(this.mapFn)
                : this.mapFn(data);
        }
        return data;
    }
    async writeInner(value) {
        try {
            let v = this.version;
            let str = JsonUtil.toString(value, this.Type, this.format, this._file.uri.toLocalFile());
            await this._file.writeAsync(str);
            this.callWriteListeners(v, null);
        }
        catch (error) {
            console.error(`JsonArrayStore.WriteInner`, error);
            this.errored = error;
        }
        finally {
            if (this.pending == null) {
                this.busy = false;
                this.lock.resolve();
                return;
            }
            let next = this.pending;
            this.pending = null;
            this.writeInner(next);
        }
    }
    callWriteListeners(v, error = null) {
        for (let i = 0; i < this.listeners.length; i++) {
            let x = this.listeners[i];
            if (x.version <= v) {
                try {
                    if (error != null) {
                        x.promise.reject(error);
                    }
                    else {
                        x.promise.resolve();
                    }
                }
                finally {
                    this.listeners.splice(i, 1);
                    i--;
                }
            }
        }
    }
}
__decorate([
    memd_1.default.deco.memoize({ perInstance: true })
], JsonFs.prototype, "readInner", null);
var JsonUtil;
(function (JsonUtil) {
    function mapToJson(data, Type) {
        if (Type == null) {
            return data;
        }
        return Array.isArray(data)
            ? data.map(x => class_json_1.JsonConvert.toJSON(x, { Type }))
            : class_json_1.JsonConvert.toJSON(data, { Type });
    }
    JsonUtil.mapToJson = mapToJson;
    function mapFromJson(json, Type) {
        if (Type == null) {
            return json;
        }
        return Array.isArray(json)
            ? json.map(x => class_json_1.JsonConvert.fromJSON(x, { Type }))
            : class_json_1.JsonConvert.fromJSON(json, { Type });
    }
    JsonUtil.mapFromJson = mapFromJson;
    function toString(data, Type, format, path) {
        if (data == null) {
            return null;
        }
        let json = mapToJson(data, Type);
        return path.endsWith('.csv')
            ? CSV.stringify(json)
            : JSON.stringify(json, null, format ? '  ' : null);
    }
    JsonUtil.toString = toString;
    function fromString(str, $default, Type, path) {
        if (str == null) {
            if (Type) {
                return class_json_1.JsonConvert.fromJSON($default, { Type });
            }
            return $default;
        }
        try {
            let json = path.endsWith('.csv')
                ? CSV.parse(str)
                : JSON.parse(str);
            return mapFromJson(json, Type);
        }
        catch (err) {
            return $default;
        }
    }
    JsonUtil.fromString = fromString;
})(JsonUtil || (JsonUtil = {}));
var CSV;
(function (CSV) {
    function parse(str) {
        return _csv_1.$csv.parseToRows(str);
    }
    CSV.parse = parse;
    function stringify(rows) {
        return _csv_1.$csv.stringify({
            rows: rows
        });
    }
    CSV.stringify = stringify;
})(CSV || (CSV = {}));
