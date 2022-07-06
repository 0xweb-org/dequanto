import { TAddress } from '@dequanto/models/TAddress';
import { type AbiItem } from 'web3-utils';
import { File } from 'atma-io';
import { class_Uri } from 'atma-utils';
import alot from 'alot';
import { $abiType } from '@dequanto/utils/$abiType';
import { $date } from '@dequanto/utils/$date';
import { $path } from '@dequanto/utils/$path';
import { $abiUtils } from '@dequanto/utils/$abiUtils';
import { TPlatform } from '@dequanto/models/TPlatform';

export class GeneratorFromAbi {

    static get Gen () {
        return Gen;
    }

    async generate (abiJson: AbiItem[], opts: {
        network: TPlatform
        name: string
        address: TAddress
        output: string
        implementation: TAddress
        saveAbi?: boolean
        sources?: {
            [file: string]: { content: string }
        }
    }) {

        let methodsArr = abiJson
            .map(item => {
                if (item.type === 'function') {
                    return Gen.serializeMethodTs(item);
                }
                return null;
            })
            .filter(Boolean)
            .map(Str.formatMethod);
            ;

        let eventsArr = abiJson
            .filter(x => x.type === 'event')
            .map(x => Gen.serializeEvent(x))
            .filter(Boolean)
            .map(Str.formatMethod);
            ;
        let eventsExtractorsArr = abiJson
            .filter(x => x.type === 'event')
            .map(x => Gen.serializeEventExtractor(x))
            .filter(Boolean)
            .map(Str.formatMethod);

        let eventsFetchersArr = abiJson
            .filter(x => x.type === 'event')
            .map(x => Gen.serializeEventFetcher(x))
            .filter(Boolean)
            .map(Str.formatMethod);

        let eventInterfaces = abiJson
            .filter(x => x.type === 'event')
            .map(x => Gen.serializeEventInterface(x))
            .filter(Boolean)
            .map(Str.formatMethod);
            ;

        let methods = methodsArr.join('\n\n');
        let events = eventsArr.join('\n\n');
        let eventsExtractors = eventsExtractorsArr.join('\n\n');
        let eventsFetchers = eventsFetchersArr.join('\n\n');

        let name = opts.name;
        let templatePath = $path.resolve(`/src/gen/ContractTemplate.ts`);
        let template = await File.readAsync<string>(templatePath, { skipHooks: true });


        let EtherscanStr;
        let EthWeb3ClientStr;
        let imports = [];
        let explorerUrl: string;
        switch (opts.network) {
            case 'bsc':
                EtherscanStr = 'Bscscan';
                EthWeb3ClientStr = 'BscWeb3Client';
                imports = [
                    `import { Bscscan } from '@dequanto/BlockchainExplorer/Bscscan'`,
                    `import { BscWeb3Client } from '@dequanto/clients/BscWeb3Client'`,
                ];
                explorerUrl = `https://bscscan.com/address/${opts.implementation}#code`;
                break;
            case 'polygon':
                EtherscanStr = 'Polyscan';
                EthWeb3ClientStr = 'PolyWeb3Client';
                imports = [
                    `import { Polyscan } from '@dequanto/BlockchainExplorer/Polyscan'`,
                    `import { PolyWeb3Client } from '@dequanto/clients/PolyWeb3Client'`,
                ];
                explorerUrl = `https://polygonscan.com/address/${opts.implementation}#code`;
                break;
            case 'xdai':
                EtherscanStr = 'XDaiscan';
                EthWeb3ClientStr = 'XDaiWeb3Client';
                imports = [
                    `import { XDaiscan } from '@dequanto/chains/xdai/XDaiscan'`,
                    `import { XDaiWeb3Client } from '@dequanto/chains/xdai/XDaiWeb3Client'`,
                ];
                explorerUrl = `https://blockscout.com/xdai/mainnet/address/${opts.implementation}/contracts`;
                break;
            case 'eth':
                EtherscanStr = 'Etherscan';
                EthWeb3ClientStr = 'EthWeb3Client';
                imports = [
                    `import { Etherscan } from '@dequanto/BlockchainExplorer/Etherscan'`,
                    `import { EthWeb3Client } from '@dequanto/clients/EthWeb3Client'`,
                ];
                explorerUrl = `https://etherscan.io/address/${opts.implementation}#code`;
                break;
            case 'hardhat':
                EtherscanStr = 'Etherscan';
                EthWeb3ClientStr = 'HardhatWeb3Client';
                imports = [
                    `import { Etherscan } from '@dequanto/BlockchainExplorer/Etherscan'`,
                    `import { HardhatWeb3Client } from '@dequanto/clients/HardhatWeb3Client'`,
                ];
                explorerUrl = ``;
                break;
            default:
                throw new Error(`Unknown network ${opts.network}`);
        }

        let code = template
            .replace(/\$Etherscan\$/g, EtherscanStr)
            .replace(/\$EthWeb3Client\$/g, EthWeb3ClientStr)
            .replace(`/* IMPORTS */`, imports.join('\n'))
            .replace(`$NAME$`, Gen.toClassName(name))
            .replace(`$ADDRESS$`, opts.address ?? '')
            .replace(`/* METHODS */`, methods)
            .replace(`/* EVENTS */`, events)
            .replace(`/* EVENTS_EXTRACTORS */`, eventsExtractors)
            .replace(`/* EVENTS_FETCHERS */`, eventsFetchers)
            .replace(`$ABI$`, JSON.stringify(abiJson))
            .replace(`$DATE$`, $date.format(new Date(), 'yyyy-MM-dd HH:mm'))
            .replace(`$EXPLORER_URL$`, explorerUrl)
            .replace(`/* $EVENT_INTERFACES$ */`, eventInterfaces.join('\n'))
            ;


        let directory = name;
        let filename = /[^\\/]+$/.exec(name)[0];

        let path = /\.ts$/.test(opts.output)
            ? opts.output
            : class_Uri.combine(opts.output, directory, `${filename}.ts`);

        await File.writeAsync(path, code, { skipHooks: true });

        if (opts.saveAbi) {
            let path = class_Uri.combine(opts.output, directory, `${filename}.json`);
            await File.writeAsync(path, abiJson);
        }

        console.log(`ABI wrapper class created: ${path}`);

        let sources = opts.sources;
        let sourceFiles = [];
        if (sources) {
            sourceFiles = await alot.fromObject(sources).mapAsync(async entry => {
                let sourceFilename = /\/?([^/]+$)/.exec(entry.key)[1];
                let path = class_Uri.combine(opts.output, directory, filename, sourceFilename);
                await File.writeAsync(path, entry.value.content, { skipHooks: true });

                console.log(`Source code saved: ${path}`);
                return path;
            }).toArrayAsync();
        }
        return {
            main: path,
            sources: sourceFiles,
        };
    }
}


