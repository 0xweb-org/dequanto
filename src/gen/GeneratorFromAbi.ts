import alot from 'alot';
import { type TAbiItem } from '@dequanto/types/TAbi';
import { TAddress } from '@dequanto/models/TAddress';
import { env, File } from 'atma-io';
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

    static get Gen() {
        return Gen;
    }

    async generate(abiJson: TAbiItem[], opts: {
        target?: 'js' | 'ts'
        network: TPlatform
        name: string
        contractName: string
        address: TAddress
        output: string
        implementation: TAddress
        saveAbi?: boolean
        saveSources?: boolean
        sources?: {
            [file: string]: { content: string }
        }
        sourceMain?: string
        /** Path to the compiled meta json file (with ABI and Bytecode) */
        artifact?: string
        client?: Web3Client
    }) {

        let targetType = opts.target ?? 'ts';
        let methodsArr = alot(abiJson)
            .filter(x => x.type === 'function' || x.type === 'constructor')
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
            .map(x => x[ opts?.target ?? 'ts' ])
            .map(Str.formatMethod)
            .toArray();


        let methodTypes = alot(abiJson)
            .filter(x => x.type === 'function')
            .groupBy(x => x.name)
            .map(group => {
                let item = group.values[0];
                return Gen.serializeMethodTypeTs(item.name, group.values);
            })
            .filter(Boolean)
            .toArray();

        let eventsArr = abiJson
            .filter(x => x.type === 'event')
            .map(x => Gen.serializeEvent(x))
            .filter(Boolean)
            .map(x => x[ opts?.target ?? 'ts' ])
            .map(Str.formatMethod);

        let eventTypes = alot(abiJson)
            .filter(x => x.type === 'event')
            .groupBy(x => x.name)
            .map(group => {
                let item = group.values[0];
                return Gen.serializeEventType(item);
            })
            .filter(Boolean)
            .toArray();


        //let eventInterfacesAll = Gen.serializeEventsInterfacesAllTs(abiJson.filter(x => x.type === 'event'));

        let eventsExtractorsArr = abiJson
            .filter(x => x.type === 'event')
            .map(x => Gen.serializeEventExtractor(x))
            .filter(Boolean)
            .map(x => x[ opts?.target ?? 'ts' ])
            .map(Str.formatMethod);

        let eventsFetchersArr = abiJson
            .filter(x => x.type === 'event')
            .map(x => Gen.serializeEventFetcher(x))
            .filter(Boolean)
            .map(x => x[ opts?.target ?? 'ts' ])
            .map(Str.formatMethod);

        // let eventInterfaces = abiJson
        //     .filter(x => x.type === 'event')
        //     .map(x => Gen.serializeEventInterface(x))
        //     .filter(Boolean)
        //     .map(Str.formatMethod);

        let methods = methodsArr.join('\n\n');
        let events = eventsArr.join('\n\n');
        let eventsExtractors = eventsExtractorsArr.join('\n\n');
        let eventsFetchers = eventsFetchersArr.join('\n\n');

        let name = opts.name;
        let templatePath = $path.resolve(`/src/gen/ContractTemplate.${ targetType }`);
        let template = await File.readAsync<string>(templatePath, { skipHooks: true });


        let EtherscanStr;
        let EthWeb3ClientStr;
        let imports = [];
        let sourceUri: string;
        let Web3ClientOptions = '';
        let EvmScanOptions = '';
        let importPfx = targetType === 'js' ? 'dequanto' : '@dequanto';
        switch (opts.network) {
            case 'bsc':
                EtherscanStr = 'Bscscan';
                EthWeb3ClientStr = 'BscWeb3Client';
                imports = [
                    `import { Bscscan } from '${importPfx}/explorer/Bscscan'`,
                    `import { BscWeb3Client } from '${importPfx}/clients/BscWeb3Client'`,
                ];
                sourceUri = `https://bscscan.com/address/${opts.address}#code`;
                break;
            case 'polygon':
                EtherscanStr = 'Polyscan';
                EthWeb3ClientStr = 'PolyWeb3Client';
                imports = [
                    `import { Polyscan } from '${importPfx}/explorer/Polyscan'`,
                    `import { PolyWeb3Client } from '${importPfx}/clients/PolyWeb3Client'`,
                ];
                sourceUri = `https://polygonscan.com/address/${opts.address}#code`;
                break;
            case 'xdai':
                EtherscanStr = 'XDaiscan';
                EthWeb3ClientStr = 'XDaiWeb3Client';
                imports = [
                    `import { XDaiscan } from '${importPfx}/chains/xdai/XDaiscan'`,
                    `import { XDaiWeb3Client } from '${importPfx}/chains/xdai/XDaiWeb3Client'`,
                ];
                sourceUri = `https://blockscout.com/xdai/mainnet/address/${opts.address}/contracts`;
                break;
            case 'eth':
                EtherscanStr = 'Etherscan';
                EthWeb3ClientStr = 'EthWeb3Client';
                imports = [
                    `import { Etherscan } from '${importPfx}/explorer/Etherscan'`,
                    `import { EthWeb3Client } from '${importPfx}/clients/EthWeb3Client'`,
                ];
                sourceUri = `https://etherscan.io/address/${opts.address}#code`;
                break;
            case 'hardhat':
                EtherscanStr = 'Etherscan';
                EthWeb3ClientStr = 'HardhatWeb3Client';
                imports = [
                    `import { Etherscan } from '${importPfx}/explorer/Etherscan'`,
                    `import { HardhatWeb3Client } from '${importPfx}/hardhat/HardhatWeb3Client'`,
                ];
                sourceUri = ``;
                break;
            default: {
                let web3Config = $config.get(`web3.${opts.network}`);
                if (web3Config) {
                    EtherscanStr = 'Evmscan';
                    EthWeb3ClientStr = 'EvmWeb3Client';
                    imports = [
                        `import { Evmscan } from '${importPfx}/explorer/Evmscan'`,
                        `import { EvmWeb3Client } from '${importPfx}/clients/EvmWeb3Client'`,
                    ];
                    Web3ClientOptions = `{ platform: '${opts.network}' }`;
                    EvmScanOptions = `{ platform: '${opts.network}' }`;

                    sourceUri = '';
                    let evmscan = $config.get(`blockchainExplorer.${opts.network}`)
                    if (evmscan?.www) {
                        sourceUri = `${evmscan.www}/address/${opts.address}#code`;
                    }
                    break;
                }

                throw new Error(`Unknown network ${opts.network}, and no configuration found under "web3" field`);
            }
        }

        let outputDirectory = name;
        let outputFilename = /[^\\/]+$/.exec(name)[0];
        let outputPath = /\.(ts|js)$/.test(opts.output)
            ? opts.output
            : class_Uri.combine(opts.output, outputDirectory, `${outputFilename}.${targetType}`);

        let meta = {
            artifact: opts.artifact
                ? this.getRelativePath(opts.artifact)
                : void 0,
            source: opts.sourceMain
                ? this.getRelativePath(opts.sourceMain)
                : void 0,
            class: this.getRelativePath(outputPath)
        };
        let metaProperty = `$meta = ${JSON.stringify(meta, null, 4)}`;


        let storageReaderInitializer = '';
        let storageReaderProperty = '';
        let storageReaderClass = '';
        try {
            let storageReaderGenerator = new GeneratorStorageReader();
            let reader = await storageReaderGenerator.generate({ ...opts, target: targetType });

            if (reader.sourcePath != null && opts.address == null) {
                sourceUri = this.getRelativePath(reader.sourcePath);
            }
            if (reader.className) {
                storageReaderClass = reader.code;
                storageReaderProperty = targetType === 'ts' ? `declare storage: ${reader.className}` : '';
                storageReaderInitializer = `this.storage = new ${reader.className}(this.address, this.client, this.explorer);`;
                $logger.log(`green<StorageReader> was generated`);
            } else {
                $logger.log(`yellow<StorageReader> was not generated: ${reader.error?.message}`);
            }
        } catch (error) {
            $logger.error(`Storage Reader is skipped due to the error: ${error.message}`);
        }

        let className = $gen.toClassName(name);
        let code = template
            .replace(/\$Etherscan\$/g, EtherscanStr)
            .replace(/\$EthWeb3Client\$/g, EthWeb3ClientStr)
            .replace(/\$Web3ClientOptions\$/g, Web3ClientOptions)
            .replace(/\$EvmScanOptions\$/g, EvmScanOptions)

            .replace(`/* META_PROPERTY */`, () => Str.indent(metaProperty, '    '))
            .replace(`/* IMPORTS */`, () => imports.join('\n'))
            .replace(`/* ERRORS */`, () => Gen.serializeErrors(className, abiJson))
            .replace(/\$NAME\$/g, className)
            .replace(`$ADDRESS$`, opts.address ? `'${opts.address}'` : 'null')
            .replace(`/* METHODS */`, methods)
            .replace(`/* EVENTS */`, events)
            .replace(`/* EVENTS_EXTRACTORS */`, eventsExtractors)
            .replace(`/* EVENTS_FETCHERS */`, eventsFetchers)
            .replace(`$ABI$`, () => JSON.stringify(abiJson))
            .replace(`$DATE$`, $date.format(new Date(), 'yyyy-MM-dd HH:mm'))
            .replace(`$EXPLORER_URL$`, sourceUri)
            //.replace(`/* $EVENT_INTERFACES$ */`, () => eventInterfaces.join('\n') + '\n\n' + eventInterfacesAll.code + '\n\n')

            .replace(`/* STORAGE_READER_INITIALIZER */`, storageReaderInitializer)
            .replace(`/* STORAGE_READER_PROPERTY */`, storageReaderProperty)
            .replace(`/* STORAGE_READER_CLASS */`, () => storageReaderClass)
            .replace(`/* TX_CALLER_METHODS */`, () => Gen.serializeTxCallerMethods(className, abiJson)[targetType])
            .replace(`/* TX_DATA_METHODS */`, () => Gen.serializeTxDataMethods(className, abiJson)[targetType])


            .replace(`/* $EVENT_TYPES$ */`, () => Str.indent(eventTypes.map(x => x.code).join('\n'), '        '))
            .replace(`/* $METHOD_TYPES$ */`, () => Str.indent(methodTypes.map(x => x.code).join('\n'), '        '))
            //.replace(`/* $METHOD_INTERFACES$ */`, () => methodInterfacesArr.map(x => x.code).join('\n\n') + '\n\n' + methodInterfacesAll.code + '\n\n')
            ;



        await File.writeAsync(outputPath, code, { skipHooks: true });

        if (opts.saveAbi) {
            let path = class_Uri.combine(opts.output, outputDirectory, `${outputFilename}.json`);
            await File.writeAsync(path, abiJson);
        }

        $logger.log(`bold<green<${className}>> ABI wrapper class created: bold<${outputPath}>`);

        let sources = opts.sources;
        let sourceFiles = [];
        if (sources && opts.saveSources !== false) {
            sourceFiles = await alot.fromObject(sources).mapAsync(async entry => {
                let sourceFilename = /\/?([^/]+$)/.exec(entry.key)[1];
                let sourcePath = entry.key;
                let cwd = env.currentDir.toString().toLowerCase();
                if (sourcePath.toLowerCase().startsWith(cwd)) {
                    sourcePath = sourcePath.substring(cwd.length + 1);
                }
                // Remove: solc should load deps also from the root directory
                // if (sourcePath.startsWith('@')) {
                //     // handle @openzeppelin and other npm packages
                //     sourcePath = `node_modules/${ sourcePath }`;
                // }
                let path = class_Uri.combine(opts.output, outputDirectory, outputFilename, sourcePath);
                await File.writeAsync(path, entry.value.content, { skipHooks: true });

                $logger.log(`Source code saved: ${path}`);
                return path;
            }).toArrayAsync();
        }
        return {
            main: outputPath,
            sources: sourceFiles,
            platform: opts.network,
            address: opts.address,
            implementation: opts.implementation,
            contractName: opts.contractName
        };
    }


    private getRelativePath(path: string) {
        if (path == null) {
            return path;
        }
        let uri = new class_Uri(path);
        if (uri.isRelative()) {
            return path;
        }
        return uri.toRelativeString(process.cwd() + '/');
    }
}


