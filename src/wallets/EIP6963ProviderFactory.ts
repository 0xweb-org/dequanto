import { TAddress } from '@dequanto/models/TAddress';
import { TEth } from '@dequanto/models/TEth';
import { IEip1193Provider } from '@dequanto/rpc/transports/compatibility/EIP1193Transport';
import { $ref } from '@dequanto/utils/$ref';
import { $require } from '@dequanto/utils/$require';
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
}

// Type representing the event structure for announcing a provider based on EIP-6963.
type EIP6963AnnounceProviderEvent = {
    detail: EIP6963ProviderDetail
}


interface IProviderEvents {
    onProviderRegistered: (detail: EIP6963ProviderDetail) => void;

    onAccountConnected: (account: TAddress) => void;
    onAccountDisconnected: () => void;

    onChainChanged: (chainId: number) => void;
}


export class EIP6963ProviderFactory extends class_EventEmitter<IProviderEvents> {

    providers: EIP6963ProviderDetail[] = []
    selected: EIP6963ProviderDetail;
    account: TAddress;

    global = $ref.getGlobal()

    constructor () {
        super();

        this.onAnnounceProvider = this.onAnnounceProvider.bind(this);
        this.requestProvider();
        this.listenToNewProvider();
    }

    isConnected () {
        return this.account != null;
    }

    async connect (uuid?: string) {
        let arr = this.providers;
        uuid ??= arr[0]?.info.uuid;

        let providersInfoText = arr.map(x => `${x.info.name}(#${x.info.uuid})`).join(';');
        let provider = arr.find(x => x.info.uuid === uuid);
        $require.notNull(provider, `Wallet Provider not found ${uuid}. Available:  ${ providersInfoText }`);
        this.selected = provider;

        let account = await this.requestAccount();
        this.account = account;
        this.emit('onAccountConnected', account);
        return account;
    }

    disconnect () {
        this.selected = null;
        this.account = null;
        this.emit('onAccountDisconnected');
    }

    getProviders () {
        return this.providers;
    }

    async requestAccount (): Promise<TEth.Address> {
        $require.notNull(this.selected, `Wallet is not connected`);

        const accounts = await this.selected.provider.request({ method: 'eth_requestAccounts' });
        this.account = accounts?.[0];
        if (this.account) {
            this.emit('onAccountConnected', this.account)
        }
        return this.account;
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
        this.providers.push({ info, provider });

        this.emit('onProviderRegistered', detail);
        try {
            const accounts = await provider.request({ method: 'eth_accounts' })
            this.account = accounts?.[0];
            if (this.account) {
                this.emit('onAccountConnected', this.account)
            }
        } catch (error) { }
    }


}
