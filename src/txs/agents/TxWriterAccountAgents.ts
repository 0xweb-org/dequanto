import type { ChainAccount, TAccount } from '@dequanto/models/TAccount';
import type { TxWriter } from '../TxWriter';
import { SafeAgent } from './SafeAgent';
import { Erc4337Agent } from './Erc4337Agent';



export interface ITxWriterAccountAgent {
    supports (account: TAccount): boolean
    process (sender: ChainAccount, account: TAccount, outerWriter: TxWriter): Promise<TxWriter>
}

export namespace TxWriterAccountAgents {

    const agents: ITxWriterAccountAgent[] = [
        new SafeAgent(),
        new Erc4337Agent(),
    ];

    export function register (agent: ITxWriterAccountAgent) {
        agents.push(agent);
    }

    export function get (account: TAccount) {
        return agents.find(agent => agent.supports(account));
    }
}
