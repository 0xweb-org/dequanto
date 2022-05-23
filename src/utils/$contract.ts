import Web3 from 'web3';
import { type AbiItem } from 'web3-utils';
import { Log, TransactionReceipt } from 'web3-core';
import { $abiUtils } from './$abiUtils';
import { InputDataUtils } from '@dequanto/contracts/utils/InputDataUtils';
import { ITxLogItem } from '@dequanto/txs/receipt/ITxLogItem';

export namespace $contract {
    export function keccak256 (str: string) {
        return Web3.utils.keccak256(str);
    }

    export function normalizeArgs (args: any[]) {
        return args.map(val => {
            if (val?._isBigNumber) {
                return BigInt(val.toString());
            }
            if (Array.isArray(val)) {
                return normalizeArgs(val);
            }
            return val;
        })
    }

    export function extractLogsForAbi (tx: TransactionReceipt, abiItem: AbiItem): ITxLogItem[] {
        let topicHash = $abiUtils.getMethodHash(abiItem);
        let logs = tx
            .logs
            .filter(log => {
                return log.topics[0] === topicHash;
            })
            .map(log => {
                return parseLogWithAbi(log, abiItem);
            })
        return logs;
    }
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

    export function parseLogWithAbi(log: Log, abiItem: AbiItem): ITxLogItem {
        let inputs = abiItem.inputs.slice();
        let args = log.topics.slice(1).map((bytes, i) => {
            let type = inputs.shift();
            let val = InputDataUtils.decode([ type ], bytes);

            return {
                name: type.name,
                value: val[0]
            }
        });

        if (inputs.length > 0) {
            let values = InputDataUtils.decode(inputs, log.data);

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
}
