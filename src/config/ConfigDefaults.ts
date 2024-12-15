import { IConfigData } from './interface/IConfigData';
export const ConfigDefaults = <IConfigData> {
    "accounts": null,
    "settings": {
        "generate": {
            "target": "ts"
        }
    },
    "tokens": null,
    "blockchainExplorer": {
        "bsc": {
            "key": "MB1EM53BDJFKDIHUZ5JJT946BJJUQIHFP2",
            "host": "https://api.bscscan.com",
            "www": "https://bscscan.com"
        },
        "eth": {
            "key": "FGCTXVXMZAPPW91KCZ91AMZFGBY1GZZB51",
            "host": "https://api.etherscan.io",
            "www": "https://etherscan.io"
        },
        "eth:goerli": {
            "key": "FGCTXVXMZAPPW91KCZ91AMZFGBY1GZZB51",
            "host": "https://api-goerli.etherscan.io",
            "www": "https://goerli.etherscan.io"
        },
        "eth:sepolia": {
            "key": "FGCTXVXMZAPPW91KCZ91AMZFGBY1GZZB51",
            "host": "https://api-sepolia.etherscan.io",
            "www": "https://sepolia.etherscan.io"
        },
        "polygon": {
            "key": "AQHXXI3KIU5FC8Y1WXX8A346PENKUX7BCE",
            "host": "https://api.polygonscan.com",
            "www": "https://polygonscan.com"
        },
        "polygon:mumbai": {
            "key": "AQHXXI3KIU5FC8Y1WXX8A346PENKUX7BCE",
            "host": "https://api-testnet.polygonscan.com",
            "www": "https://mumbai.polygonscan.com"
        },
        "xdai": {
            "key": "123",
            "host": "https://blockscout.com/xdai/mainnet",
            "www": "https://blockscout.com/xdai/mainnet"
        },
        "gnosis": {
            "key": "V6ENPXHS2E74MCBUXWG8WGYTA3ZPYN2WT3",
            "host": "https://api.gnosisscan.io/",
            "www": "https://gnosisscan.io"
        },
        "celo": {
            "key": "3A9ZR89MEUQ51YC3SI1VAYAATFW419EEYR",
            "host": "https://api.celoscan.io",
            "www": "https://celoscan.io"
        },
        "heco": {
            "key": "123",
            "host": "https://api.hecoinfo.com",
            "www": "https://www.hecoinfo.com"
        },
        "optimism": {
            "key": "8SG776V5FEBDJMHTMETG3PT6KT1921X6AS",
            "host": "https://api-optimistic.etherscan.io",
            "www": "https://optimistic.etherscan.io"
        },
        "avalanche": {
            "key": "TMEXUDTD37PNTAIDJACPHQTP5BB42XD8Q3",
            "host": "https://api.snowtrace.io",
            "www": "https://snowtrace.io"
        },
        "cronos": {
            "key": "V5A6VRJ5TR9KIQEI7HIHVGK5C9NYCQS36E",
            "host": "https://api.cronoscan.com",
            "www": "https://cronoscan.com"
        },
        "fantom": {
            "key": "9PFA8WNHPCRAZS2GEJXPNN83SZS84JWGG7",
            "host": "https://api.ftmscan.com",
            "www": "https://ftmscan.com"
        },
        "aurora": {
            "key": "123",
            "host": "https://explorer.aurora.dev",
            "www": "https://explorer.aurora.dev"
        },
        "arbitrum": {
            "key": "SD1353XFNU8QYTP4KDK58AHMZBQCE79Q1J",
            "host": "https://api.arbiscan.io",
            "www": "https://arbiscan.io"
        },
        "metis": {
            "key": "123",
            "host": "https://andromeda-explorer.metis.io/api",
            "www": "https://andromeda-explorer.metis.io"
        },
        "base": {
            "key": "GS1M3QWY41Z36RTV56MV3N1BRKCJ9GWI3C",
            "host": "https://api.basescan.org",
            "www": "https://basescan.org"
        },
        "base:test": {
            "key": "GS1M3QWY41Z36RTV56MV3N1BRKCJ9GWI3C",
            "host": "https://api-goerli.basescan.org",
            "www": "https://goerli.basescan.org"
        },
        "hardhat": {
            "api": null
        }
    },
    "web3": {
        "eth": {
            "chainId": 1,
            "chainToken": "ETH",
            "endpoints": [
                {
                    "url": "https://eth.public-rpc.com"
                },
                {
                    "url": "https://main-light.eth.linkpool.io",
                    "rateLimit": "2000/5m"
                },
                {
                    "url": "wss://main-light.eth.linkpool.io/ws",
                    "rateLimit": "2000/5m"
                }
            ]
        },
        "eth:goerli": {
            "chainId": 5,
            "chainToken": "ETH",
            "endpoints": [
                {
                    "url": "https://goerli.infura.io/v3/a83f91c556054576a4c608ad4312720b"
                },
                {
                    "url": "wss://goerli.infura.io/ws/v3/a83f91c556054576a4c608ad4312720b"
                }
            ]
        },
        "eth:sepolia": {
            "chainId": 11155111,
            "chainToken": "ETH",
            "endpoints": [
                {
                    "url": "https://1rpc.io/sepolia"
                },
                {
                    "url": "wss://ethereum-sepolia.publicnode.com"
                }
            ]
        },
        "polygon": {
            "chainId": 137,
            "chainToken": "POL",
            "endpoints": [
                {
                    "url": "https://polygon-rpc.com"
                }
            ]
        },
        "polygon:mumbai": {
            "chainId": 80001,
            "chainToken": "POL",
            "endpoints": [
                {
                    "url": "https://rpc-mumbai.maticvigil.com"
                }
            ]
        },
        "bsc": {
            "chainId": 56,
            "chainToken": "BNB",
            "endpoints": [
                {
                    "url": "https://bscrpc.com"
                },
                {
                    "url": "https://bsc-dataseed.binance.org/"
                },
                {
                    "url": "https://bsc-dataseed1.defibit.io/"
                },
                {
                    "url": "wss://bsc-ws-node.nariox.org:443"
                }
            ]
        },
        "xdai": {
            "chainId": 100,
            "chainToken": "XDAI",
            "endpoints": [
                {
                    "url": "https://rpc.gnosischain.com/"
                },
                {
                    "url": "wss://rpc.gnosischain.com/wss"
                }
            ]
        },
        "gnosis": {
            "chainId": 100,
            "chainToken": "xDAI",
            "endpoints": [
                {
                    "url": "https://rpc.gnosischain.com/"
                },
                {
                    "url": "wss://rpc.gnosischain.com/wss"
                }
            ]
        },
        "arbitrum": {
            "chainId": 42161,
            "chainToken": "ETH",
            "endpoints": [
                {
                    "url": "https://arbitrum.public-rpc.com"
                }
            ]
        },
        "optimism": {
            "chainId": 10,
            "chainToken": "ETH",
            "endpoints": [
                {
                    "url": "https://mainnet.optimism.io"
                }
            ]
        },
        "avalanche": {
            "chainId": 43114,
            "chainToken": "AVAX",
            "endpoints": [
                {
                    "url": "https://avalanche-evm.publicnode.com"
                },
                {
                    "url": "https://api.avax.network/ext/bc/C/rpc"
                }
            ]
        },
        "cronos": {
            "chainId": 25,
            "chainToken": "CRO",
            "endpoints": [
                {
                    "url": "https://evm.cronos.org"
                }
            ]
        },
        "hardhat": {
            "endpoints": [
                {
                    "url": "http://127.0.0.1:8545/"
                }
            ]
        },
        "celo": {
            "chainId": 42220,
            "chainToken": "CELO",
            "endpoints": [
                {
                    "url": "https://forno.celo.org"
                },
                {
                    "url": "wss://forno.celo.org/ws"
                }
            ]
        },
        "heco": {
            "chainId": 128,
            "chainToken": "HT",
            "endpoints": [
                {
                    "url": "https://http-mainnet.hecochain.com"
                },
                {
                    "url": "wss://ws-mainnet.hecochain.com"
                }
            ]
        },
        "fantom": {
            "chainId": 250,
            "chainToken": "FTM",
            "endpoints": [
                {
                    "url": "https://rpc.fantom.network"
                },
                {
                    "url": "https://rpcapi.fantom.network"
                }
            ]
        },
        "aurora": {
            "chainId": 1313161554,
            "endpoints": [
                {
                    "url": "https://mainnet.aurora.dev"
                }
            ]
        },
        "metis": {
            "chainId": 1088,
            "chainToken": "METIS",
            "endpoints": [
                {
                    "url": "https://andromeda.metis.io/?owner=1088"
                }
            ]
        },
        "base": {
            "chainId": 8453,
            "chainToken": "ETH",
            "endpoints": [
                {
                    "url": "https://mainnet.base.org"
                },
                {
                    "url": "https://1rpc.io/base"
                }
            ]
        },
        "base:test": {
            "chainId": 84531,
            "chainToken": "ETH",
            "endpoints": [
                {
                    "url": "https://goerli.base.org"
                },
                {
                    "url": "https://base-goerli.public.blastapi.io"
                }
            ]
        }
    },
    "ns": {
        "ens": {
            "eth": {
                "registry": "0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e"
            }
        },
        "sid": {
            "bsc": {
                "registry": "0x08CEd32a7f3eeC915Ba84415e9C07a7286977956"
            },
            "bsc:test": {
                "registry": "0xfFB52185b56603e0fd71De9de4F6f902f05EEA23"
            }
        },
        "ud": {
            "eth": {
                "resolver": "0x049aba7510f45BA5b64ea9E658E342F904DB358D",
                "registry": "0x58034A288D2E56B661c9056A0C27273E5460B63c"
            },
            "polygon": {
                "resolver": "0xa9a6A3626993D487d2Dbda3173cf58cA1a9D9e9f",
                "registry": "0x423F2531bd5d3C3D4EF7C318c2D1d9BEDE67c680"
            }
        }
    },
    "oracles": {
        "coingecko": {
            "root": "https://api.coingecko.com/api/v3",
            "key": null
        }
    },
    "erc4337": [
        {
            "name": "default",
            "contracts": {
                "entryPoint": "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789",
                "accountFactory": "0x09c58cf6be8e25560d479bd52b4417d15bca2845"
            },
            "platforms": [
                "eth",
                "eth:goerli",
                "polygon",
                "polygon:mumbai"
            ]
        }
    ],
    "flashbots": {
        "eth": {
            "url": "https://relay.flashbots.net"
        },
        "eth:goerli": {
            "url": "https://relay-goerli.flashbots.net"
        },
        "eth:sepolia": {
            "url": "https://relay-sepolia.flashbots.net"
        }
    },
    "safe": {
        "transactionService": {
            "arbitrum": "https://safe-transaction-arbitrum.safe.global",
            "aurora": "https://safe-transaction-aurora.safe.global",
            "avalanche": "https://safe-transaction-avalanche.safe.global",
            "base": "https://safe-transaction-base.safe.global",
            "base:goerli": "https://safe-transaction-base-testnet.safe.global",
            "celo": "https://safe-transaction-celo.safe.global",
            "eth": "https://safe-transaction-mainnet.safe.global",
            "gnosis": "https://safe-transaction-gnosis-chain.safe.global",
            "eth:goerli": "https://safe-transaction-goerli.safe.global",
            "optimism": "https://safe-transaction-optimism.safe.global",
            "polygon": "https://safe-transaction-polygon.safe.global",
            "polygon:zkevm": "https://safe-transaction-zkevm.safe.global",
            "zksync": "https://safe-transaction-zksync.safe.global",
            "opbnb": "https://safe-transaction-opbnb-mainnet.bnbchain.org",
            "opbnb:test": "https://safe-transaction-opbnb-testnet.bnbchain.org",
            "bsc": "https://safe-transaction-bsc.safe.global"
        },
        "contracts": {
            "eth": {
                "Safe": "0x41675C099F32341bf84BFc5382aF534df5C7461a",
                "SafeL2": "0x29fcB43b46531BcA003ddC8FCB67FFE91900C762",
                "SafeProxyFactory": "0x4e1DCf7AD4e460CfD30791CCC4F9c8a4f820ec67",
                "MultiSend": "0x38869bf66a61cF6bDB996A6aE40D5853Fd43B526",
                "CreateCall": "0x9b35Af71d77eaf8d7e40252370304687390A1A52"
            },
            "eth:goerli": {
                "Safe": "0x41675C099F32341bf84BFc5382aF534df5C7461a",
                "SafeL2": "0x29fcB43b46531BcA003ddC8FCB67FFE91900C762",
                "SafeProxyFactory": "0x4e1DCf7AD4e460CfD30791CCC4F9c8a4f820ec67",
                "MultiSend": "0x38869bf66a61cF6bDB996A6aE40D5853Fd43B526",
                "CreateCall": "0x9b35Af71d77eaf8d7e40252370304687390A1A52"
            },
            "bsc": {
                "Safe": "0x41675C099F32341bf84BFc5382aF534df5C7461a",
                "SafeL2": "0x29fcB43b46531BcA003ddC8FCB67FFE91900C762",
                "SafeProxyFactory": "0x4e1DCf7AD4e460CfD30791CCC4F9c8a4f820ec67",
                "MultiSend": "0x38869bf66a61cF6bDB996A6aE40D5853Fd43B526",
                "CreateCall": "0x9b35Af71d77eaf8d7e40252370304687390A1A52"
            },
            "gnosis": {
                "Safe": "0x41675C099F32341bf84BFc5382aF534df5C7461a",
                "SafeL2": "0x29fcB43b46531BcA003ddC8FCB67FFE91900C762",
                "SafeProxyFactory": "0x4e1DCf7AD4e460CfD30791CCC4F9c8a4f820ec67",
                "MultiSend": "0x38869bf66a61cF6bDB996A6aE40D5853Fd43B526",
                "CreateCall": "0x9b35Af71d77eaf8d7e40252370304687390A1A52"
            },
            "polygon": {
                "Safe": "0x41675C099F32341bf84BFc5382aF534df5C7461a",
                "SafeL2": "0x29fcB43b46531BcA003ddC8FCB67FFE91900C762",
                "SafeProxyFactory": "0x4e1DCf7AD4e460CfD30791CCC4F9c8a4f820ec67",
                "MultiSend": "0x38869bf66a61cF6bDB996A6aE40D5853Fd43B526",
                "CreateCall": "0x9b35Af71d77eaf8d7e40252370304687390A1A52"
            },
            "polygon:zkevm": {
                "Safe": "0x41675C099F32341bf84BFc5382aF534df5C7461a",
                "SafeL2": "0x29fcB43b46531BcA003ddC8FCB67FFE91900C762",
                "SafeProxyFactory": "0x4e1DCf7AD4e460CfD30791CCC4F9c8a4f820ec67",
                "MultiSend": "0x38869bf66a61cF6bDB996A6aE40D5853Fd43B526",
                "CreateCall": "0x9b35Af71d77eaf8d7e40252370304687390A1A52"
            },
            "polygon:mumbai": {
                "Safe": "0x41675C099F32341bf84BFc5382aF534df5C7461a",
                "SafeL2": "0x29fcB43b46531BcA003ddC8FCB67FFE91900C762",
                "SafeProxyFactory": "0x4e1DCf7AD4e460CfD30791CCC4F9c8a4f820ec67",
                "MultiSend": "0x38869bf66a61cF6bDB996A6aE40D5853Fd43B526",
                "CreateCall": "0x9b35Af71d77eaf8d7e40252370304687390A1A52"
            },
            "torus:test": {
                "Safe": "0x41675C099F32341bf84BFc5382aF534df5C7461a",
                "SafeL2": "0x29fcB43b46531BcA003ddC8FCB67FFE91900C762",
                "SafeProxyFactory": "0x4e1DCf7AD4e460CfD30791CCC4F9c8a4f820ec67",
                "MultiSend": "0x38869bf66a61cF6bDB996A6aE40D5853Fd43B526",
                "CreateCall": "0x9b35Af71d77eaf8d7e40252370304687390A1A52"
            },
            "base:test": {
                "Safe": "0x41675C099F32341bf84BFc5382aF534df5C7461a",
                "SafeL2": "0x29fcB43b46531BcA003ddC8FCB67FFE91900C762",
                "SafeProxyFactory": "0x4e1DCf7AD4e460CfD30791CCC4F9c8a4f820ec67",
                "MultiSend": "0x38869bf66a61cF6bDB996A6aE40D5853Fd43B526",
                "CreateCall": "0x9b35Af71d77eaf8d7e40252370304687390A1A52"
            },
            "opbnb": {
                "Safe": null,
                "SafeL2": "0xE2CF742b554F466d5E7a37C371FD47C786d2FBc0",
                "SafeProxyFactory": "0x9fea7F7C69f14aa1a7d62cC9D468fEB2F9371CB3",
                "MultiSend": "0xDeB0467cCfAda493902C8D279A2F41f26b813AC9",
                "CreateCall": "0x392e2F66c3BBF0046c861e0065fB7C7917b18078"
            },
            "opbnb:test": {
                "Safe": null,
                "SafeL2": "0xE2CF742b554F466d5E7a37C371FD47C786d2FBc0",
                "SafeProxyFactory": "0x9fea7F7C69f14aa1a7d62cC9D468fEB2F9371CB3",
                "MultiSend": "0xDeB0467cCfAda493902C8D279A2F41f26b813AC9",
                "CreateCall": "0x392e2F66c3BBF0046c861e0065fB7C7917b18078"
            },
            "bsc:test": {
                "Safe": null,
                "SafeL2": "0xE2CF742b554F466d5E7a37C371FD47C786d2FBc0",
                "SafeProxyFactory": "0x9fea7F7C69f14aa1a7d62cC9D468fEB2F9371CB3",
                "MultiSend": "0xDeB0467cCfAda493902C8D279A2F41f26b813AC9",
                "CreateCall": "0x392e2F66c3BBF0046c861e0065fB7C7917b18078"
            }
        }
    }
};
