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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.$http = void 0;
const atma_utils_1 = require("atma-utils");
const axios_1 = __importDefault(require("axios"));
const _path_1 = require("./$path");
const _require_1 = require("./$require");
const fs = __importStar(require("fs"));
const atma_io_1 = require("atma-io");
var $http;
(function ($http) {
    $http.get = axios_1.default.get;
    $http.post = axios_1.default.post;
    $http.put = axios_1.default.put;
    $http.del = axios_1.default.delete;
    $http.options = axios_1.default.options;
    /**
     *  output: Directory or File
     */
    async function download(url, config) {
        let output = _require_1.$require.notNull(config.output, `Output is undefined. Should be directory or file path`);
        if (_path_1.$path.hasExt(output) === false) {
            let filename = new atma_utils_1.class_Uri(url).file;
            _require_1.$require.notEmpty(filename, `There is no filename with extension in source url. To save a file, you must specify the filename in "output"`);
            output = atma_utils_1.class_Uri.combine(output, filename);
        }
        if (_path_1.$path.isAbsolute(output) === false) {
            output = atma_utils_1.class_Uri.combine(`file://`, process.cwd(), output);
        }
        const fileuri = new atma_utils_1.class_Uri(output);
        const filepath = fileuri.toLocalFile();
        await atma_io_1.Directory.ensureAsync(fileuri.toDir());
        const writer = fs.createWriteStream(filepath);
        const response = await (0, axios_1.default)({
            url: url,
            responseType: 'stream',
            ...config
        });
        //ensure that the user can call `then()` only when the file has
        //been downloaded entirely.
        return new Promise((resolve, reject) => {
            response.data.pipe(writer);
            let error = null;
            writer.on('error', err => {
                error = err;
                writer.close();
                reject(err);
            });
            writer.on('close', () => {
                if (error == null) {
                    resolve(response);
                }
                // ...otherwise was rejected in `error` callback
            });
        });
    }
    $http.download = download;
})($http = exports.$http || (exports.$http = {}));
