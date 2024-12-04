import { Web3Client } from '@dequanto/clients/Web3Client';
import { IAccount } from '@dequanto/models/TAccount';
import { TEth } from '@dequanto/models/TEth';
import { TAbiItem } from '@dequanto/types/TAbi';
import { $require } from '@dequanto/utils/$require';
import { ContractDeployment } from './ContractDeployment';
import { $is } from '@dequanto/utils/$is';
import { Directory, File } from 'atma-io';
import { Constructor } from '@dequanto/utils/types';
import { ContractBase } from '../ContractBase';


type TDeploymentByName = {
    name: string
    artifacts?: string
    params?: any[]
}

type TDeploymentByContract = {
    contract: Constructor<ContractBase>
    artifacts?: string
    params?: any[]
}
type TDeploymentByMetaFile = {
    path: string
    name?: string
    artifacts?: string
    params?: any[]
}
type TDeploymentByMetaJson = {
    json: {
        contractName: string
        abi: TAbiItem[]
        bytecode: TEth.Hex
        deployedBytecode: TEth.Hex
    }
    source?: {
        path: string
    }
    name?: string
    artifacts?: string
    params?: any[]
}
type TDeploymentWithBytecode = {
    bytecode: TEth.Hex
    deployedBytecode?: TEth.Hex
    name?: string
    abi?: TAbiItem[]
    params?: any[]
    source?: {
        path: string
    }
}

export class ContractDeployer {
    constructor (private client: Web3Client, private account: IAccount) {

    }

    async prepareDeployment (byContractClass: TDeploymentByContract): Promise<ContractDeployment>
    async prepareDeployment (byName: TDeploymentByName): Promise<ContractDeployment>
    async prepareDeployment (byMetaFile: TDeploymentByMetaFile): Promise<ContractDeployment>
    async prepareDeployment (byMetaJson: TDeploymentByMetaJson): Promise<ContractDeployment>
    async prepareDeployment (byBytecode: TDeploymentWithBytecode): Promise<ContractDeployment>
    async prepareDeployment (ctx: TDeploymentByContract | TDeploymentByName | TDeploymentWithBytecode | TDeploymentByMetaFile | TDeploymentByMetaJson): Promise<ContractDeployment> {
        if ('contract' in ctx) {
            return this.fromContract(ctx);
        }
        if ('bytecode' in ctx) {
            return this.fromBytecode(ctx);
        }
        if ('path' in ctx) {
            return this.fromMetaFile(ctx);
        }
        if ('json' in ctx) {
            return this.fromMetaJson(ctx);
        }
        if ('name' in ctx) {
            return this.fromName(ctx);
        }
        throw new Error('Invalid deployment context');
    }

    private async fromName (ctx: TDeploymentByName) {
        $require.notNull(ctx.name, 'Contract name is required');

        let artifacts = ctx.artifacts ?? './artifacts/';
        let files = await $require.resolved(
            Directory.readFilesAsync(artifacts, '**.json'),
            `Artifact files not found for ${ctx.name}`
        );
        let file = files.find(x => x.uri.file === `${ctx.name}.json`);
        $require.notNull(file, `File for the contract ${ctx.name} not found within: \n ${ files.map(x => x.uri.toString()).join('\n') }`);

        return this.fromMetaFile ({
            ...ctx,
            path: file.uri.toString()
        });
    }
    private async fromContract (ctx: TDeploymentByContract) {
        $require.notNull(ctx.contract, 'Contract class is required');

        let artifact = new ctx.contract().$meta?.artifact;
        if (artifact != null) {
            return this.fromMetaFile ({
                ...ctx,
                path: artifact
            });
        }
        $require.notEmpty(ctx.contract.name, `Contract name is empty. Anonymous class?`);
        return this.fromName ({
            ...ctx,
            name: ctx.contract.name
        });
    }

    private async fromMetaFile (ctx: TDeploymentByMetaFile) {
        $require.notNull(ctx.path, 'Contract name is required');
        $require.True(await File.existsAsync(ctx.path), `File does not exist: ${ctx.path}`);

        let json = await File.readAsync<TDeploymentByMetaJson['json']>(ctx.path);
        return this.fromMetaJson({
            ...ctx,
            json: json,
            source: {
                path: ctx.path
            }
        })
    }

    private async fromMetaJson (ctx: TDeploymentByMetaJson) {
        $require.notNull(ctx.json?.bytecode, 'Contract bytecode is expected in json');
        return this.fromBytecode({
            ...ctx,
            bytecode: ctx.json.bytecode,
            deployedBytecode: ctx.json.deployedBytecode,
            abi: ctx.json.abi
        });
    }

    private async fromBytecode (ctx: TDeploymentWithBytecode) {
        $require.True($is.Hex(ctx.bytecode), `bytecode must be a hex string: ${ctx.bytecode}`);

        let deployment = new ContractDeployment({
            client: this.client,
            account: this.account,
            bytecode: ctx.bytecode,
            deployedBytecode: ctx.deployedBytecode,
            abi: ctx.abi ?? [],
            params: ctx.params ?? [],
            source: ctx.source
        });
        return deployment;
    }
}
