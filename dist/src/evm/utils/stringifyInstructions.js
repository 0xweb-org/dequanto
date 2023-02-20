"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stringifyInstructions = void 0;
const stringifyInstructions = (instructionTree, indentation = 0) => {
    let instructionLines = '';
    instructionTree.forEach((instruction) => {
        if (instruction.name === 'JUMPI' && instruction.false) {
            const condition = instruction.toString();
            const falseInstructions = instruction.false.filter((i) => i.debugLevel > 0);
            if (falseInstructions.length === 1 && falseInstructions[0].name === 'JUMPI') {
                instructionLines += ' '.repeat(indentation) + 'if' + condition + ' {\n';
                instructionLines += (0, exports.stringifyInstructions)(instruction.true, indentation + 4);
                instructionLines += ' '.repeat(indentation) + '} else ';
                const elseOrElseIf = (0, exports.stringifyInstructions)(instruction.false, indentation);
                if (elseOrElseIf.trim().startsWith('if')) {
                    instructionLines += elseOrElseIf.trim() + '\n';
                }
                else {
                    instructionLines +=
                        '{\n' +
                            elseOrElseIf
                                .split('\n')
                                .filter(l => l)
                                .map(l => ' '.repeat(4) + l)
                                .join('\n');
                    instructionLines += '\n' + ' '.repeat(indentation) + '}\n';
                }
            }
            else {
                instructionLines += ' '.repeat(indentation) + 'if' + condition + ' {\n';
                instructionLines += (0, exports.stringifyInstructions)(instruction.true, indentation + 4);
                instructionLines += ' '.repeat(indentation) + '} else {\n';
                instructionLines += (0, exports.stringifyInstructions)(instruction.false, indentation + 4);
                instructionLines += ' '.repeat(indentation) + '}\n';
            }
        }
        else {
            instructionLines += ' '.repeat(indentation) + instruction.toString() + '\n';
        }
    });
    return instructionLines;
};
exports.stringifyInstructions = stringifyInstructions;
exports.default = exports.stringifyInstructions;