namespace Gen {

    export function serializeMethodTs(abi: TAbiItem) {
        if (abi.type === 'constructor') {
            return serializeConstructorMethodTs(abi);
        }
        let isRead = $abiUtils.isReadMethod(abi);
        if (isRead) {
            return serializeReadMethodTs(abi);
        }
        return serializeWriteMethodTs(abi);
    }
    export function serializeMethodTsOverloads(abis: TAbiItem[]) {
        let isRead = abis.every(abi => $abiUtils.isReadMethod(abi));
        if (isRead) {
            return serializeReadMethodTsOverloads(abis);
        }
        return serializeWriteMethodTsOverloads(abis);
    }

    // abi.length > 1 if has method overloads
    export function serializeMethodInterfacesTs(name: string, abis: TAbiItem[]) {
        let args = abis.map(abi => {
            let { fnInputArgumentsTargets } = serializeArgumentsTs(abi);
            return `[ ${fnInputArgumentsTargets.ts} ]`;
        }).join(' | ');

        let iface = `IMethod${name[0].toUpperCase()}${name.substring(1)}`;
        let code = [
            `interface ${iface} {`,
            `  method: "${name}"`,
            `  arguments: ${args}`,
            `}`
        ];
        return {
            method: name,
            interface: iface,
            code: code.join('\n')
        };
    }

