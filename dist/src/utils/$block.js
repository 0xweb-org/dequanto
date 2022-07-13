"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.$block = void 0;
const a_di_1 = __importDefault(require("a-di"));
const BlockDateResolver_1 = require("@dequanto/blocks/BlockDateResolver");
var $block;
(function ($block) {
    function getDate(block) {
        return new Date(Number(block.timestamp) * 1000);
    }
    $block.getDate = getDate;
    async function ensureNumber(mix, client) {
        if (typeof mix === 'number') {
            return mix;
        }
        if (mix instanceof Date) {
            let dateResolver = a_di_1.default.resolve(BlockDateResolver_1.BlockDateResolver, client);
            return await dateResolver.getBlockNumberFor(mix);
        }
        throw new Error(`Invalid getBlockNumber param: ${mix}`);
    }
    $block.ensureNumber = ensureNumber;
})($block = exports.$block || (exports.$block = {}));