namespace Gen {

    export function toClassName (name: string) {
        let str = name.replace(/[^\w_\-\\/]/g, '');
        str = str.replace(/[\-\\/](\w)/g, (full, letter) => {
            return letter.toUpperCase();
        });
        return str[0].toUpperCase() + str.substring(1);
    }


    export function serializeMethodTs (abi: AbiItem) {
        let isRead = isReader(abi);
        if (isRead) {
            return serializeReadMethodTs(abi);
        }
        return serializeWriteMethodTs(abi);
    }

    export function serializeEvent (abi: AbiItem) {
        let { fnInputArguments, callInputArguments, fnResult } = serializeArgumentsTs(abi);
        return `
            on${abi.name} (fn: (event: EventLog, ${fnInputArguments}) => void): ClientEventsStream<any> {
                return this.$on('${abi.name}', fn);
            }
        `;
    }
    export function serializeEventExtractor (abi: AbiItem) {
        return `
            extractLogs${abi.name} (tx: TransactionReceipt): ITxLogItem<TLog${abi.name}>[] {
                let abi = this.$getAbiItem('event', '${abi.name}');
                return this.$extractLogs(tx, abi) as any as ITxLogItem<TLog${abi.name}>[];
            }
        `;
    }
    export function serializeEventFetcher (abi: AbiItem) {
        let inputs = abi.inputs;
        let indexed = alot(inputs).takeWhile(x => x.indexed).toArray();
        let indexedParams = indexed.map(param => `${param.name}?: ${ $abiType.getTsType(param.type, param) }`)
        return `
            async getPastLogs${abi.name} (options?: {
                fromBlock?: number | Date
                toBlock?: number | Date
                params?: { ${indexedParams} }
            }): Promise<ITxLogItem<TLog${abi.name}>[]> {
                let topic = '${$abiUtils.getTopicSignature(abi)}';
                let abi = this.$getAbiItem('event', '${abi.name}');
                let filters = await this.$getPastLogsFilters(abi, {
                    topic,
                    ...options
                });
                let logs= await this.$getPastLogs(filters);
                return logs.map(log => this.$extractLog(log, abi)) as any;
            }
        `;
    }
    export function serializeEventInterface (abi: AbiItem) {
        let { fnInputArguments, callInputArguments, fnResult } = serializeArgumentsTs(abi);
        return `
            type TLog${abi.name} = {
                ${fnInputArguments}
            }
        `;
    }

    export function isReader (abi: AbiItem) {
        return ['view', 'pure', null].includes(abi.stateMutability);
    }

    export function serializeMethodAbi(abi: AbiItem, includeNames?: boolean) {
        let params = abi.inputs?.map(x => {
            let param = x.type;
            if (includeNames && x.name) {
                param += ' ' + x.name;
            }
            return param;
        }).join(', ') ?? '';
        let returns = serializeMethodAbiReturns(abi.outputs);
        if (returns && abi.outputs.length > 1) {
            returns = `(${returns})`;
        }
        let returnsStr = returns ? `returns ${returns}` : '';
        return `function ${abi.name}(${params}) ${returnsStr}`.trim();
    }

