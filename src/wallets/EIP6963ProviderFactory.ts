import { TAddress } from '@dequanto/models/TAddress';
import { TEth } from '@dequanto/models/TEth';
import { IEip1193Provider } from '@dequanto/rpc/transports/compatibility/EIP1193Transport';
import { $address } from '@dequanto/utils/$address';
import { $ref } from '@dequanto/utils/$ref';
import { $require } from '@dequanto/utils/$require';
import alot from 'alot';
import { class_EventEmitter } from 'atma-utils';

// Interface for provider information following EIP-6963.
interface EIP6963ProviderInfo {
    walletId?: string; // Unique identifier for the wallet e.g io.metamask, io.metamask.flask
    uuid: string; // Globally unique ID to differentiate between provider sessions for the lifetime of the page
    name: string; // Human-readable name of the wallet
    icon?: string; // URL to the wallet's icon
}

// Interface for Ethereum providers based on the EIP-1193 standard.
interface EIP1193Provider {
    isStatus?: boolean; // Optional: Indicates the status of the provider
    host?: string; // Optional: Host URL of the Ethereum node
    path?: string; // Optional: Path to a specific endpoint or service on the host
    request: (request: { method: string, params?: Array<unknown> }) => Promise<unknown>; // Standard method for sending requests per EIP-1193
}

// Interface detailing the structure of provider information and its Ethereum provider.
export interface EIP6963ProviderDetail {
    info: EIP6963ProviderInfo; // The provider's info
    provider: IEip1193Provider; // The EIP-1193 compatible provider
    accounts?: TEth.Address[]; // Optional: Array of connected Ethereum accounts
}

// Type representing the event structure for announcing a provider based on EIP-6963.
type EIP6963AnnounceProviderEvent = {
    detail: EIP6963ProviderDetail
}


interface IProviderEvents {
    onProviderRegistered: (detail: EIP6963ProviderDetail) => void;

    onAccountsConnected: (accounts: TAddress[]) => void;
    onAccountsDisconnected: () => void;

    onChainChanged: (chainId: number) => void;
}


export class EIP6963ProviderFactory extends class_EventEmitter<IProviderEvents> {

    providers: EIP6963ProviderDetail[] = []
    selected: EIP6963ProviderDetail;

    global = $ref.getGlobal()

    constructor () {
        super();

        this.onAnnounceProvider = this.onAnnounceProvider.bind(this);
        this.requestProvider();
        this.listenToNewProvider();
    }

    isConnected (address?: TEth.Address) {
        let has = this.providers.some(x => {
            return address != null
                ? x.accounts?.some(account => $address.eq(account, address) )
                : x.accounts?.length > 0;
        });
        return has;
    }

    async connect (uuid?: string) {
        let provider = this.getProviderOrFirst(uuid);
        $require.notNull(provider, `Wallet not found`);
        this.selected = provider;
        let accounts = await this.requestAccounts();
        return accounts;
    }

    disconnect () {
        this.selected = null;
        this.emit('onAccountsDisconnected');
    }

    getProviders () {
        return this.providers;
    }

    async requestAccounts (uuid?: string): Promise<TEth.Address[]> {
        let provider = await this.getProvider(uuid);
        let accounts: TEth.Address[] = await this.selected.provider.request({ method: 'eth_requestAccounts' });
        if (accounts?.length > 0) {
            let arr = [
                ...(provider.accounts ?? []),
                ...(accounts),
            ];
            provider.accounts = alot(arr).distinct().toArray();
            this.emit('onAccountsConnected', provider.accounts);
        }
        return provider.accounts;
    }

    private requestProvider () {
        if (typeof this.global.ethereum?.request === 'function') {
            this.onAnnounceProvider({
                detail: {
                    info: {
                        uuid: 'injected',
                        name: 'injected'
                    },
                    provider: this.global.ethereum,
                }
            });
        }
        this.global.dispatchEvent(new CustomEvent('eip6963:requestProvider'));

    }
    private listenToNewProvider () {
        this.global.addEventListener('eip6963:announceProvider',  this.onAnnounceProvider as any);
    }

    private async onAnnounceProvider (event: EIP6963AnnounceProviderEvent) {
        // Remove directly injected provider
        this.providers = this.providers.filter(x => x.info.uuid === 'injected');

        let { detail } = event;
        let { info, provider } = detail;
        if (this.providers.some(x => x.info.uuid === info?.uuid)) {
            return;
        }

        let providerDetails = { info, provider, accounts: [] };
        this.providers.push(providerDetails);

        this.emit('onProviderRegistered', detail);
        try {
            const accounts = await provider.request({ method: 'eth_accounts' })
            if (accounts?.length > 0) {
                providerDetails.accounts = accounts;
                this.emit('onAccountsConnected', accounts);
            }
        } catch (error) { }
    }

    getProviderOrFirst (uuid?: string) {
        if (uuid == null) {
            return this.providers[0];
        }
        let provider = this.providers.find(x => x.info?.uuid === uuid);
        return provider;
    }
    getProvider (uuid?: string, optional?: boolean) {
        if (uuid == null) {
            optional !== true && $require.notNull(this.selected, `Wallet is not connected`);
            return this.selected;
        }
        let provider = this.providers.find(x => x.info?.uuid === uuid);
        optional !== true && $require.notNull(provider, `Wallet is not found by UUID ${uuid}`);
        return provider;
    }
}
