import type { EoAccount, TAccount } from '@dequanto/models/TAccount';
import type { ITxWriterEmitter, TxWriter } from '../TxWriter';
import { SafeAgent } from './SafeAgent';
import { Erc4337Agent } from './Erc4337Agent';
import { TimelockAgent } from './TimelockAgent';


export interface ITxWriterAgent {
    process (sender: EoAccount, account: TAccount, outerWriter: TxWriter): Promise<ITxWriterEmitter>
}

export interface ITxWriterAccountAgent extends ITxWriterAgent{
    supports (account: TAccount): boolean
}

export namespace TxWriterAccountAgents {

    const agents: ITxWriterAccountAgent[] = [
        new SafeAgent(),
        new Erc4337Agent(),
        new TimelockAgent(),
    ];

    export function register (agent: ITxWriterAccountAgent) {
        agents.push(agent);
    }

    export function get (account: TAccount) {
        return agents.find(agent => agent.supports(account));
    }
}
