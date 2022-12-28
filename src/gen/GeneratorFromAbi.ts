import alot from 'alot';
import { type AbiItem } from 'web3-utils';
import { TAddress } from '@dequanto/models/TAddress';
import { File } from 'atma-io';
import { class_Uri } from 'atma-utils';
import { $abiType } from '@dequanto/utils/$abiType';
import { $date } from '@dequanto/utils/$date';
import { $path } from '@dequanto/utils/$path';
import { $abiUtils } from '@dequanto/utils/$abiUtils';
import { TPlatform } from '@dequanto/models/TPlatform';
import { $config } from '@dequanto/utils/$config';
import { $logger } from '@dequanto/utils/$logger';
import { GeneratorStorageReader } from './GeneratorStorageReader';
import { Web3Client } from '@dequanto/clients/Web3Client';
import { Str } from './utils/Str';
import { $gen } from './utils/$gen';

export class GeneratorFromAbi {

    static get Gen () {
        return Gen;
    }

    async generate (abiJson: AbiItem[], opts: {
        network: TPlatform
        name: string
        contractName: string
        address: TAddress
        output: string
        implementation: TAddress
        saveAbi?: boolean
        sources?: {
            [file: string]: { content: string }
        },
        client?: Web3Client
    }) {

        let methodsArr = alot(abiJson)
            .filter(x => x.type === 'function')
            .groupBy(x => x.name)
            .map(group => {
                if (group.values.length === 1) {
                    let item = group.values[0];
                    return Gen.serializeMethodTs(item);
                }
                if (group.values.length > 1) {
                    let items = group.values;
                    return Gen.serializeMethodTsOverloads(items);
                }
                return null;
            })
            .filter(Boolean)
            .map(Str.formatMethod)
            .toArray();

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
        let Web3ClientOptions = '';
        let EvmScanOptions = '';
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
            default: {
                let web3Config = $config.get(`web3.${opts.network}`);
                if (web3Config) {
                    EtherscanStr = 'Evmscan';
                    EthWeb3ClientStr = 'EvmWeb3Client';
                    imports = [
                        `import { Evmscan } from '@dequanto/BlockchainExplorer/Evmscan'`,
                        `import { EvmWeb3Client } from '@dequanto/clients/EvmWeb3Client'`,
                    ];
                    Web3ClientOptions = `{ platform: '${opts.network}' }`;
                    EvmScanOptions = `{ platform: '${opts.network}' }`;

                    explorerUrl = '';
                    let evmscan = $config.get(`blockchainExplorer.${opts.network}`)
                    if (evmscan?.www) {
                        explorerUrl = `${evmscan.www}/address/${opts.implementation}#code`;
                    }
                    break;
                }

                throw new Error(`Unknown network ${opts.network}, and no configuration found under "web3" field`);
            }
        }

        let storageReaderProperty = '';
        let storageReaderClass = '';
        try {
            let storageReaderGenerator = new GeneratorStorageReader();
            let reader = await storageReaderGenerator.generate({ ...opts });
            let property = reader.className
                ? `storage = new ${reader.className}(this.address, this.client, this.explorer);`
                : '';

            storageReaderClass = reader.code;
            storageReaderProperty = property;
            $logger.log(`Storage Reader generated`);
        } catch (error) {
            $logger.log(`Storage Reader is skipped: ${error.message}`);
        }

        let code = template
            .replace(/\$Etherscan\$/g, EtherscanStr)
            .replace(/\$EthWeb3Client\$/g, EthWeb3ClientStr)
            .replace(/\$Web3ClientOptions\$/g, Web3ClientOptions)
            .replace(/\$EvmScanOptions\$/g, EvmScanOptions)

            .replace(`/* IMPORTS */`, imports.join('\n'))
            .replace(`$NAME$`, $gen.toClassName(name))
            .replace(`$ADDRESS$`, opts.address ?? '')
            .replace(`/* METHODS */`, methods)
            .replace(`/* EVENTS */`, events)
            .replace(`/* EVENTS_EXTRACTORS */`, eventsExtractors)
            .replace(`/* EVENTS_FETCHERS */`, eventsFetchers)
            .replace(`$ABI$`, JSON.stringify(abiJson))
            .replace(`$DATE$`, $date.format(new Date(), 'yyyy-MM-dd HH:mm'))
            .replace(`$EXPLORER_URL$`, explorerUrl)
            .replace(`/* $EVENT_INTERFACES$ */`, eventInterfaces.join('\n'))

            .replace(`/* STORAGE_READER_PROPERTY */`, storageReaderProperty)
            .replace(`/* STORAGE_READER_CLASS */`, storageReaderClass)
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

        $logger.log(`ABI wrapper class created: ${path}`);

        let sources = opts.sources;
        let sourceFiles = [];
        if (sources) {
            sourceFiles = await alot.fromObject(sources).mapAsync(async entry => {
                let sourceFilename = /\/?([^/]+$)/.exec(entry.key)[1];
                let path = class_Uri.combine(opts.output, directory, filename, sourceFilename);
                await File.writeAsync(path, entry.value.content, { skipHooks: true });

                $logger.log(`Source code saved: ${path}`);
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


    export function serializeMethodTs (abi: AbiItem) {
        let isRead = isReader(abi);
        if (isRead) {
            return serializeReadMethodTs(abi);
        }
        return serializeWriteMethodTs(abi);
    }
    export function serializeMethodTsOverloads (abis: AbiItem[]) {
        let isRead = abis.every(abi => isReader(abi));
        if (isRead) {
            return serializeReadMethodTsOverloads(abis);
        }
        return serializeWriteMethodTsOverloads(abis);
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
    function serializeReadMethodTsOverloads (abis: AbiItem[]) {
        let overrides = abis.map(abi => {
            let { fnInputArguments, fnResult } = serializeArgumentsTs(abi);
            return `
            // ${$abiUtils.getMethodSignature(abi)}
            async ${abi.name} (${fnInputArguments}): ${fnResult}
            `;
        }).join('\n');

        let abi = abis[0];
        let { fnResult } = serializeArgumentsTs(abi);
        let sigs = abis.map(abi => serializeMethodAbi(abi)).map(x => `'${x}'`).join(', ');
        return `
            ${ overrides }
            async ${abi.name} (...args): ${fnResult} {
                let abi = this.$getAbiItemOverload([ ${sigs} ], args);
                return this.$read(abi, ...args);
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
    function serializeWriteMethodTsOverloads (abis: AbiItem[]) {
        let overrides = abis.map(abi => {
            let { fnInputArguments, fnResult } = serializeArgumentsTs(abi);
            return `
            // ${$abiUtils.getMethodSignature(abi)}
            async ${abi.name} (sender: TSender, ${fnInputArguments}): Promise<TxWriter>
            `;
        }).join('\n');

        let abi = abis[0];
        let sigs = abis.map(abi => serializeMethodAbi(abi)).map(x => `'${x}'`).join(', ');
        return `
            ${ overrides }
            async ${abi.name} (sender: TSender, ...args): Promise<TxWriter> {
                let abi = this.$getAbiItemOverload([ ${sigs} ], args);
                return this.$write(abi, sender, ...args);
            }
        `;
    }

    function serializeArgumentsTs (abi: AbiItem) {
        let inputs = abi.inputs.map((input, i) => {
            let result = { ...input };
            if (result.name == null || result.name === '') {
                result.name = 'input' + i;
            }
            if (result.name === 'sender') {
                result.name = '_sender';
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



