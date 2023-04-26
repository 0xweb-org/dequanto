export interface IWeb3ClientStatus {
    i: number
    url: string
    status: 'error' | 'sync' | 'live' | 'offline'
    blockNumber: number
    blockNumberBehind: number
    syncing: {
        currentBlock: number
        highestBlock: number
        knownStates: number
        startingBlock: number
        stages?: {
            stage_name: string
            block_number: string | number
        }[]
    }
    peers: number
    pingMs: number
    node: string
    error?: Error
}
