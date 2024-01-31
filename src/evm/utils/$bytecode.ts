import { TEth } from '@dequanto/models/TEth';
import IOpcode from '../interfaces/IOpcode';
import { EvmBytecode } from '../EvmBytecode';
import { $require } from '@dequanto/utils/$require';
import { $buffer } from '@dequanto/utils/$buffer';
import { $hex } from '@dequanto/utils/$hex';

export namespace $bytecode {

    /**
     * remove the constructor code, leave the runtime bytecode only
     */
    export function trimConstructorCode (code: TEth.Hex) {
        let initCode = code.indexOf('60806040', 4);
        if (initCode > -1) {
            code = `0x${code.substring(initCode)}`;
        }
        return code;
    }

    export function splitToMetadata (code: TEth.Hex) {
        let totalSize = $hex.getBytesLength(code);
        let metadataSizeOffset = totalSize - 2;
        let metadataSize = $hex.getNumber(code, metadataSizeOffset, 2);
        let bytecodeHex = $hex.getBytes(code, 0, metadataSizeOffset - metadataSize);
        let metadataHex = $hex.getBytes(code, metadataSizeOffset - metadataSize, metadataSize);
        return {
            bytecode: bytecodeHex,
            metadata: metadataHex
        };
    }

    export function parseContractCreation(input: TEth.Hex) {

        let evm = new EvmBytecode(input, { withConstructorCode: true });
        let opcodes = evm.getOpcodes();

        /**
         * bytecode: constructor code | contract code | constructor parameters
         * CODESIZE OPCODE must be within the constructor code
         */

        // match 60806040 the beginning of the contract code
        let ctorCodeIdx = indexOf(opcodes, [
            (op) => op.opcode === 0x60 && op.pushData[0] === 0x80,
            (op) => op.opcode === 0x60 && op.pushData[0] === 0x40,
        ], 2);

        let codeSizeIdx = opcodes.findIndex(x => x.name === 'CODESIZE');
        if (codeSizeIdx === -1 || codeSizeIdx > ctorCodeIdx) {
            // CODESIZE if found in contract code, so it is something different
            return { arguments: null }
        }

        let prev = opcodes[codeSizeIdx - 1];
        $require.True(/PUSH/.test(prev.name), `PUSH expected but got ${prev.name}`);

        let codeSizeValue = $buffer.toBigInt(prev.pushData) * 2n;
        return {
            arguments: ('0x' + input.substring(2 /*0x*/ + Number(codeSizeValue))) as TEth.Hex,
        };
    }

    function indexOf(opcodes: IOpcode[], matchers: ((op: IOpcode, i?: number) => boolean)[], startIdx: number = 0) {
        outer: for (let i = startIdx; i < opcodes.length - matchers.length; i++) {
            for (let j = 0; j < matchers.length; j++) {
                let op = opcodes[i + j];
                if (matchers[j](op, i + j) === false) {
                    continue outer;
                }
            }
            return i;
        }
        return -1;
    }
}
