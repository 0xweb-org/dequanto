import { TAddress } from '@dequanto/models/TAddress'

export interface IErc4337Info {
    addresses: {
        entryPoint: TAddress
        accountFactory: TAddress
        accountImplementation: TAddress
    }
}
