import { keccak256 } from 'web3-utils';


export namespace $ns {
    export function namehash(domain: string) {
        let labels = domain.toLowerCase().split('.');
        let node = '0x' + ''.padStart(64,'0');
        for(let i = labels.length - 1; i >= 0; i--) {
            let labelSha = keccak256(labels[i]).substring(2);

            node = keccak256(`${node}${labelSha}`);
        }
        return node;
    }
}