    export function serializeMethodTypeTs(name: string, abis: TAbiItem[]) {
        let args = abis.map(abi => {
            let { fnInputArgumentsTargets } = serializeArgumentsTs(abi);
            return `[ ${fnInputArgumentsTargets.ts} ]`;
        }).join(' | ');

        let iface = `IMethod${name[0].toUpperCase()}${name.substring(1)}`;
        let code = [
            `${name}: {`,
            `  method: "${name}"`,
            `  arguments: ${args}`,
            `}`,
        ];
        return {
            method: name,
            interface: iface,
            code: code.join('\n')
        };
    }

    export function serializeMethodInterfacesAllTs(methods: { method: string, interface: string }[]) {
        let fields = methods.map(method => {
            return `  ${method.method}: ${method.interface}`;
        });
        let code = [
            `interface IMethods {`,
            ...fields,
            `  '*': { method: string, arguments: any[] } `,
            `}`
        ];
        return {
            code: code.join('\n')
        };
    }
    export function serializeEventsInterfacesAllTs(events: TAbiItem[]) {
        let fields = events.map(item => {
            return `  ${item.name}: TLog${item.name}Parameters`;
        });
        let code = [
            `interface IEvents {`,
            ...fields,
            `  '*': any[] `,
            `}`
        ];
        return {
            code: code.join('\n')
        };
    }
    export function serializeEventType(event: TAbiItem) {
        let { fnInputArgumentsTargets, callInputArguments, fnResult } = serializeArgumentsTs(event);
        let outputParams = `{ ${fnInputArgumentsTargets.ts} }`;
        let outputArgs = `[ ${fnInputArgumentsTargets.ts.replace('\n', '')} ]`;
        let code = [
            `${event.name}: {`,
            `    outputParams: ${outputParams},`,
            `    outputArgs:   ${outputArgs},`,
            `}`
        ];
        return {
            code: code.join('\n')
        };
    }

