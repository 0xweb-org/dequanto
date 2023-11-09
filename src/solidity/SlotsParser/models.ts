import type { SourceFile } from './SourceFile'

export type TSourceFileImport = {
    error?: string
    path: string
    file: SourceFile
}


export interface ISlotVarDefinition {
    slot: number
    position: number
    name: string
    type: string
    size: number

    // constants and immutable
    memory?: 'storage' | 'constant' | 'immutable'
    value?: string | number | bigint
}


export interface ISlotsParserOption {
    /* Optionally provide additional sources in memory */
    files?: { path: string, content: string }[]

    // Slots array will contain constant state variables if any
    withConstants?: boolean

    // Slots array will contain immutable state variables if any
    withImmutables?: boolean
}
