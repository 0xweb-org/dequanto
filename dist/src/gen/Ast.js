"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ast = void 0;
const parser_1 = __importDefault(require("@solidity-parser/parser"));
class Ast {
    static parse(source) {
        let ast = parser_1.default.parse(source, {
            tolerant: true,
        });
    }
}
exports.Ast = Ast;
