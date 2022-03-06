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
exports.JsonArrayStore = void 0;
const atma_io_1 = require("atma-io");
const atma_utils_1 = require("atma-utils");
const memd_1 = __importDefault(require("memd"));
const alot_1 = __importDefault(require("alot"));
const class_json_1 = require("class-json");
class JsonArrayStore {
    constructor(options) {
        this.options = options;
        this.fs = new JsonArrayFs(this.options.path, this.options.Type, this.options.map, this.options.format);
        let keyFn = this.options.key;
        if (keyFn == null) {
            throw new Error('Key getter must be defined');
        }
    }
    async query() {
        let arr = await this.getAll();
        return (0, alot_1.default)(arr);
    }
    async getAll(opts) {
        if (this.fs.errored != null) {
            throw this.fs.errored;
        }
        if (this.array == null) {
            await this.restore();
        }
        let arr = this.array;
        if (opts?.cloned) {
            arr = class_json_1.JsonConvert.fromJSON(class_json_1.JsonConvert.toJSON(arr));
        }
        return arr;
    }
    async getDict() {
        if (this.fs.errored != null) {
            throw this.fs.errored;
        }
        if (this.hash != null) {
            return this.hash;
        }
        await this.restore();
        return this.hash;
    }
    async getSingle(key) {
        if (this.fs.errored != null) {
            throw this.fs.errored;
        }
        if (this.hash == null) {
            await this.restore();
        }
        return this.hash[String(key)];
    }
    async saveAll(arr) {
        let keyFn = this.options.key;
        this.array = arr;
        this.hash = (0, alot_1.default)(arr).toDictionary(x => String(keyFn(x)), x => x);
        await this.fs.write(arr);
        return arr;
    }
    async upsert(x) {
        if (this.hash == null) {
            await this.restore();
        }
        let entry = this.upsertSync(x);
        await this.flush();
        return entry;
    }
    async remove(key) {
        if (this.hash == null) {
            await this.restore();
        }
        let entry = this.removeSync(key);
        await this.flush();
        return entry;
    }
    async upsertMany(arr) {
        if (this.hash == null) {
            await this.restore();
        }
        let entries = arr.map(x => this.upsertSync(x));
        await this.flush();
        return entries;
    }
    getLock() {
        return this.fs.lock;
    }
    async restore() {
        let arr = await this.fs.read();
        let keyFn = this.options.key;
        if (this.array != null) {
            // write was called inbetween
            return;
        }
        this.array = arr;
        this.hash = (0, alot_1.default)(arr).toDictionary(x => String(keyFn(x)), x => x);
    }
    async flush() {
        return await this.fs.write(this.array);
    }
    /** without flush */
    upsertSync(x) {
        let keyFn = this.options.key;
        let key = String(keyFn(x));
        if (key == null) {
            throw new Error(`Key is undefined in ${JSON.stringify(x)}`);
        }
        let current = this.hash[key];
        if (current) {
            for (let prop in x) {
                current[prop] = x[prop];
            }
            return current;
        }
        let entry = x;
        let Type = this.options.Type;
        if (Type != null && entry instanceof Type === false) {
            entry = new Type(x);
        }
        this.array.push(entry);
        this.hash[key] = entry;
        return entry;
    }
    removeSync(key) {
        let current = this.hash[key];
        if (current == null) {
            return null;
        }
        delete this.hash[key];
        let i = this.array.indexOf(current);
        if (i > -1) {
            this.array.splice(i, 1);
        }
        return current;
    }
}
exports.JsonArrayStore = JsonArrayStore;
class JsonArrayFs {
    constructor(path, Type, mapFn, format) {
        this.path = path;
        this.Type = Type;
        this.mapFn = mapFn;
        this.format = format;
        this.errored = null;
        this.listeners = [];
        this.version = 0;
        this.busy = false;
        this.pathBak = this.path + '.bak';
        this.pathFilename = this.path.substring(this.path.lastIndexOf('/') + 1);
        this.lock = new atma_utils_1.class_Dfr;
        this.lock.resolve();
    }
    write(arr) {
        this.array = arr;
        let dfr = new atma_utils_1.class_Dfr;
        this.listeners.push({
            version: ++this.version,
            promise: dfr
        });
        if (this.busy === true) {
            this.pending = arr;
            return dfr;
        }
        this.busy = true;
        this.lock.defer();
        this.writeInner(arr);
        return dfr;
    }
    async read() {
        if (this.array != null) {
            return Promise.resolve(this.array);
        }
        let arr = await this.readInner();
        return this.array = arr;
    }
    async readInner() {
        let existsBak = await atma_io_1.File.existsAsync(this.pathBak);
        if (existsBak) {
            let arr = await Fs.read(this.pathBak);
            if (this.array) {
                // When `write` was called inbetween `exists` check and now
                return this.array;
            }
            if (arr) {
                await atma_io_1.File.renameAsync(this.pathBak, this.pathFilename);
                return arr;
            }
            else {
                await atma_io_1.File.removeAsync(this.pathBak);
            }
        }
        let exists = await atma_io_1.File.existsAsync(this.path);
        if (exists === false) {
            return [];
        }
        if (!this.path) {
            throw new Error(`Read inner: ${this.path}/${this.pathBak} is undefined`);
        }
        let arr = await atma_io_1.File.readAsync(this.path);
        if (this.Type) {
            let rgx = Math.round(Math.random() * 100000);
            let key = `JsonArray.Type ${rgx}`;
            console.time(key);
            arr = arr.map(x => class_json_1.JsonConvert.fromJSON(x, { Type: this.Type }));
            console.timeEnd(key);
        }
        if (this.mapFn) {
            arr = arr.map(this.mapFn);
        }
        return arr;
    }
    async writeInner(arr) {
        try {
            let v = this.version;
            let data = Fs.serialize(arr, this.Type, this.format);
            await atma_io_1.File.writeAsync(this.pathBak, data);
            await atma_io_1.File.renameAsync(this.pathBak, this.pathFilename);
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
], JsonArrayFs.prototype, "readInner", null);
var Fs;
(function (Fs) {
    function serialize(arr, Type, format) {
        if (Type) {
            arr = arr.map(x => class_json_1.JsonConvert.toJSON(x));
        }
        return JSON.stringify(arr, null, format ? '  ' : null);
    }
    Fs.serialize = serialize;
    function parse(str) {
        return JSON.parse(str);
    }
    Fs.parse = parse;
    async function read(path) {
        if (!path) {
            throw new Error(`${path} is undefined`);
        }
        let str = await atma_io_1.File.readAsync(path, { skipHooks: true, encoding: 'utf8' });
        if (str.length === 0) {
            return null;
        }
        try {
            return JSON.parse(str);
        }
        catch (error) {
            return null;
        }
    }
    Fs.read = read;
})(Fs || (Fs = {}));