    export function serializeEvent(abi: TAbiItem) {
        let { fnInputArgumentsTargets, callInputArguments, fnResult } = serializeArgumentsTs(abi);
        return {
            ts: `
                on${abi.name} (fn?: (event: TClientEventsStreamData<TEventArguments<'${abi.name}'>>) => void): ClientEventsStream<TClientEventsStreamData<TEventArguments<'${abi.name}'>>> {
                    return this.$onLog('${abi.name}', fn);
                }
            `,
            js: `
                on${abi.name} (fn) {
                    return this.$onLog('${abi.name}', fn);
                }
            `
        };
    }
    export function serializeEventExtractor(abi: TAbiItem) {
        return {
            ts: `
                extractLogs${abi.name} (tx: TEth.TxReceipt): ITxLogItem<TEventParams<'${abi.name}'>>[] {
                    let abi = this.$getAbiItem('event', '${abi.name}');
                    return this.$extractLogs(tx, abi) as any as ITxLogItem<TEventParams<'${abi.name}'>>[];
                }
            `,
            js: `
                extractLogs${abi.name} (tx) {
                    let abi = this.$getAbiItem('event', '${abi.name}');
                    return this.$extractLogs(tx, abi);
                }
            `
        };
    }
    export function serializeEventFetcher(abi: TAbiItem) {
        let inputs = abi.inputs;
        let indexed = alot(inputs).takeWhile(x => x.indexed).toArray();
        let indexedParams = indexed.map(param => `${param.name}?: ${$abiType.getTsType(param.type, param)}`)
        return {
            ts: `
                async getPastLogs${abi.name} (options?: {
                    fromBlock?: number | Date
                    toBlock?: number | Date
                    params?: { ${indexedParams} }
                }): Promise<ITxLogItem<TEventParams<'${abi.name}'>>[]> {
                    return await this.$getPastLogsParsed('${abi.name}', options) as any;
                }
            `,
            js: `
                async getPastLogs${abi.name} (options) {
                    return await this.$getPastLogsParsed('${abi.name}', options);
                }
            `
        }
    }
    // export function serializeEventInterface (abi: TAbiItem) {
    //     let { fnInputArguments, callInputArguments, fnResult } = serializeArgumentsTs(abi);
    //     return `
    //         type TLog${abi.name} = {
    //             ${fnInputArguments}
    //         };
    //         type TLog${abi.name}Parameters = [ ${fnInputArguments.replace('\n', '')} ];
    //     `;
    // }

