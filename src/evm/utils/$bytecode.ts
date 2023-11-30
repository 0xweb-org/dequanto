import { TEth } from '@dequanto/models/TEth';
import IOpcode from '../interfaces/IOpcode';
import { EvmBytecode } from '../EvmBytecode';
import { $require } from '@dequanto/utils/$require';
import { $buffer } from '@dequanto/utils/$buffer';

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

    export function parseContractCreation(input: TEth.Hex) {

        let evm = new EvmBytecode(input, { withConstructorCode: true });
        let opcodes = evm.getOpcodes();

        // match 60806040
        let ctorCodeIdx = indexOf(opcodes, [
            (op) => op.opcode === 0x60 && op.pushData[0] === 0x80,
            (op) => op.opcode === 0x60 && op.pushData[0] === 0x40,
        ], 2);

        let codeSizeIdx = opcodes.findIndex(x => x.name === 'CODESIZE');
        if (codeSizeIdx === -1 || codeSizeIdx > ctorCodeIdx) {
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
