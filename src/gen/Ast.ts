import type { SourceUnit, ContractDefinition } from 'solidity-ast';
import parser from '@solidity-parser/parser';


export class Ast {

    static parse (source: string) {
        let ast = parser.parse(source, {
            tolerant: true,
        });

    }
}
