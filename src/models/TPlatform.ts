// https://github.com/ethereum-lists/chains
// https://chainid.network/chains.json
// https://github.com/DefiLlama/chainlist/blob/main/constants/extraRpcs.js
// https://api.llama.fi/chains

// https://eips.ethereum.org/EIPS/eip-3770
export type TPlatform = 'eth'
    | 'eth:goerli'
    | 'bsc'
    | 'polygon'
    | 'arbitrum'
    | 'xdai'
    | 'boba'
    | 'hardhat'
    | 'optimism'
    | 'avalanche'
    | `hh:${string}`
    | string;
