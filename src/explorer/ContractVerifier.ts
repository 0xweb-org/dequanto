import alot from 'alot';
import { File } from 'atma-io';
import { Constructor, class_Uri } from 'atma-utils';
import { ContractBase } from '@dequanto/contracts/ContractBase';
import { ContractDeployer } from '@dequanto/contracts/deploy/ContractDeployer';
import { Deployments } from '@dequanto/contracts/deploy/Deployments';
import { LoggerService } from '@dequanto/loggers/LoggerService';
import { TEth } from '@dequanto/models/TEth';
import { SourceFile } from '@dequanto/solidity/SlotsParser/SourceFile';
import { $is } from '@dequanto/utils/$is';
import { $path } from '@dequanto/utils/$path';
import { $promise } from '@dequanto/utils/$promise';
import { $require } from '@dequanto/utils/$require';
import { IBlockChainExplorer } from './IBlockChainExplorer';
import { $contract } from '@dequanto/utils/$contract';
import { $abiCoder } from '@dequanto/abi/$abiCoder';


type TSubmissionStatus = {
    status: 'verified' | 'pending'
    guid?: string
}
type TSubmissionOptions = {
    id?: string
    waitConfirmation?: boolean
    address?: TEth.Address
    proxyFor?: TEth.Address
    constructorParams?: any[]
};
type TContractInfo<T extends ContractBase = ContractBase> = Constructor<T> | string;

export class ContractVerifier {

    constructor (
        public deployments: Deployments,
        public explorer: IBlockChainExplorer,
        public logger = new LoggerService('ContractVerifier'),
    ) {

    }

    async ensure (Ctor: TContractInfo, opts: TSubmissionOptions = {}): Promise<void>  {
        this.logger.log(`Submit sources for ${typeof Ctor === 'string' ? Ctor : Ctor.name}`);

        let status = await this.submit(Ctor, opts);
        await this.waitForVerification(status, opts);

        if ($is.Address(opts.proxyFor)) {
            let proxyStatus = await this.submitProxy(opts);
            await this.waitForProxyVerification(proxyStatus, opts);
        }
    }

    private async waitForVerification (status: TSubmissionStatus, opts: TSubmissionOptions): Promise<void> {
        if (status.status === 'verified' || opts.waitConfirmation === false) {
            return;
        }
        let guid = status.guid
        $require.True(/^\w+$/.test(guid), `Invalid guid response for submission: ${guid}`);
        await $promise.waitForTrue(async () => {
            try {
                let result = await this.explorer.checkContractVerificationSubmission({ guid });
                return /verified/i.test(result);
            } catch (e) {
                let message = e.message;
                if (/verified/i.test(message)) {
                    // was already verified
                    return true;
                }
                if (/(pending|queue)/i.test(message)) {
                    this.logger.log(`Waiting for contract verification submission: ${guid}`);
                    return false;
                }
                this.logger.log(`Verification failed: ${message}`);
                throw e;
            }
        }, {
            intervalMs: 4000,
            timeoutMs: 2 * 60 * 1000 // 2 minutes
        });
    }