    export function serializeMethodAbi(abi: TAbiItem, includeNames?: boolean) {
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

    function serializeReadMethodTs(abi: TAbiItem) {
        let { fnInputArgumentsTargets, callInputArguments, fnResult } = serializeArgumentsTs(abi);
        if (callInputArguments) {
            callInputArguments = `, ${callInputArguments}`;
        }
        return {
            ts: `
                // ${$abiUtils.getMethodSignature(abi)}
                async ${abi.name} (${fnInputArgumentsTargets.ts}): ${fnResult} {
                    return this.$read(this.$getAbiItem('function', '${abi.name}')${callInputArguments});
                }
            `,
            js: `
                // ${$abiUtils.getMethodSignature(abi)}
                async ${abi.name} (${fnInputArgumentsTargets.js}) {
                    return this.$read(this.$getAbiItem('function', '${abi.name}')${callInputArguments});
                }
            `
        };
    }
    function serializeReadMethodTsOverloads(abis: TAbiItem[]) {
        let overrides = abis.map(abi => {
            let { fnInputArgumentsTargets, fnResult } = serializeArgumentsTs(abi);
            return `
            // ${$abiUtils.getMethodSignature(abi)}
            async ${abi.name} (${fnInputArgumentsTargets.ts}): ${fnResult}
            `;
        }).join('\n');

        let abi = abis[0];
        let { fnResult } = serializeArgumentsTs(abi);
        let sigs = abis.map(abi => serializeMethodAbi(abi)).map(x => `'${x}'`).join(', ');
        return {
            ts: `
                ${overrides}
                async ${abi.name} (...args): ${fnResult} {
                    let abi = this.$getAbiItemOverload([ ${sigs} ], args);
                    return this.$read(abi, ...args);
                }
            `,
            js: `
                async ${abi.name} (...args) {
                    let abi = this.$getAbiItemOverload([ ${sigs} ], args);
                    return this.$read(abi, ...args);
                }
            `
        };
    }

    function serializeWriteMethodTs(abi: TAbiItem) {
        let { fnInputArgumentsTargets, callInputArguments } = serializeArgumentsTs(abi);
        if (callInputArguments) {
            callInputArguments = `, ${callInputArguments}`;
        }

        return {
            ts: `
                // ${$abiUtils.getMethodSignature(abi)}
                async ${abi.name} (sender: TSender, ${fnInputArgumentsTargets.ts}): Promise<TxWriter> {
                    return this.$write(this.$getAbiItem('function', '${abi.name}'), sender${callInputArguments});
                }
            `,
            js: `
                // ${$abiUtils.getMethodSignature(abi)}
                async ${abi.name} (sender, ${fnInputArgumentsTargets.js}) {
                    return this.$write(this.$getAbiItem('function', '${abi.name}'), sender${callInputArguments});
                }
            `
        };
    }
    function serializeConstructorMethodTs(abi: TAbiItem) {
        let { fnInputArgumentsTargets, callInputArguments } = serializeArgumentsTs(abi);
        if (callInputArguments) {
            callInputArguments = `, ${callInputArguments}`;
        }
        return {
            ts: `
                async $constructor (deployer: TSender, ${fnInputArgumentsTargets.ts}): Promise<TxWriter> {
                    throw new Error('Not implemented. Typing purpose. Use the ContractDeployer class to deploy the contract');
                }
            `,
            js: `
                async $constructor (deployer, ${fnInputArgumentsTargets.js}) {
                    throw new Error('Not implemented. Typing purpose. Use the ContractDeployer class to deploy the contract');
                }
            `
        };
    }
    function serializeWriteMethodTsOverloads(abis: TAbiItem[]) {
        let overrides = abis.map(abi => {
            let { fnInputArgumentsTargets, fnResult } = serializeArgumentsTs(abi);
            return `
            // ${$abiUtils.getMethodSignature(abi)}
            async ${abi.name} (sender: TSender, ${fnInputArgumentsTargets.ts}): Promise<TxWriter>
            `;
        }).join('\n');

        let abi = abis[0];
        let sigs = abis.map(abi => serializeMethodAbi(abi)).map(x => `'${x}'`).join(', ');
        return {
            ts: `
                ${overrides}
                async ${abi.name} (sender: TSender, ...args): Promise<TxWriter> {
                    let abi = this.$getAbiItemOverload([ ${sigs} ], args);
                    return this.$write(abi, sender, ...args);
                }
            `,
            js: `
                async ${abi.name} (sender, ...args) {
                    let abi = this.$getAbiItemOverload([ ${sigs} ], args);
                    return this.$write(abi, sender, ...args);
                }
            `
        };
    }

    function serializeArgumentsTs(abi: TAbiItem) {
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

        let fnInputArgumentsArr = inputs
        ?.map((input) => {
            let tsType = $abiType.getTsType(input.type, input);
            if (tsType == null) {
                throw new Error(`Unknown abi type in arguments: ${input.type}`);
            }
            return { name: input.name, type: tsType };
        }) ?? [];

        let fnInputArgumentsTs = fnInputArgumentsArr
            .map((input) => {
                return `${input.name}: ${input.type}`;
            })
            .join(', ');

        let fnInputArgumentsJs = fnInputArgumentsArr
            .map((input) => {
                return `${input.name}`;
            })
            .join(', ');

        let callInputArguments = inputs
            ?.map(input => {
                return `${input.name}`;
            })
            ?.join(', ') ?? '';


        let fnResult = serializeMethodTsReturns(abi.outputs);
        return {
            fnInputArgumentsTargets: {
                ts: fnInputArgumentsTs,
                js: fnInputArgumentsJs,
            },
            callInputArguments,
            fnResult
        };
    }

    function isObjectParams(params: { name?, type }[]) {
        return params?.every(x => Boolean(x.name));
    }
    function serializeMethodAbiReturns(params: { name?, type, components?}[]) {
        if (params == null) {
            return '';
        }
        // if (isObjectParams(params)) {
        //     return params.map(x => serializeMethodAbiReturnsSingle(x)).join(',');
        // }
        return params?.map(x => serializeMethodAbiReturnsSingle(x)).join(',');
    }
    function serializeMethodAbiReturnsSingle(param: { name?, type, components?}) {
        if (param == null) {
            return null;
        }
        if (param.components) {
            // tuple, tuple[]
            let fields = serializeMethodAbiReturns(param.components);
            return `[${fields}]${param.type === 'tuple[]' ? '[]' : ''}`;
        }
        // if (param.name && param.type) {
        //     return `${param.type} ${param.name}`;
        // }
        return param.type;
    }
    function serializeMethodTsReturns(params: { name?, type }[]) {
        if (params == null || params.length === 0) {
            params = [{ name: '', type: 'uint256' }];
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



    export function serializeErrors(className: string, abiJson: TAbiItem[]): string {
        let errors = abiJson.filter(x => (x as any).type === 'error');
        if (errors.length === 0) {
            return '';
        }
        let lines = [
            `export namespace ${className}Errors {`
        ];
        errors.forEach(error => {
            lines.push(`    export interface ${error.name} {`);
            lines.push(`        type: '${error.name}'`);
            lines.push(`        params: {`);
            error.inputs.forEach(input => {
                lines.push(`            ${input.name}: ${$abiType.getTsType(input.type, input)}`);
            });
            lines.push(`        }`);
            lines.push(`    }`);
        });

        lines.push(`    export type Error = ${errors.map(x => x.name).join(' | ')}`);
        lines.push(`}`);

        return lines.join('\n');
    }

    export function serializeTxCallerMethods(className: string, abiJson: TAbiItem[]) {
        let methods = abiJson.filter(x => x.type === 'function');
        let writeMethods = methods.filter(abi => $abiUtils.isReadMethod(abi) === false);
        let lines = writeMethods.map(method => {
            return serializeMethodTs(method);
        });

        return {
            ts: lines.map(x => x.ts).join('\n'),
            js: lines.map(x => x.js).join('\n'),
        };


        function serializeMethodTs(abi: TAbiItem) {
            let { fnInputArgumentsTargets, callInputArguments, fnResult } = serializeArgumentsTs(abi);
            if (callInputArguments) {
                callInputArguments = `, ${callInputArguments}`;
            }
            return {
                ts: `    ${abi.name} (sender: TSender, ${fnInputArgumentsTargets.ts}): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>`,
                js: `    ${abi.name} (sender, ${fnInputArgumentsTargets.js})`,
            };
        }
    }

    export function serializeTxDataMethods(className: string, abiJson: TAbiItem[]) {
        let methods = abiJson.filter(x => x.type === 'function');
        let writeMethods = methods.filter(abi => $abiUtils.isReadMethod(abi) === false);
        let lines = writeMethods.map(method => {
            return serializeInterfaceMethodTs(method);
        });

        return {
            ts: lines.map(x => x.ts).join('\n'),
            js: lines.map(x => x.js).join('\n'),
        }


        function serializeInterfaceMethodTs(abi: TAbiItem) {
            let { fnInputArgumentsTargets, callInputArguments, fnResult } = serializeArgumentsTs(abi);
            if (callInputArguments) {
                callInputArguments = `, ${callInputArguments}`;
            }
            return {
                ts: `    ${abi.name} (sender: TSender, ${fnInputArgumentsTargets.ts}): Promise<TEth.TxLike>`,
                js: `    ${abi.name} (sender, ${fnInputArgumentsTargets.js})`,
            }
        }
    }
}



