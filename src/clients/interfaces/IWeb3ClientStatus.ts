export interface IWeb3ClientStatus {
    i: number
    url: string

    status: 'error' | 'live' | 'offline'

    blockNumber: number

    blockNumberBehind: number

    syncing: {
        currentBlock: number
        highestBlock: number
        knownStates: number
        startingBlock: number
    }

    peers: number

    error?: Error

    pingMs: number
}
