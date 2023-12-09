
export type AbiType = 'function' | 'constructor' | 'event' | 'fallback' | 'receive';
export type StateMutabilityType = 'constant' |'pure' | 'view' | 'nonpayable' | 'payable';

export interface TAbiItem {
    anonymous?: boolean;
    constant?: boolean;
    inputs?: TAbiInput[];
    name?: string;
    outputs?: TAbiOutput[];
    payable?: boolean;
    stateMutability?: StateMutabilityType;
    type: AbiType;
    gas?: number;

    signature?: string
}

export interface TAbiInput {
    name: string;
    type: string;
    indexed?: boolean;
	components?: TAbiInput[];
    internalType?: string;
}

export interface TAbiOutput {
    name: string;
    type: string;
	components?: TAbiOutput[];
    internalType?: string;
}
