"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SSTORE = exports.MappingStore = void 0;
const _is_1 = require("@dequanto/utils/$is");
const stringify_1 = __importDefault(require("../utils/stringify"));
const jumpi_1 = require("./jumpi");
const parseMapping = (...items) => {
    const mappings = [];
    items.forEach((item2) => {
        if (item2.name === 'SHA3' && item2.items) {
            mappings.push(...parseMapping(...item2.items));
        }
        else {
            mappings.push(item2);
        }
    });
    return mappings;
};
class MappingStore {
    constructor(mappings, location, items, data, count, structlocation) {
        this.name = 'MappingStore';
        this.wrapped = false;
        this.location = location;
        this.items = items;
        this.data = data;
        this.count = count;
        this.structlocation = structlocation;
        this.mappings = mappings;
    }
    toString() {
        let mappingName = 'mapping' + (this.count + 1);
        if (this.location in this.mappings() && this.mappings()[this.location].name) {
            mappingName = this.mappings()[this.location].name;
        }
        if (this.data.name === 'ADD' &&
            this.data.right.name === 'MappingLoad' &&
            (0, stringify_1.default)(this.data.right.location) === (0, stringify_1.default)(this.location)) {
            return (mappingName +
                this.items.map((item) => '[' + (0, stringify_1.default)(item) + ']').join('') +
                ' += ' +
                (0, stringify_1.default)(this.data.left) +
                ';');
        }
        else if (this.data.name === 'SUB' &&
            this.data.left.name === 'MappingLoad' &&
            (0, stringify_1.default)(this.data.left.location) === (0, stringify_1.default)(this.location)) {
            return (mappingName +
                this.items.map((item) => '[' + (0, stringify_1.default)(item) + ']').join('') +
                ' -= ' +
                (0, stringify_1.default)(this.data.right) +
                ';');
        }
        else {
            return (mappingName +
                this.items.map((item) => '[' + (0, stringify_1.default)(item) + ']').join('') +
                ' = ' +
                (0, stringify_1.default)(this.data) +
                ';');
        }
    }
}
exports.MappingStore = MappingStore;
class SSTORE {
    constructor(location, data, variables) {
        this.name = 'SSTORE';
        this.wrapped = true;
        this.location = location;
        this.data = data;
        this.variables = variables;
        if (_is_1.$is.BigInt(this.location) && this.location.toString() in this.variables()) {
            this.variables()[this.location.toString()].types.push(() => this.data.type);
        }
        else if (_is_1.$is.BigInt(this.location) &&
            !(this.location.toString() in this.variables())) {
            this.variables()[this.location.toString()] = new jumpi_1.Variable(false, [
                () => this.data.type
            ]);
        }
    }
    toString() {
        let variableName = 'storage[' + (0, stringify_1.default)(this.location) + ']';
        if (_is_1.$is.BigInt(this.location) && this.location.toString() in this.variables()) {
            if (this.variables()[this.location.toString()].label) {
                variableName = this.variables()[this.location.toString()].label;
            }
            else {
                variableName =
                    'var' + (Object.keys(this.variables()).indexOf(this.location.toString()) + 1);
            }
        }
        if (this.data.name === 'ADD' &&
            this.data.right.name === 'SLOAD' &&
            (0, stringify_1.default)(this.data.right.location) === (0, stringify_1.default)(this.location)) {
            return variableName + ' += ' + (0, stringify_1.default)(this.data.left) + ';';
        }
        else if (this.data.name === 'SUB' &&
            this.data.left.name === 'SLOAD' &&
            (0, stringify_1.default)(this.data.left.location) === (0, stringify_1.default)(this.location)) {
            return variableName + ' -= ' + (0, stringify_1.default)(this.data.right) + ';';
        }
        else {
            return variableName + ' = ' + (0, stringify_1.default)(this.data) + ';';
        }
    }
}
exports.SSTORE = SSTORE;
exports.default = (opcode, state) => {
    const storeLocation = state.stack.pop();
    const storeData = state.stack.pop();
    if (storeLocation.name === 'SHA3') {
        const mappingItems = parseMapping(...storeLocation.items);
        const mappingLocation = mappingItems.find((mappingItem) => _is_1.$is.BigInt(mappingItem));
        const mappingParts = mappingItems.filter((mappingItem) => !_is_1.$is.BigInt(mappingItem));
        if (mappingLocation && mappingParts.length > 0) {
            if (!(mappingLocation in state.mappings)) {
                state.mappings[mappingLocation] = {
                    name: false,
                    structs: [],
                    keys: [],
                    values: []
                };
            }
            state.mappings[mappingLocation].keys.push(mappingParts);
            state.mappings[mappingLocation].values.push(storeData);
            state.instructions.push(new MappingStore(() => state.mappings, mappingLocation, mappingParts, storeData, Object.keys(state.mappings).indexOf(mappingLocation.toString())));
        }
        else {
            state.instructions.push(new SSTORE(storeLocation, storeData, () => state.variables));
        }
    }
    else if (storeLocation.name === 'ADD' &&
        storeLocation.left.name === 'SHA3' &&
        _is_1.$is.BigInt(storeLocation.right)) {
        const mappingItems = parseMapping(...storeLocation.left.items);
        const mappingLocation = mappingItems.find((mappingItem) => _is_1.$is.BigInt(mappingItem));
        const mappingParts = mappingItems.filter((mappingItem) => !_is_1.$is.BigInt(mappingItem));
        if (mappingLocation && mappingParts.length > 0) {
            if (!(mappingLocation in state.mappings)) {
                state.mappings[mappingLocation] = {
                    name: false,
                    structs: [],
                    keys: [],
                    values: []
                };
            }
            state.mappings[mappingLocation].keys.push(mappingParts);
            state.instructions.push(new MappingStore(() => state.mappings, mappingLocation, mappingParts, storeData, Object.keys(state.mappings).indexOf(mappingLocation.toString()), storeLocation.right));
        }
        else {
            state.instructions.push(new SSTORE(storeLocation, storeData, () => state.variables));
        }
    }
    else if (storeLocation.name === 'ADD' &&
        _is_1.$is.BigInt(storeLocation.left) &&
        storeLocation.right.name === 'SHA3') {
        const mappingItems = parseMapping(...storeLocation.right.items);
        const mappingLocation = mappingItems.find((mappingItem) => _is_1.$is.BigInt(mappingItem));
        const mappingParts = mappingItems.filter((mappingItem) => !_is_1.$is.BigInt(mappingItem));
        if (mappingLocation && mappingParts.length > 0) {
            if (!(mappingLocation in state.mappings)) {
                state.mappings[mappingLocation] = {
                    name: false,
                    structs: [],
                    keys: [],
                    values: []
                };
            }
            state.mappings[mappingLocation].keys.push(mappingParts);
            state.instructions.push(new MappingStore(() => state.mappings, mappingLocation, mappingParts, storeData, Object.keys(state.mappings).indexOf(mappingLocation.toString()), storeLocation.left));
        }
        else {
            state.instructions.push(new SSTORE(storeLocation, storeData, () => state.variables));
        }
    }
    else if (false &&
        _is_1.$is.BigInt(storeLocation) &&
        storeLocation.toString() in state.variables &&
        storeData.type &&
        !state.variables[storeLocation.toString()].types.includes(storeData.type)) {
        state.instructions.push(new SSTORE(storeLocation, storeData, () => state.variables));
        state.variables[storeLocation.toString()].types.push(storeData.type);
    }
    else {
        state.instructions.push(new SSTORE(storeLocation, storeData, () => state.variables));
    }
};