    private async submit(Ctor: TContractInfo, opts?: {
        id?: string
        address?: TEth.Address
        proxyFor?: TEth.Address
        constructorParams?: any[]
    }): Promise<TSubmissionStatus> {
        let client = this.deployments.client;
        let contractName = typeof Ctor === 'string' ? Ctor : Ctor.name;
        let deployment = await this.deployments.store.getDeploymentInfo(Ctor, opts);
        $require.notNull(deployment, `Deployment not found for ${opts?.id ?? contractName}`);
        let address = opts?.address ?? deployment.implementation ?? deployment.address;

        try {
            this.logger.log(`Checking if already verified ${address}`);
            let currentSources = await this.explorer.getContractSource(address);
            if ($is.notEmpty(currentSources?.ContractName)) {
                return { status:'verified' };
            }
        } catch (error) {
            // ignore any pre-check error and continue with the verification
        }

        let deployedBytecode = await client.getCode(address);
        $require.True($is.HexBytes32(deployedBytecode), `Bytecode ${client.platform}:${address} is invalid: "${deployedBytecode}"`);

        let constructorArguments = '' as TEth.Hex;

        let deployer = new ContractDeployer(client, null /*account*/);
        let info = typeof Ctor === 'string'
            ? await deployer.prepareDeployment({ name: contractName })
            : await deployer.prepareDeployment({ contract: Ctor })
            ;

        let abi = info.ctx.abi;
        let ctorAbi = abi.find(x => x.type === 'constructor');
        if (ctorAbi?.inputs?.length > 0) {
            if (opts?.constructorParams == null) {
                let tx = await this.deployments.client.getTransaction(deployment.tx);
                $require.notNull(tx, `Tx ${deployment.tx} not found in ${this.deployments.client.network}`);
                let parsedArguments = $contract.decodeDeploymentArguments(tx.input, ctorAbi);
                constructorArguments = parsedArguments.encoded;
            } else {
                constructorArguments = $abiCoder.encode(ctorAbi.inputs, opts.constructorParams);
            }
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

        this.logger.log(`Submit ${jsonMeta.sourceName}:${jsonMeta.contractName} and dependencies to verify ${address} contract`);

        try {
            let guid = await this.explorer.submitContractVerification({
                address: address,
                compilerVersion: `v` + buildInfo.solcLongVersion,
                contractName: `${jsonMeta.sourceName}:${jsonMeta.contractName}`,
                optimizer: buildInfo.input.settings.optimizer,
                arguments: constructorArguments,
                sourceCode: sourcesSerializedWrapped
            });
            if (guid == null) {
                return { status: 'verified' };
            }

            return {
                status: 'pending',
                guid
            };
        } catch (error) {
            if (/already verified/i.test(error.message)) {
                return { status: 'verified' };
            }
            throw error;
        }
    }


    private async getSources (main: string) {
        let sources = {} as {
            [path: string]: {
                content: string
            }
        }

        async function crawlSourceFile (source: SourceFile) {
            let uri = await source.getUri();
            let path = uri.toRelativeString(process.cwd() + '/');
            path = $path.normalize(path);

            let rgxNodeModules = /^\/?node_modules\//;
            if (rgxNodeModules.test(path)) {
                path = path.replace(rgxNodeModules, '');
            }

            if (path in sources) {
                return;
            }
            let content = await source.getContent();
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

    private async submitProxy (opts: TSubmissionOptions): Promise<TSubmissionStatus> {
        let { address, proxyFor } = opts;
        try {
            let guid = await this.explorer.submitContractProxyVerification({
                address: address,
                expectedImplementation: proxyFor
            });
            if (guid == null) {
                return { status: 'verified' };
            }

            return {
                status: 'pending',
                guid
            };
        } catch (error) {
            if (/already verified/i.test(error.message)) {
                return { status: 'verified' };
            }
            throw error;
        }
    }

    private async waitForProxyVerification (status: TSubmissionStatus, opts: TSubmissionOptions): Promise<void> {
        if (status.status === 'verified' || opts.waitConfirmation === false) {
            return;
        }
        let guid = status.guid
        $require.True(/^\w+$/.test(guid), `Invalid guid response for submission: ${guid}`);
        await $promise.waitForTrue(async () => {
            try {
                let result = await this.explorer.checkContractProxyVerificationSubmission({ guid });
                this.logger.log(`Proxy verification result: ${result}`);
                return /(verified|success)/i.test(result);
            } catch (e) {
                let message = e.message;
                if (/verified|success/i.test(message)) {
                    // was already verified
                    return true;
                }
                if (/(pending|queue)/i.test(message)) {
                    this.logger.log(`Waiting for contract proxy verification submission: ${guid}`);
                    return false;
                }
                this.logger.log(`Proxy verification failed: ${message}`);
                throw e;
            }
        }, {
            intervalMs: 4000,
            timeoutMs: 2 * 60 * 1000 // 2 minutes
        });
    }
}
