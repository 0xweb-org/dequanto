import alot from 'alot';
import { TAddress } from '@dequanto/models/TAddress';
import { TEth } from '@dequanto/models/TEth';
import { $address } from '@dequanto/utils/$address';
import { $ref, TGlobal } from '@dequanto/utils/$ref';
import { $require } from '@dequanto/utils/$require';
import { class_EventEmitter } from 'atma-utils';
import { IEIP6963Provider } from '@dequanto/rpc/transports/compatibility/IEIP6963Provider';

// Interface for provider information following EIP-6963.
interface EIP6963ProviderInfo {
    rdns?: string; // Unique identifier for the wallet e.g io.metamask, io.metamask.flask
    uuid: string; // Globally unique ID to differentiate between provider sessions for the lifetime of the page
    name: string; // Human-readable name of the wallet
    icon?: string; // URL to the wallet's icon
    chainId?: number;
}

// Interface for Ethereum providers based on the EIP-1193 standard.

// Interface detailing the structure of provider information and its Ethereum provider.
export interface EIP6963ProviderDetail {
    info: EIP6963ProviderInfo; // The provider's info
    provider: IEIP6963Provider; // The EIP-1193 compatible provider
    accounts?: TEth.Address[]; // Optional: Array of connected Ethereum accounts
}

// Type representing the event structure for announcing a provider based on EIP-6963.
type EIP6963AnnounceProviderEvent = {
    detail: EIP6963ProviderDetail
}


interface IProviderEvents {
    onProviderRegistered: (detail: EIP6963ProviderDetail) => void;
    onProviderConnected: (detail: EIP6963ProviderDetail, chainId: number) => void;

    onAccountsConnected: (detail: EIP6963ProviderDetail, accounts: TAddress[]) => void;
    onAccountsDisconnected: (detail: EIP6963ProviderDetail) => void;


    onChainChanged: (detail: EIP6963ProviderDetail, chainId: number) => void;
    onAccountsChanged: (detail: EIP6963ProviderDetail, accounts: TEth.Address[]) => void;
}


export class EIP6963ProviderFactory extends class_EventEmitter<IProviderEvents> {

    private listeners = {} as Record<string, {
        accountsChanged,
        chainChanged,
        connect,
        disconnect
    }>

    providers: EIP6963ProviderDetail[] = []
    selected: EIP6963ProviderDetail;

    global: TGlobal = $ref.getGlobal()

    constructor () {
        super();

        this.onAnnounceProvider = this.onAnnounceProvider.bind(this);
        this.listenToNewProvider();
        this.requestProvider();
    }

    isConnected (address?: TEth.Address) {
        let has = this.providers.some(x => {
            return address != null
                ? x.accounts?.some(account => $address.eq(account, address) )
                : x.accounts?.length > 0;
        });
        return has;
    }

    async connect (id?: string) {
        let provider = this.getProviderOrFirst(id);
        $require.notNull(provider, `Wallet not found`);
        this.selected = provider;
        let accounts = await this.requestAccounts();
        return accounts;
    }

    disconnect () {
        let selected = this.selected;
        this.selected = null;
        this.emit('onAccountsDisconnected', selected);
    }

    useProvider (id: string) {
        this.selected = this.getProvider(id);
    }

    getProviders () {
        return this.providers;
    }

    async requestAccounts (id?: string): Promise<TEth.Address[]> {
        let provider = await this.getProvider(id);
        let accounts: TEth.Address[] = await this.selected.provider.request({ method: 'eth_requestAccounts' });
        if (accounts?.length > 0) {
            let arr = [
                ...(provider.accounts ?? []),
                ...(accounts),
            ]
            .filter(Boolean)
            .map(String) as TEth.Address[];

            provider.accounts = alot(arr).distinct().toArray();
            this.emit('onAccountsConnected', provider, provider.accounts);
        }
        return provider.accounts;
    }

