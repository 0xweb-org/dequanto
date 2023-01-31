"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JUMPI = exports.REQUIRE = exports.Variable = exports.TopLevelFunction = void 0;
const _is_1 = require("@dequanto/utils/$is");
const stringify_1 = __importDefault(require("../utils/stringify"));
const updateCallDataLoad = (item, types) => {
    for (const i in item) {
        if (item.hasOwnProperty(i)) {
            if (typeof item[i] === 'object' &&
                item[i].name === 'CALLDATALOAD' &&
                _is_1.$is.BigInt(item[i].location)) {
                const argNumber = item[i].location
                    .subtract(4)
                    .divide(32)
                    .toString();
                item[i].type = types[argNumber];
            }
            if (typeof item[i] === 'object') {
                updateCallDataLoad(item[i], types);
            }
        }
    }
};
const findReturns = (item) => {
    const returns = [];
    for (const i in item) {
        if (item.hasOwnProperty(i)) {
            if (typeof item[i] === 'object' &&
                item[i].name === 'RETURN' &&
                item[i].items &&
                item[i].items.length > 0) {
                returns.push(item[i].items);
            }
            if (typeof item[i] === 'object') {
                const deepReturns = findReturns(item[i]);
                if (deepReturns.length > 0) {
                    returns.push(...deepReturns);
                }
            }
        }
    }
    return returns;
};
class TopLevelFunction {
    constructor(state, items, hash, gasUsed) {
        this.name = 'Function';
        this.hash = hash;
        this.gasUsed = gasUsed;
        this.items = items;
        this.payable = true;
        this.visibility = 'public';
        this.constant = false;
        this.returns = [];
        if (this.items.length > 0 &&
            this.items[0] instanceof REQUIRE &&
            this.items[0].condition.name === 'ISZERO' &&
            this.items[0].condition.item.name === 'CALLVALUE') {
            this.payable = false;
            this.items.shift();
        }
        if (this.items.length === 1 && this.items[0].name === 'RETURN') {
            this.constant = true;
        }
        if (this.hash in state.store.functionHashes) {
            const functionName = (state.store.functionHashes)[this.hash].split('(')[0];
            const argumentTypes = (state.store.functionHashes)[this.hash]
                .replace(functionName, '')
                .substr(1)
                .slice(0, -1)
                .split(',');
            if (argumentTypes.length > 1 ||
                (argumentTypes.length === 1 && argumentTypes[0] !== '')) {
                this.items.forEach((item) => updateCallDataLoad(item, argumentTypes));
            }
        }
        const returns = [];
        this.items.forEach((item) => {
            const deepReturns = findReturns(item);
            if (deepReturns.length > 0) {
                returns.push(...deepReturns);
            }
        });
        if (returns.length > 0 &&
            returns.every((returnItem) => returnItem.length === returns[0].length &&
                returnItem.map((item) => item.type).join('') ===
                    returns[0].map((item) => item.type).join(''))) {
            returns[0].forEach((item) => {
                if (_is_1.$is.BigInt(item)) {
                    this.returns.push('uint256');
                }
                else if (item.type) {
                    this.returns.push(item.type);
                }
                else {
                    this.returns.push('unknown');
                }
            });
        }
        else if (returns.length > 0) {
            this.returns.push('<unknown>');
        }
    }
}
exports.TopLevelFunction = TopLevelFunction;
class Variable {
    constructor(label, types) {
        this.name = 'Variable';
        this.label = label;
        this.types = types;
    }
}
exports.Variable = Variable;
class REQUIRE {
    constructor(condition) {
        this.name = 'REQUIRE';
        this.wrapped = true;
        this.condition = condition;
    }
    toString() {
        return 'require(' + (0, stringify_1.default)(this.condition) + ');';
    }
}
exports.REQUIRE = REQUIRE;
class JUMPI {
    constructor(condition, location, ifTrue, ifFalse, skipped) {
        this.name = 'JUMPI';
        this.wrapped = true;
        this.condition = condition;
        this.location = location;
        if (skipped) {
            this.valid = true;
        }
        else if (ifTrue && ifFalse) {
            this.valid = true;
            this.true = ifTrue;
            this.false = ifFalse;
            if (this.true.length >= 1 &&
                this.true[0] instanceof REQUIRE &&
                this.true[0].condition.name === 'ISZERO' &&
                this.true[0].condition.item.name === 'CALLVALUE') {
                this.payable = false;
                this.true.shift();
            }
            else {
                this.payable = true;
            }
        }
        else {
            this.valid = false;
        }
    }
    toString() {
        if (this.valid && this.true && this.false) {
            return (0, stringify_1.default)(this.condition);
        }
        else if (this.valid) {
            return 'if' + (0, stringify_1.default)(this.condition) + ' goto(' + (0, stringify_1.default)(this.location) + ');';
        }
        else {
            return "revert(\"Bad jump destination\");";
        }
    }
}
exports.JUMPI = JUMPI;
exports.default = (opcode, state) => {
    const jumpLocation = state.stack.pop();
    const jumpCondition = state.stack.pop();
    const opcodes = state.getOpcodes();
    if (!_is_1.$is.BigInt(jumpLocation)) {
        state.halted = true;
        state.instructions.push(new JUMPI(jumpCondition, jumpLocation));
    }
    else {
        const jumpLocationData = opcodes.find((o) => o.pc === Number(jumpLocation));
        if (!jumpLocationData || jumpLocationData.name !== 'JUMPDEST') {
            state.halted = true;
            state.instructions.push(new JUMPI(jumpCondition, jumpLocation));
        }
        else if (_is_1.$is.BigInt(jumpCondition)) {
            const jumpIndex = opcodes.indexOf(jumpLocationData);
            if (jumpIndex >= 0 &&
                jumpCondition !== 0n &&
                !(opcode.pc + ':' + Number(jumpLocation) in state.jumps)) {
                state.jumps[opcode.pc + ':' + Number(jumpLocation)] = true;
                state.pc = jumpIndex;
            }
        }
        else if (!(opcode.pc + ':' + Number(jumpLocation) in state.jumps) &&
            jumpCondition.name === 'SIG') {
            const jumpIndex = opcodes.indexOf(jumpLocationData);
            if (jumpIndex >= 0) {
                const functionClone = state.clone();
                functionClone.pc = jumpIndex;
                const functionCloneTree = functionClone.parse();
                state.functions[jumpCondition.hash] = new TopLevelFunction(state, functionCloneTree, jumpCondition.hash, functionClone.gasUsed);
                if (jumpCondition.hash in state.store.functionHashes &&
                    functionCloneTree.length === 1 &&
                    functionCloneTree[0].name === 'RETURN' &&
                    functionCloneTree[0].items.every((item) => item.name === 'MappingLoad')) {
                    functionCloneTree[0].items.forEach((item) => {
                        const fullFunction = (state.store.functionHashes)[jumpCondition.hash];
                        state.mappings[item.location].name = fullFunction.split('(')[0];
                        if (item.structlocation &&
                            !state.mappings[item.location].structs.includes(item.structlocation)) {
                            state.mappings[item.location].structs.push(item.structlocation);
                        }
                    });
                    delete state.functions[jumpCondition.hash];
                }
                else if (jumpCondition.hash in state.store.functionHashes &&
                    state.functions[jumpCondition.hash].items.length === 1 &&
                    state.functions[jumpCondition.hash].items[0].name === 'RETURN' &&
                    state.functions[jumpCondition.hash].items[0].items.length === 1 &&
                    state.functions[jumpCondition.hash].items[0].items[0].name === 'SLOAD' &&
                    _is_1.$is.BigInt(state.functions[jumpCondition.hash].items[0].items[0].location)) {
                    if (!(state.functions[jumpCondition.hash].items[0].items[0].location in
                        state.variables)) {
                        const fullFunction = (state.store.functionHashes)[jumpCondition.hash];
                        state.variables[state.functions[jumpCondition.hash].items[0].items[0].location] = new Variable(fullFunction.split('(')[0], []);
                        delete state.functions[jumpCondition.hash];
                    }
                    else {
                        const fullFunction = (state.store.functionHashes)[jumpCondition.hash];
                        state.variables[state.functions[jumpCondition.hash].items[0].items[0].location].label = fullFunction.split('(')[0];
                        delete state.functions[jumpCondition.hash];
                    }
                }
            }
        }
        else if (!(opcode.pc + ':' + Number(jumpLocation) in state.jumps) &&
            ((jumpCondition.name === 'LT' &&
                jumpCondition.left.name === 'CALLDATASIZE' &&
                _is_1.$is.BigInt(jumpCondition.right) &&
                jumpCondition.right.equals(4)) ||
                (jumpCondition.name === 'ISZERO' && jumpCondition.item.name === 'CALLDATASIZE'))) {
            const jumpIndex = opcodes.indexOf(jumpLocationData);
            if (jumpIndex >= 0) {
                state.halted = true;
                const trueClone = state.clone();
                trueClone.pc = jumpIndex;
                const trueCloneTree = trueClone.parse();
                const falseClone = state.clone();
                falseClone.pc = state.pc + 1;
                const falseCloneTree = falseClone.parse();
                if (trueCloneTree.length > 0 &&
                    trueCloneTree.length === falseCloneTree.length &&
                    trueCloneTree[0].name !== 'REVERT' &&
                    trueCloneTree[0].name !== 'INVALID' &&
                    trueCloneTree.map((item) => (0, stringify_1.default)(item)).join('') ===
                        falseCloneTree.map((item) => (0, stringify_1.default)(item)).join('')) {
                    state.functions[''] = new TopLevelFunction(state, trueCloneTree, '', trueCloneTree.gasUsed);
                }
                else if (trueCloneTree.length > 0 &&
                    trueCloneTree[0].name !== 'REVERT' &&
                    trueCloneTree[0].name !== 'INVALID') {
                    state.instructions.push(new JUMPI(jumpCondition, jumpLocation, trueCloneTree, falseCloneTree));
                }
            }
            else {
                state.instructions.push(new JUMPI(jumpCondition, jumpLocation));
            }
        }
        else if (!(opcode.pc + ':' + Number(jumpLocation) in state.jumps)) {
            const jumpIndex = opcodes.indexOf(jumpLocationData);
            state.jumps[opcode.pc + ':' + Number(jumpLocation)] = true;
            if (jumpIndex >= 0) {
                state.halted = true;
                const trueClone = state.clone();
                trueClone.pc = jumpIndex;
                const trueCloneTree = trueClone.parse();
                const falseClone = state.clone();
                falseClone.pc = state.pc + 1;
                const falseCloneTree = falseClone.parse();
                if ((falseCloneTree.length === 1 &&
                    'name' in falseCloneTree[0] &&
                    (falseCloneTree[0].name === 'REVERT' &&
                        falseCloneTree[0].items &&
                        falseCloneTree[0].items.length === 0)) ||
                    falseCloneTree[0].name === 'INVALID') {
                    state.instructions.push(new REQUIRE(jumpCondition));
                    state.instructions.push(...trueCloneTree);
                }
                else {
                    state.instructions.push(new JUMPI(jumpCondition, jumpLocation, trueCloneTree, falseCloneTree));
                }
            }
            else {
                state.instructions.push(new JUMPI(jumpCondition, jumpLocation));
            }
        }
        else {
            state.instructions.push(new JUMPI(jumpCondition, jumpLocation, null, null, true));
        }
    }
};
