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
}


export interface ISlotsParserOption {
    /* Optionally provide additional sources in memory */
    files?: { path: string, content: string }[]
}
