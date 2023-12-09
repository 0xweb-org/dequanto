import { EthWeb3Client } from '@dequanto/clients/EthWeb3Client';
import { EvmWeb3Client } from '@dequanto/clients/EvmWeb3Client';
import { $date } from '@dequanto/utils/$date';
import { $http } from '@dequanto/utils/$http';
import { $logger } from '@dequanto/utils/$logger';
import { $promise } from '@dequanto/utils/$promise';
import alot from 'alot';
import { File } from 'atma-io';
import { UAction } from 'atma-utest';

UAction.create({
    async 'update chains' () {
        let { data: chains } = await $http.get<{
            chainId: number
            shortName: string
            rpc: string[]
            nativeCurrency: {
                name: string
                symbol: string
                decimals: number
            }
        }[]>('https://chainid.network/chains.json');

        // Skip with Keys
        chains.forEach(chain => {
            chain.rpc = chain.rpc.filter(x => x.includes('${') === false)
        });


        let arr = chains.map(chain => {
            return {
                platform: chain.shortName,
                chainId: chain.chainId,
                chainToken: chain.nativeCurrency.symbol,
                endpoints: chain.rpc.map(url => ({ url })),
            };
        });

        arr = arr.filter(x => x.endpoints.length > 0);

        let clients = alot(arr).map(chain => {
            let client = new EvmWeb3Client({
                platform: chain.platform,
                chainId: chain.chainId,
                endpoints: chain.endpoints
            });
            return client;
        })
        .toArray();

        let liveUrls = await new EndpointChecker(clients).live();

        arr.forEach(chain => {
            chain.endpoints = chain.endpoints.filter(endpoint => liveUrls.includes(endpoint.url));
        });

        let arrWithLiveNodes = arr.filter(x => x.endpoints.length > 0);
        if (arrWithLiveNodes.length !== arr.length) {
            $logger.log(`Skipped ${arr.length - arrWithLiveNodes.length} chains because they are not reachable`);
        }

        await File.writeAsync('./data/chains/chains.json', arrWithLiveNodes);
    }
})

class EndpointChecker {
    constructor (public clients: EvmWeb3Client[]) {

    }

    async live () {
        return await alot(this.clients)
            .mapManyAsync((client, i) => {
                return this.ping(client, i, this.clients.length);
            })
            .toArrayAsync();
    }
    private async ping (client: EvmWeb3Client, clientIdx, clientsTotal) {
        try {
            let infos = await client.getNodeInfos({
                timeout: 1000,
                calls: [ 'eth_blockNumber' ]
            });
            let block = alot(infos).max(x => x.blockNumber);
            let nodesStatuses = await alot(infos)
                .mapAsync(async info => {
                    let diff = block - info.blockNumber;
                    let ok = info.status === 'live' && diff < 5 && info.pingMs < 1000;

                    if (ok) {
                        let wClient = await client.getRpc({ node: { url: info.url } });
                        let { error, result: blockData } = await $promise.caught(
                            $promise.timeout(wClient.eth_getBlockByNumber(block, false), 1000)
                        );
                        if (error != null) {
                            ok = false;
                            info.error = error;
                        } else if (blockData.timestamp) {
                            let ageMs = Date.now() - blockData.timestamp * 1000;
                            if (isNaN(ageMs) || ageMs > $date.parseTimespan('10min')) {
                                ok = false;
                                info.error = new Error(`Block AGE: ${$date.formatTimespan(ageMs)}`);
                            }
                        }
                    }

                    let message = `${ok ? '✅' : '⛔'} yellow<${info.pingMs}>ms cyan<${diff}> yellow<${ ok ? '' : info.status }> gray<${info.url}> ${info.error ? info.error.message.substring(0, 50) : ''}`
                    return {
                        message,
                        ok,
                        url: info.url,
                    };
                })
                .toArrayAsync();

            let totalCount = nodesStatuses.length;
            let okCount = nodesStatuses.filter(x => x.ok).length;
            let message = `${client.platform}(gray<${client.chainId}>) ${okCount}/${totalCount} | Progress: ${clientIdx}/${clientsTotal}`;
            message = okCount > 0? `✅ green<${message}>` : `⛔ red<${message}>`;

            $logger.log(message);
            nodesStatuses.forEach(x => {
                $logger.log('        ', x.message);
            });


            return nodesStatuses
                .filter(x => x.ok)
                .map(x => x.url);
        } catch (error) {
            console.error(`${client.chainId} network failed:`, error.message);
            return [];
        }

    }
}
