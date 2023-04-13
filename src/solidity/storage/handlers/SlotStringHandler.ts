import alot from 'alot';
import { AbiDeserializer } from '@dequanto/contracts/utils/AbiDeserializer';
import { $abiParser } from '@dequanto/utils/$abiParser';
import { $buffer } from '@dequanto/utils/$buffer';
import { $require } from '@dequanto/utils/$require';
import { SlotsStorageTransportForArray } from '../SlotsStorageTransport';
import { ASlotsStorageHandler } from '../SlotsStorageHandler';
import { IAccessorItem } from '../Accessor';
import { $contract } from '@dequanto/utils/$contract';
import { $abiUtils } from '@dequanto/utils/$abiUtils';
import { $bigint } from '@dequanto/utils/$bigint';
import { $hex } from '@dequanto/utils/$hex';
import { ISlotVarDefinition } from '@dequanto/solidity/SlotsParser/models';
import { SlotBytesHandler } from './SlotBytesHandler';

export class SlotStringHandler extends SlotBytesHandler {

    static supports (slot: ISlotVarDefinition) {
        return slot.type === 'string';
    }

    async get (keys?: IAccessorItem[]){

        let value = await super.get(keys);
        let abi = $abiParser.parseArguments(this.slot.type);
        let deserialized = AbiDeserializer.process(value, abi);
        return deserialized;
    }

    async set(keys: IAccessorItem[], value: string) {
        let hex = $hex.toHexBuffer(value);
        await super.set(keys, hex);
    }
}

