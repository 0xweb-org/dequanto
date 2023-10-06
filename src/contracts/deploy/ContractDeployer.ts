import { $abiCoder } from '@dequanto/abi/$abiCoder';
import { Web3Client } from '@dequanto/clients/Web3Client';
import { IAccount } from '@dequanto/models/TAccount';
import { TEth } from '@dequanto/models/TEth';
import { TxWriter } from '@dequanto/txs/TxWriter';
import { TAbiItem } from '@dequanto/types/TAbi';
import { $hex } from '@dequanto/utils/$hex';
import { $require } from '@dequanto/utils/$require';
import { ContractDeployment } from './ContractDeployment';
import { $is } from '@dequanto/utils/$is';
import { Directory, File } from 'atma-io';


type TDeploymentByName = {
    name: string
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
    }
    name?: string
    artifacts?: string
    params?: any[]
}
type TDeploymentWithBytecode = {
    bytecode: TEth.Hex
    name?: string
    abi?: TAbiItem[]
    params?: any[]
}

export class ContractDeployer {
    constructor (private client: Web3Client, private account: IAccount) {

    }

    async prepareDeployment (byName: TDeploymentByName)
    async prepareDeployment (byMetaFile: TDeploymentByMetaFile)
    async prepareDeployment (byMetaJson: TDeploymentByMetaJson)
    async prepareDeployment (byBytecode: TDeploymentWithBytecode)
    async prepareDeployment (ctx: TDeploymentByName | TDeploymentWithBytecode | TDeploymentByMetaFile | TDeploymentByMetaJson) {
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
        let files = await Directory.readFilesAsync(artifacts, '**.json');
        let file = files.find(x => x.uri.file === `${ctx.name}.json`);
        $require.notNull(file, `File for the contract ${ctx.name} not found within: \n ${ files.map(x => x.uri.toString()).join('\n') }`);

        return this.fromMetaFile ({
            ...ctx,
            path: file.uri.toString()
        });
    }

    private async fromMetaFile (ctx: TDeploymentByMetaFile) {
        $require.notNull(ctx.path, 'Contract name is required');
        $require.True(await File.existsAsync(ctx.path), `File does not exist: ${ctx.path}`);

        let json = await File.readAsync<TDeploymentByMetaJson['json']>(ctx.path);
        return this.fromMetaJson({
            ...ctx,
            json: json
        })
    }

    private async fromMetaJson (ctx: TDeploymentByMetaJson) {
        $require.notNull(ctx.json?.bytecode, 'Contract bytecode is expected in json');


        return this.fromBytecode({
            ...ctx,
            bytecode: ctx.json.bytecode,
            abi: ctx.json.abi
        });
    }

    private async fromBytecode (ctx: TDeploymentWithBytecode) {
        $require.True($is.Hex(ctx.bytecode), 'bytecode must be a hex string');

        let deployment = new ContractDeployment({
            client: this.client,
            account: this.account,
            bytecode: ctx.bytecode,
            abi: ctx.abi ?? [],
            params: ctx.params ?? []
        });
        return deployment;
    }
}