    function serializeReadMethodTs (abi: AbiItem) {
        let { fnInputArguments, callInputArguments, fnResult } = serializeArgumentsTs(abi);
        if (callInputArguments) {
            callInputArguments = `, ${callInputArguments}`;
        }
        return `
            // ${$abiUtils.getMethodSignature(abi)}
            async ${abi.name} (${fnInputArguments}): ${fnResult} {
                return this.$read('${serializeMethodAbi(abi)}'${callInputArguments});
            }
        `;
    }

    function serializeWriteMethodTs (abi: AbiItem) {
        let { fnInputArguments, callInputArguments } = serializeArgumentsTs(abi);
        if (callInputArguments) {
            callInputArguments = `, ${callInputArguments}`;
        }

        return `
            // ${$abiUtils.getMethodSignature(abi)}
            async ${abi.name} (sender: TSender, ${fnInputArguments}): Promise<TxWriter> {
                return this.$write(this.$getAbiItem('function', '${abi.name}'), sender${callInputArguments});
            }
        `;
    }

    function serializeArgumentsTs (abi: AbiItem) {
        let inputs = abi.inputs.map((input, i) => {
            let result = { ...input };
            if (result.name == null || result.name === '') {
                result.name = 'input' + i;
            }
            return result;
        });

        let fnInputArguments = inputs
            ?.map((input) => {
                let tsType = $abiType.getTsType(input.type, input);
                if (tsType == null) {
                    throw new Error(`Unknown abi type in arguments: ${input.type}`);
                }

                return `${input.name}: ${tsType}`;
            })
            ?.join(', ') ?? '';

        let callInputArguments = inputs
            ?.map(input => {
                return `${input.name}`;
            })
            ?.join(', ') ?? '';


        let fnResult = serializeMethodTsReturns(abi.outputs);
        return { fnInputArguments, callInputArguments, fnResult };
    }

    function isObjectParams (params: { name, type }[]) {
        return params?.every(x => Boolean(x.name));
    }
    function serializeMethodAbiReturns (params: { name, type, components? }[]) {
        if (params == null) {
            return '';
        }
        // if (isObjectParams(params)) {
        //     return params.map(x => serializeMethodAbiReturnsSingle(x)).join(',');
        // }
        return params?.map(x => serializeMethodAbiReturnsSingle(x)).join(',');
    }
    function serializeMethodAbiReturnsSingle (param: { name, type, components? }) {
        if (param == null) {
            return null;
        }
        if (param.components) {
            // tuple, tuple[]
            let fields = serializeMethodAbiReturns(param.components);
            return `[${fields}]${ param.type === 'tuple[]' ? '[]' : '' }`;
        }
        // if (param.name && param.type) {
        //     return `${param.type} ${param.name}`;
        // }
        return param.type;
    }
    function serializeMethodTsReturns (params: { name, type }[]) {
        if (params == null || params.length === 0) {
            params = [ { name: '', type: 'uint256' } ];
        }

        let tsTypes = params.map(param => {
            let tsType = $abiType.getTsType(param.type, param);
            if (tsType == null) {
                throw new Error(`(gen) Unknown abi type in return: ${param.type}`);
            }
            return {
                name: param.name,
                type: tsType
            };
        });

        if (params.length > 1 && isObjectParams(params)) {
            let paramsStr = tsTypes.map(x => `${x.name}: ${x.type}`).join(', ');
            return `Promise<{ ${paramsStr} }>`;
        }

        let fnResult = tsTypes?.map(x => x.type).join(', ');
        if (tsTypes.length > 1) {
            fnResult = `[ ${fnResult} ]`
        }
        return `Promise<${fnResult}>`;
    }


    // const AbiTsTypes = {
    //     'uint8': 'number',
    //     'uint4': 'number',
    //     'uint': 'number',

    //     'bool': 'boolean',

    //     'bytes': 'Buffer',
    //     'bytes4': 'Buffer',
    //     'bytes32': 'Buffer',
    //     'bytes64': 'Buffer',
    //     'bytes128': 'Buffer',
    //     'bytes256': 'Buffer',

    //     'address': 'TAddress',
    //     'string': 'string',
    // };
    // const AbiTsTypesRgx = [
    //     {
    //         rgx: /uint\d+/,
    //         type: 'bigint',
    //     }
    // ];
}


namespace Str {
    export function formatMethod (str: string) {
        str = trim(str);
        str = indent(str, '    ');
        return str;
    }
    export function trim (str: string) {
        let lines = str.split('\n');
        let min = alot(lines).min(x => {
            if (x.trim() === '') {
                return Number.MAX_SAFE_INTEGER;
            }
            let match = /^\s+/.exec(x);
            if (match == null) {
                return Number.MAX_SAFE_INTEGER;
            }
            return match[0].length;
        });

        lines = lines.map((line, i) => {
            let x = line.substring(min);
            if ((i === 0) || (lines.length === i + 1)) {
                if (x === '') {
                    return null;
                }
            }
            return x;
        }).filter(Boolean);
        return lines.join('\n');
    }
    export function indent (str: string, indent: string) {
        return str
            .split('\n')
            .map(x => `${indent}${x}`)
            .join('\n');
    }
}
