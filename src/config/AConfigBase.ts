import { IConfigData } from './interface/IConfigData'


type TConfigParamsBase = {
    config?: Partial<IConfigData>
}

export type TConfigParamsNode = TConfigParamsBase & {
    dotenv?: boolean
    pin?: string
    configAccounts?: string
    configGlobal?: string
    isLocal?: boolean
}

export type TConfigParamsBrowser = TConfigParamsBase & {

}
export type TConfigParams = TConfigParamsNode | TConfigParamsBrowser;

export interface IProviderEndpoint {
    url: string
    private?: boolean
    safe?: boolean

    // Is not used in general ClientPool, only retrievable via getWeb3 method.
    manual?: boolean

    traceable?: boolean
}

export interface IConfigProvider {

    fetch (parameters?: TConfigParamsBase): Promise<IConfigData>;
    extend (json?: Partial<IConfigData>): Promise<void>;
}
