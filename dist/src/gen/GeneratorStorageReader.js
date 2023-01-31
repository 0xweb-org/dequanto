"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeneratorStorageReader = void 0;
const alot_1 = __importDefault(require("alot"));
const SlotsParser_1 = require("@dequanto/solidity/SlotsParser");
const _require_1 = require("@dequanto/utils/$require");
const atma_io_1 = require("atma-io");
const Str_1 = require("./utils/Str");
const _abiType_1 = require("@dequanto/utils/$abiType");
const _path_1 = require("@dequanto/utils/$path");
const _gen_1 = require("./utils/$gen");
class GeneratorStorageReader {
    async generate(opts) {
        let { client, sources, contractName, address } = opts;
        let files = alot_1.default.fromObject(sources ?? {}).map(x => {
            return {
                path: x.key,
                content: x.value.content
            };
        }).toArray();
        if (files.length === 0) {
            return {};
        }
        let file = null;
        if (files.length === 1) {
            file = files[0];
        }
        else {
            let rgx = new RegExp(`contract \s*${contractName}`, 'i');
            let main = await (0, alot_1.default)(files.reverse()).findAsync(async (x) => {
                return rgx.test(x.content);
            });
            if (main == null) {
                main = files[0];
            }
            file = main;
        }
        _require_1.$require.String(file?.content ?? file?.path, `Expected a source content to resolve slots`);
        let slots = await SlotsParser_1.SlotsParser.slots({ code: file.content, path: file.path }, contractName, { files });
        let methods = this.serializeSlots(slots);
        let codeMethods = methods.join('\n\n');
        let templatePath = _path_1.$path.resolve(`/src/gen/ContractStorageReaderTemplate.ts`);
        let template = await atma_io_1.File.readAsync(templatePath, { skipHooks: true });
        let className = _gen_1.$gen.toClassName(opts.name + 'StorageReader');
        let code = template
            .replace(`$NAME$`, className)
            .replace(`/* METHODS */`, codeMethods)
            .replace(`$SLOTS$`, JSON.stringify(slots, null, '    '));
        return {
            className: className,
            code: code
        };
    }
    serializeSlots(slots) {
        return slots
            .map(slot => this.serializeSlot(slot))
            .map(Str_1.Str.formatMethod);
    }
    serializeSlot(slot) {
        let name = slot.name;
        let type = slot.type;
        let { parametersTypes, parametersCall, returnType } = this.getParameters(type);
        return `
            async ${name}(${parametersTypes ?? ''}): Promise<${returnType}> {
                return this.$storage.get('${name}', ${parametersCall ?? ''});
            }
        `;
    }
    getParameters(type) {
        if (type.startsWith('mapping')) {
            let valueType = _abiType_1.$abiType.mapping.getValueType(type);
            let keyType = _abiType_1.$abiType.mapping.getKeyType(type);
            let keyTsType = _abiType_1.$abiType.getTsTypeFromDefinition(keyType);
            let valueTsType = _abiType_1.$abiType.getTsTypeFromDefinition(valueType);
            return {
                parametersTypes: `key: ${keyTsType}`,
                returnType: `${valueTsType}`,
                parametersCall: 'key',
            };
        }
        return {
            returnType: _abiType_1.$abiType.getTsTypeFromDefinition(type)
        };
    }
}
exports.GeneratorStorageReader = GeneratorStorageReader;
