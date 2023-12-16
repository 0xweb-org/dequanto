import alot from 'alot';

import type {
    ContractDefinition, StructDefinition
} from '@solidity-parser/parser/dist/src/ast-types';

import { SourceFile, TSourceFileContract } from './SlotsParser/SourceFile';
import { Ast } from './SlotsParser/Ast';
import { ISlotsParserOption } from './SlotsParser/models';

import type { TAbiItem } from '@dequanto/types/TAbi';
import { $require } from '@dequanto/utils/$require';

export namespace SolidityParser {

    export async function extractAbi (source: { path: string, code?: string }, contractName?: string, opts?: ISlotsParserOption): Promise<{
        abi: TAbiItem[]
        source: {
            contractName: string,
            files: {
                [path: string]: { content: string }
            }
        }
    }> {
        const sourceFile = new SourceFile(source.path, source.code, opts?.files);
        const chain = await sourceFile.getContractInheritanceChain(contractName);
        $require.notEq(chain.length, 0, `No contract "${contractName}" found in ${source.path}`);

        const abi = await extractAbiInner(chain, opts);
        const contract = await sourceFile.getContract();
        const content = await sourceFile.getContent();
        return {
            abi,
            source: {
                contractName: contract.name ?? contractName,
                files: {
                    [sourceFile.path]: {
                        content: content
                    }
                }
            }
        };
    }

    async function extractAbiInner(inheritanceChain: TSourceFileContract[], opts?: ISlotsParserOption) {

        let abisDef = await alot(inheritanceChain)
            .mapManyAsync(async (item, i) => {
                let cloned = { ...item };
                // get the base classes for the item, as inheritanceChain has the base->...->derived direction
                let inheritance = inheritanceChain.slice(0, i).reverse();
                let abis = await extractAbiInnerSingle(cloned, inheritance, opts);
                return abis;
            })
            .toArrayAsync({ threads: 1 });

        return abisDef;
    }

    async function extractAbiInnerSingle (ctx: ITypeCtx, inheritanceChain: TSourceFileContract[], opts?: {
        withConstants?: boolean
        withImmutables?: boolean
    }) {
        let contract = ctx.contract as ContractDefinition;
        if (Ast.isContractDefinition(contract) === false) {
            throw new Error(`Contract expected, got ${contract?.constructor.name} for ${ctx.contract.name}`);
        }

        let abiFns = await alot(Ast.getFunctionDeclarations(contract))
            .filter($fn => {
                let isPublic = $fn.visibility === 'external' || $fn.visibility === 'public' || $fn.isConstructor;
                return isPublic;
            })
            .mapAsync(async $fn => Ast.getAbi($fn, ctx, inheritanceChain))
            .toArrayAsync();

        let abiGetters = await alot(Ast.getVariableDeclarations(contract))
            .filter($var => {
                let isPublic = $var.visibility === 'public';
                return isPublic;
            })
            .mapAsync(async $var => Ast.getAbi($var, ctx, inheritanceChain))
            .toArrayAsync();

        let abiEvents = await alot(Ast.getEventDefinitions(contract))
            .mapAsync(async $event => Ast.getAbi($event, ctx, inheritanceChain))
            .toArrayAsync();


        return [
            ...abiFns,
            ...abiGetters,
            ...abiEvents,
        ];
    }
}


interface ITypeCtx {
    contract: ContractDefinition | StructDefinition
    contractBase?: ContractDefinition[]
    file: SourceFile
};
