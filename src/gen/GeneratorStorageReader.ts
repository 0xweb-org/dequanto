import alot from 'alot'
import { Web3Client } from '@dequanto/clients/Web3Client'
import { TAddress } from '@dequanto/models/TAddress'
import { TPlatform } from '@dequanto/models/TPlatform'
import { ISlotVarDefinition, SlotsParser } from '@dequanto/solidity/SlotsParser'
import { $require } from '@dequanto/utils/$require'
import { File } from 'atma-io'
import { Str } from './utils/Str'
import { $abiType } from '@dequanto/utils/$abiType'
import { $path } from '@dequanto/utils/$path'
import { $gen } from './utils/$gen'

export class GeneratorStorageReader {

    async generate(opts: {
        network: TPlatform
        name: string
        contractName: string
        address: TAddress
        sources?: {
            [file: string]: { content: string }
        },
        client?: Web3Client
    }): Promise<{ code?: string, className?: string }> {


        let { client, sources, contractName, address } = opts;
        let files = alot.fromObject(sources ?? {}).map(x => {
            return {
                path: x.key,
                content: x.value.content
            };
        }).toArray();

        if (files.length === 0) {
            return {};
        }

        let file = null as (typeof files[0]);
        if (files.length === 1) {
            file = files[0];
        } else {
            let rgx = new RegExp(`contract \s*${contractName}`, 'i')
            let main = await alot(files.reverse()).findAsync(async x => {
                return rgx.test(x.content);
            });
            if (main == null) {
                main = files[0];
            }
            file = main;
        }

        $require.String(file?.content ?? file?.path, `Expected a source content to resolve slots`)

        let slots = await SlotsParser.slots({ code: file.content, path: file.path }, contractName, { files })

        let methods = this.serializeSlots(slots);
        let codeMethods = methods.join('\n\n');

        let templatePath = $path.resolve(`/src/gen/ContractStorageReaderTemplate.ts`);
        let template = await File.readAsync<string>(templatePath, { skipHooks: true });
        let className = $gen.toClassName(opts.name + 'StorageReader');
        let code = template
            .replace(`$NAME$`, className)
            .replace(`/* METHODS */`, codeMethods)
            .replace(`$SLOTS$`, JSON.stringify(slots, null, '    '))


        return {
            className: className,
            code: code
        };
    }

    private serializeSlots (slots: ISlotVarDefinition[]) {
        return slots
            .map(slot => this.serializeSlot(slot))
            .map(Str.formatMethod);
    }

    private serializeSlot (slot: ISlotVarDefinition) {
        let name = slot.name;
        let type = slot.type;
        let { parametersTypes, parametersCall, returnType } = this.getParameters(type);

        return `
            async ${name}(${parametersTypes ?? ''}): Promise<${returnType}> {
                return this.$storage.get(['${name}', ${ parametersCall ?? '' }]);
            }
        `;
    }

    private getParameters (type: string): { parametersTypes?, parametersCall?, returnType } {
        if (type.startsWith('mapping')) {
            let valueType = $abiType.mapping.getValueType(type);
            let keyType = $abiType.mapping.getKeyType(type);

            let keyTsType = $abiType.getTsTypeFromDefinition(keyType);
            let valueTsType = $abiType.getTsTypeFromDefinition(valueType);
            return {
                parametersTypes: `key: ${keyTsType}`,
                returnType: `${valueTsType}`,
                parametersCall: 'key',
            }
        }

        return {
            returnType: $abiType.getTsTypeFromDefinition(type)
        };
    }
}

