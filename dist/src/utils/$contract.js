"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.$contract = void 0;
const web3_1 = __importDefault(require("web3"));
const _abiUtils_1 = require("./$abiUtils");
const InputDataUtils_1 = require("@dequanto/contracts/utils/InputDataUtils");
var $contract;
(function ($contract) {
    function keccak256(str) {
        return web3_1.default.utils.keccak256(str);
    }
    $contract.keccak256 = keccak256;
    function normalizeArgs(args) {
        return args.map(val => {
            if (val?._isBigNumber) {
                return BigInt(val.toString());
            }
            if (Array.isArray(val)) {
                return normalizeArgs(val);
            }
            return val;
        });
    }
    $contract.normalizeArgs = normalizeArgs;
    function extractLogsForAbi(tx, abiItem) {
        let topicHash = _abiUtils_1.$abiUtils.getMethodHash(abiItem);
        let logs = tx
            .logs
            .filter(log => {
            return log.topics[0] === topicHash;
        })
            .map(log => {
            return parseLogWithAbi(log, abiItem);
        });
        return logs;
    }
    $contract.extractLogsForAbi = extractLogsForAbi;
    // export function formatLogForAbi (log: ITxLogItem) {
    //     let params = log.arguments.reduce((aggr, arg) => {
    //         aggr[arg.name] = arg.value;
    //         return aggr;
    //     }, {});
    //     return {
    //         contract: log.contract,
    //         arguments: log.arguments,
    //         ...params
    //     };
    // }
    function parseLogWithAbi(log, abiItem) {
        let inputs = abiItem.inputs.slice();
        let args = log.topics.slice(1).map((bytes, i) => {
            let type = inputs.shift();
            let val = InputDataUtils_1.InputDataUtils.decode([type], bytes);
            return {
                name: type.name,
                value: val[0]
            };
        });
        if (inputs.length > 0) {
            let values = InputDataUtils_1.InputDataUtils.decode(inputs, log.data);
            args.push(...values.map((val, i) => {
                return {
                    name: inputs[i].name,
                    value: val
                };
            }));
        }
        let params = args.reduce((aggr, arg) => {
            aggr[arg.name] = arg.value;
            return aggr;
        }, {});
        return {
            blockNumber: log.blockNumber,
            transactionHash: log.transactionHash,
            address: log.address,
            event: abiItem.name,
            arguments: args,
            params: params,
        };
    }
    $contract.parseLogWithAbi = parseLogWithAbi;
})($contract = exports.$contract || (exports.$contract = {}));
