export interface IEIP6963Provider {
    isStatus?: boolean;

    request: (request: { method: string, params?: Array<any> }) => Promise<any>;

    on(event: 'accountsChanged', handler: (accounts: Array<string>) => void)
    on(event: 'chainChanged', handler: (chainId: string) => void)
    on(event: 'connect', handler: (connectInfo: ConnectInfo) => void)
    on(event: 'disconnect', handler: (error: ProviderRpcError) => void)

    removeListener(event: 'accountsChanged' | 'chainChanged' | 'connect' | 'disconnect', handler: (...args) => void)
}


interface ConnectInfo {
    chainId: string;
}
interface ProviderRpcError extends Error {
    message: string
    code: number
    data?: unknown
}
