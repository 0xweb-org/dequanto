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
const stringifyInstructions_1 = __importDefault(require("./stringifyInstructions"));
const functionHashes = __importStar(require("../../data/functionHashes.json"));
exports.default = (functionName, functionInstance) => {
    let output = '';
    output += 'function ';
    if (functionName in functionHashes) {
        const fullFunction = functionHashes[functionName];
        const fullFunctionName = fullFunction.split('(')[0];
        const fullFunctionArguments = fullFunction
            .replace(fullFunctionName, '')
            .substring(1)
            .slice(0, -1);
        if (fullFunctionArguments) {
            output += fullFunctionName + '(';
            output += fullFunctionArguments
                .split(',')
                .map((a, i) => a + ' _arg' + i)
                .join(', ');
            output += ')';
        }
        else {
            output += fullFunction;
        }
    }
    else {
        output += functionName + '()';
    }
    output += ' ' + functionInstance.visibility;
    if (functionInstance.constant) {
        output += ' view';
    }
    if (functionInstance.payable) {
        output += ' payable';
    }
    if (functionInstance.returns.length > 0) {
        output += ' returns (' + functionInstance.returns.join(', ') + ')';
    }
    output += ' {\n';
    output += (0, stringifyInstructions_1.default)(functionInstance.items, 4);
    output += '}\n\n';
    return output;
};
