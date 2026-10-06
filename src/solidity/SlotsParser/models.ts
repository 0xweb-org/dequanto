import { TEth } from 'dequanto/models/TEth'
import type { SourceFile } from './SourceFile'

export type TSourceFileImport = {
    error?: string
    path: string
    file: SourceFile
}


export interface ISlotVarDefinition {
    slot: bigint
    position: number
    name: string
    type: string
    size: number

    // constants and immutable
    memory?: 'storage' | 'constant' | 'immutable'
    value?: string | number | bigint
}


/** Slot definitions accepted from callers, including older generated readers. */
export type ISlotVarDefinitionInput = Omit<ISlotVarDefinition, 'slot'> & { slot: number | bigint |  TEth.Hex | string };

export interface ISlotsParserOption {
    /* Optionally provide additional sources in memory */
    files?: { path: string, content: string }[]

    // Slots array will contain constant state variables if any
    withConstants?: boolean

    // Slots array will contain immutable state variables if any
    withImmutables?: boolean
}
