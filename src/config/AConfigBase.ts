import { IRpcConfig } from '@dequanto/clients/ClientPool'
import { IConfigData } from './interface/IConfigData'
import { TPlatform } from '@dequanto/models/TPlatform'
import { TEth } from '@dequanto/models/TEth'

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


export interface IConfigProvider {

    fetch (parameters?: TConfigParamsBase): Promise<IConfigData>;
    extend (json?: Partial<IConfigData>): Promise<void>;
}
