"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.$zip = void 0;
const decompress_1 = __importDefault(require("decompress"));
var $zip;
(function ($zip) {
    async function unzip(path, output) {
        return await (0, decompress_1.default)(path, output);
    }
    $zip.unzip = unzip;
})($zip = exports.$zip || (exports.$zip = {}));
