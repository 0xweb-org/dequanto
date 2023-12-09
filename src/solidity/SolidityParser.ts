import alot from 'alot';

import type {
    ContractDefinition, FunctionDefinition,
} from '@solidity-parser/parser/dist/src/ast-types';

import { SourceFile, TSourceFileContract } from './SlotsParser/SourceFile';
import { Ast } from './SlotsParser/Ast';
import { ISlotsParserOption } from './SlotsParser/models';

import type { TAbiInput, TAbiItem, TAbiOutput } from '@dequanto/types/TAbi';

export namespace SolidityParser {

    export async function extractAbi (source: { path: string, code?: string }, contractName?: string, opts?: ISlotsParserOption): Promise<TAbiItem[]> {
        const sourceFile = new SourceFile(source.path, source.code, opts?.files);
        const chain = await sourceFile.getContractInheritanceChain(contractName);
        return await extractAbiInner(chain, opts);
    }

    async function extractAbiInner(inheritanceChain: { contract: ContractDefinition, file: SourceFile }[], opts?: ISlotsParserOption) {

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

    async function extractAbiInnerSingle (contract: ITypeCtx, inheritanceChain: TSourceFileContract[], opts?: {
        withConstants?: boolean
        withImmutables?: boolean
    }) {
        let abiFns = await alot(Ast.getFunctionDeclarations(contract.contract))
            .filter($fn => {
                let isPublic = $fn.visibility === 'external' || $fn.visibility === 'public' || $fn.isConstructor;
                return isPublic;
            })
            .mapAsync(async $fn => Ast.getAbi($fn, contract, inheritanceChain))
            .toArrayAsync();



        let abiGetters = await alot(Ast.getVariableDeclarations(contract.contract))
            .filter($var => {
                let isPublic = $var.visibility === 'public';
                return isPublic;
            })
            .mapAsync(async $var => Ast.getAbi($var, contract, inheritanceChain))
            .toArrayAsync();


        return [
            ...abiFns,
            ...abiGetters,
        ];
    }
}


interface ITypeCtx {
    contract: ContractDefinition
    contractBase?: ContractDefinition[]
    file: SourceFile
};