    private requestProvider () {
        if (typeof this.global.ethereum?.request === 'function') {
            this.onAnnounceProvider({
                detail: {
                    info: {
                        rdns: 'injected',
                        uuid: 'injected',
                        name: 'Browser Wallet'
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
        let injectedProvider = this.providers.find(x => x.info?.rdns === 'injected');
        if (injectedProvider) {
            // Remove directly injected provider
            this.providers = this.providers.filter(x => x.info?.rdns !== 'injected');
            this.removeEventListeners(injectedProvider);
        }

        let { detail } = event;
        let { info, provider } = detail;
        if (this.providers.some(x => this.getId(x.info) === this.getId(info))) {
            return;
        }

        let providerDetails = { info, provider, accounts: [] };
        this.providers.push(providerDetails);
        this.addEventListeners(providerDetails);

        try {
            const accounts = await provider.request({ method: 'eth_accounts' })
            if (accounts?.length > 0) {
                providerDetails.accounts = accounts;
                this.emit('onAccountsConnected', providerDetails, accounts);
            }
        } catch (error) {
            // We load the accounts just in case if user has already connected previously, otherwise silently ignore the error
        }
        try {
            const chainId = await provider.request({ method: 'eth_chainId' })
            providerDetails.info.chainId = Number(chainId);
        } catch (error) {
            // silently ignore the error
        }

        this.emit('onProviderRegistered', providerDetails);
    }

    getProviderOrFirst (id?: string) {
        if (id == null) {
            return this.providers[0];
        }
        let provider = this.providers.find(x => this.getId(x.info) === id);
        return provider;
    }
    getProvider (id?: string, optional?: boolean) {
        if (id == null) {
            optional !== true && $require.notNull(this.selected, `Wallet is not connected`);
            return this.selected;
        }
        let provider = this.providers.find(x => this.getId(x.info) === id);
        optional !== true && $require.notNull(provider, `Wallet is not found by ID ${id}`);
        return provider;
    }

    private getId (info: EIP6963ProviderInfo | null) {
        return info?.rdns ?? info?.name;
    }

    private addEventListeners (providerDetails: EIP6963ProviderDetail) {
        let id = this.getId(providerDetails.info);
        if (id in this.listeners) {
            return;
        }
        const fns = {
            accountsChanged: accounts => {
                providerDetails.accounts = accounts;
                this.emit('onAccountsChanged', providerDetails, accounts as TEth.Address[]);
            },
            chainChanged: chainId => {
                this.emit('onChainChanged', providerDetails, Number(chainId));
            },
            disconnect: () => {
                this.emit('onAccountsDisconnected', providerDetails);
            },
            connect: (info) => {
                this.emit('onProviderConnected', providerDetails, info.chainId);
            },
        }
        let boundFnKey: 'on' | 'addEventListener';
        let provider = providerDetails.provider;

        if (typeof provider.on === 'function') {
            boundFnKey = 'on';
        } else if (typeof (provider as any).addEventListener === 'function') {
            boundFnKey = 'addEventListener';
        }
        if (boundFnKey == null) {
            return;
        }
        for (let event in fns) {
            provider[boundFnKey](event, fns[event]);
        }
        this.listeners[id] = fns;
    }

    private removeEventListeners (providerDetails: EIP6963ProviderDetail) {
        let id = this.getId(providerDetails.info);
        if (id in this.listeners === false) {
            return;
        }

        let unboundFnKey: 'removeListener' | 'removeEventListener';
        let provider = providerDetails.provider;
        if (typeof provider.removeListener === 'function') {
            unboundFnKey = 'removeListener';
        } else if (typeof (provider as any).removeEventListener === 'function') {
            unboundFnKey = 'removeEventListener';
        }

        let fns = this.listeners[id];
        for (let event in fns) {
            provider[unboundFnKey](event as any, fns[event]);
        }
        delete this.listeners[id];
    }
}
