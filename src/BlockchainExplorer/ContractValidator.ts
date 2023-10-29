import alot from 'alot';
import { File } from 'atma-io';
import { ContractBase } from '@dequanto/contracts/ContractBase';
import { ContractDeployer } from '@dequanto/contracts/deploy/ContractDeployer';
import { Deployments } from '@dequanto/contracts/deploy/Deployments';
import { LoggerService } from '@dequanto/loggers/LoggerService';
import { TEth } from '@dequanto/models/TEth';
import { SourceFile } from '@dequanto/solidity/SlotsParser/SourceFile';
import { $hex } from '@dequanto/utils/$hex';
import { $is } from '@dequanto/utils/$is';
import { $path } from '@dequanto/utils/$path';
import { $promise } from '@dequanto/utils/$promise';
import { $require } from '@dequanto/utils/$require';
import { Constructor, class_Uri } from 'atma-utils';
import { IBlockChainExplorer } from './IBlockChainExplorer';


type TSubmissionStatus = {
    status: 'verified' | 'pending'
    guid?: string
}
type TContractInfo<T extends ContractBase = ContractBase> = Constructor<T> | string;

export class ContractValidator {

    constructor (
        public deployments: Deployments,
        public explorer: IBlockChainExplorer,
        public logger = new LoggerService('explorer-validator'),
    ) {

    }

    async ensure (Ctor: TContractInfo, opts: { id?: string, waitConfirmation?: boolean } = {}): Promise<void>  {
        let status = await this.submit(Ctor, opts);
        if (status.status === 'verified' || opts.waitConfirmation === false) {
            return;
        }
        let guid = status.guid
        $require.True(/^\w+$/.test(guid), `Invalid guid response for submission: ${guid}`);
        await $promise.waitForTrue(async () => {
            try {
                let result = await this.explorer.checkContractValidationSubmission({ guid });
                return /Verified/.test(result);
            } catch (e) {
                let message = e.message;
                if (/(Pending|queue)/.test(message)) {
                    this.logger.log(`Waiting for contract validation submission: ${guid}`);
                    return false;
                }
                this.logger.log(`Validation failed: ${message}`);
                throw e;
            }
        }, {
            intervalMs: 4000,
            timeoutMs: 2 * 60 * 1000 // 2 minutes
        });
    }

    async submit(Ctor: TContractInfo, opts?: {
        id?: string;
    }): Promise<TSubmissionStatus> {
        let client = this.deployments.client;
        let contractName = typeof Ctor === 'string' ? Ctor : Ctor.name;
        let deployment = await this.deployments.getDeploymentInfo(Ctor, opts);
        $require.notNull(deployment, `Deployment not found for ${opts?.id ?? contractName}`);
        let address = deployment.implementation ?? deployment.address;

        let currentSources = await this.explorer.getContractSource(address);
        if (currentSources != null && $is.notEmpty(currentSources.ContractName)) {
            return { status:'verified' };
        }

        let deployedBytecode = await client.getCode(address);
        $require.True($is.HexBytes32(deployedBytecode), `Bytecode ${client.platform}:${address} is invalid: "${deployedBytecode}"`);

        let constructorArguments = '' as TEth.Hex;



        let deployer = new ContractDeployer(client, null /*account*/);
        let info = await deployer.prepareDeployment({
            name: contractName
        });

        let abi = info.ctx.abi;
        let ctorAbi = abi.find(x => x.type === 'constructor');
        if (ctorAbi?.inputs?.length > 0) {
            let tx = await this.deployments.client.getTransaction(deployment.tx);
            let inputBytecode = tx.input;

            let inputBytecodeRaw = $hex.raw(inputBytecode);
            let deployedBytecodeRaw = $hex.raw(deployedBytecode);

            let index = inputBytecodeRaw.indexOf(deployedBytecodeRaw);
            let ctorArgumentsEncoded = (`0x` + inputBytecodeRaw.substring(index + deployedBytecodeRaw.length)) as TEth.Hex;
            constructorArguments = ctorArgumentsEncoded; //$abiCoder.decode(ctorAbi.inputs, ctorArgumentsEncoded);
        }

        let jsonMetaPath = info.ctx.source.path;
        $require.notEmpty(jsonMetaPath, `Deployment should return a path to compilation JSON`);
        $require.True(await File.existsAsync(jsonMetaPath) , `${jsonMetaPath} does not exist`);

        let jsonMeta = await File.readAsync<{ sourceName: string, contractName: string }>(jsonMetaPath);

        let jsonMetaDbgPath = jsonMetaPath.replace('.json','.dbg.json');
        $require.True(await File.existsAsync(jsonMetaDbgPath) , `${jsonMetaDbgPath} does not exist`);
        let jsonMetaDbg = await File.readAsync<{ buildInfo: string }>(jsonMetaDbgPath);

        let jsonMetaBuildInfoPath = jsonMetaDbg.buildInfo;
        $require.notEmpty(jsonMetaPath, `${jsonMetaDbgPath} should contain the path to the buildInfo json file`);

        let buildInfoPath = new class_Uri(new class_Uri(jsonMetaPath).toDir()).combine(jsonMetaBuildInfoPath).toString();
        $require.True(await File.existsAsync(buildInfoPath) , `${buildInfoPath} does not exist`);

        type TBuildInfo = {
            solcLongVersion: string
            input: {
                settings: {
                    optimizer: {
                        enabled: boolean
                        runs: number
                    }
                    evmVersion: "paris" | string
                    outputSelection: any
                }
            }
        }
        let buildInfo = await File.readAsync<TBuildInfo>(buildInfoPath);

        $require.notNull(buildInfo.solcLongVersion, `${buildInfoPath} should contain the "solcLongVersion" information`);

        let sources = await this.getSources(jsonMeta.sourceName);
        let sourcesSerialized = JSON.stringify({
            language: "Solidity",
            sources: sources,
            settings: buildInfo.input.settings
        }, null, 4);
        let sourcesSerializedWrapped = `${sourcesSerialized}`;


        let guid = await this.explorer.submitContractValidation({
            address: address,
            compilerVersion: `v` + buildInfo.solcLongVersion,
            contractName: `${jsonMeta.sourceName}:${jsonMeta.contractName}`,
            optimizer: buildInfo.input.settings.optimizer,
            arguments: constructorArguments,
            sourceCode: sourcesSerializedWrapped
        });

        return {
            status: 'pending',
            guid
        };
    }


    private async getSources (main: string) {
        let sources = {} as {
            [path: string]: {
                content: string
            }
        }

        async function crawlSourceFile (source: SourceFile) {
            let path = source.file.uri.toRelativeString(process.cwd() + '/');
            path = $path.normalize(path);

            if (path.startsWith('node_modules/')) {
                path = path.replace('node_modules/', '');
            }

            if (path in sources) {
                return;
            }
            let content = await source.file.readAsync <string> ({ skipHooks: true });
            sources[path] = {
                content
            };

            let imports = await source.getImports();
            await alot(imports).forEachAsync(async imp => {
                let source = imp.file;
                await crawlSourceFile(source);
            }).toArrayAsync({ threads: 4 });
        }

        await crawlSourceFile(new SourceFile(main));

        this.logger.log(`Found ${Object.keys(sources).length} source files: `, Object.keys(sources));
        return sources;
    }
}
