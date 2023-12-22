import { SolidityParser } from '@dequanto/solidity/SolidityParser';

UTest({
    async 'should extract slots from contract'() {
        const input = `
            contract Test {
                struct User {
                    address account;
                    uint256 amount;
                }

                event Submitted(uint256 indexed id, address account);

                bool public myVar;
                User public admin;
                mapping(address => uint8) public balances;

                function foo (uint a) external view returns (string) {
                    return "";
                }

                function mySetter(User calldata _admin) external {
                    admin = _admin;
                }
            }
        `;

        const { abi } = await SolidityParser.extractAbi({
            code: input,
            path: './test/solidity/Parser.sol'
        }, 'Test');

        has_(abi.find(x => x.name === 'myVar'), {
            inputs: [],
            outputs: [{ type: 'bool' }],
            stateMutability: 'view',
            type: 'function'
        });
        has_(abi.find(x => x.name === 'admin'), {
            inputs: [],
            outputs: [
                {
                    type: 'tuple', components: [
                        { type: 'address', name: 'account' },
                        { type: 'uint256', name: 'amount' },
                    ]
                }
            ],
            stateMutability: 'view',
            type: 'function'
        });
        has_(abi.find(x => x.name === 'foo'), {
            inputs: [{ type: 'uint256', name: 'a' }],
            outputs: [{ type: 'string' }],
            stateMutability: 'view',
            type: 'function'
        });
        has_(abi.find(x => x.name === 'mySetter'), {
            inputs: [
                {
                    name: '_admin',
                    type: 'tuple', components: [
                        { type: 'address', name: 'account' },
                        { type: 'uint256', name: 'amount' },
                    ]
                }
            ],
            outputs: [],
            stateMutability: null,
            type: 'function'
        });
        has_(abi.find(x => x.name === 'balances'), {
            inputs: [{ type: 'address' }],
            outputs: [{ type: 'uint8' }],
            stateMutability: 'view',
            type: 'function'
        });

        has_(abi.find(x => x.name === 'Submitted'), {
            inputs: [
                { type: 'uint256', name: 'id', 'indexed': true, },
                { type: 'address', name: 'account' },
            ],
            type: 'event'
        });
    },
    async 'should extract from sol file' () {
        const { abi, source } = await SolidityParser.extractAbi({
            path: './test/fixtures/deployments/DeploymentsFoo.sol'
        });
        eq_(source.contractName, 'DeploymentsFoo');
        has_(abi.find(x => x.name === 'setValue'), {
            inputs: [
                { type: 'uint256', name: 'value' },
            ],
            stateMutability: 'nonpayable',
            type: 'function'
        });
    },
    async 'should extract from inheritance'() {
        const input = `
            contract Bar {
                bool public barVar;
            }
            contract Test is Bar {
                constructor (bool _barVar) {
                    barVar = _barVar;
                }
            }
        `;
        const { abi } = await SolidityParser.extractAbi({
            code: input,
            path: './test/solidity/Parser.sol'
        }, 'Test');

        has_(abi.find(x => x.name === 'barVar'), {
            inputs: [],
            outputs: [{ type: 'bool' }],
            stateMutability: 'view',
            type: 'function'
        });
        has_(abi.find(x => x.type === 'constructor'), {
            inputs: [{ type: 'bool', name: '_barVar' }],
            type: 'constructor'
        });
    },

    async 'should parse weth.sol'() {
        let { abi: abis } = await SolidityParser.extractAbi({ path: './test/fixtures/scan/WETH.sol' }, 'MaticWETH');

        let names = abis.map(x => x.name);
        deepEq_(names, [
            'totalSupply',
            'balanceOf',
            'transfer',
            'allowance',
            'approve',
            'transferFrom',
            'Transfer',
            'Approval',
            'name',
            'symbol',
            'decimals',
            'totalSupply',
            'balanceOf',
            'transfer',
            'allowance',
            'approve',
            'transferFrom',
            'increaseAllowance',
            'decreaseAllowance',
            'deposit',
            'hasRole',
            'getRoleMemberCount',
            'getRoleMember',
            'getRoleAdmin',
            'grantRole',
            'revokeRole',
            'renounceRole',
            'DEFAULT_ADMIN_ROLE',
            'RoleAdminChanged',
            'RoleGranted',
            'RoleRevoked',
            'getDomainSeperator',
            'getChainId',
            'executeMetaTransaction',
            'getNonce',
            'MetaTransactionExecuted',
            'ERC712_VERSION',
            'ROOT_CHAIN_ID',
            'ROOT_CHAIN_ID_BYTES',
            'CHILD_CHAIN_ID',
            'CHILD_CHAIN_ID_BYTES',
            'deposit',
            'withdraw',
            'DEPOSITOR_ROLE',
            'constructor'
        ]);
    },
    async 'should parse Interface from weth.sol'() {
        let { abi: abis } = await SolidityParser.extractAbi({ path: './test/fixtures/scan/WETH.sol' }, 'IERC20');

        let names = abis.map(x => x.name);
        deepEq_(names, [
            'totalSupply',
            'balanceOf',
            'transfer',
            'allowance',
            'approve',
            'transferFrom',
            'Transfer',
            'Approval'
        ]);
    },
    async 'should parse multi inheritance'() {
        const input = `
            contract FooHolder {
                uint public foo = 3;
            }
            contract BarHolder {
                uint public bar = 2;
            }
            contract Token is BarHolder, FooHolder {
                uint256 public totalSupply = 4;
            }
        `;

        const { abi: abis } = await SolidityParser.extractAbi({
            code: input,
            path: './test/solidity/Parser.sol'
        }, 'Token');

        eq_(abis[0].name, 'bar');
        eq_(abis[1].name, 'foo');
        eq_(abis[2].name, 'totalSupply');
    },
    async 'should parse abi from solidity lower then 0.5.0'() {

        return new UTest({
            async 'parse enjtoken'() {
                const { abi: abis } = await SolidityParser.extractAbi({
                    path: './test/fixtures/parser/v04/ENJToken.sol'
                }, 'ENJToken');

                let names = abis.map(x => x.name);
                deepEq_(names, [
                    'owner',
                    'transferOwnership',
                    'acceptOwnership',
                    'transferOwnership',
                    'acceptOwnership',
                    'owner',
                    'newOwner',
                    'OwnerUpdate',
                    'withdrawTokens',
                    'withdrawTokens',
                    'name',
                    'symbol',
                    'decimals',
                    'totalSupply',
                    'balanceOf',
                    'allowance',
                    'transfer',
                    'transferFrom',
                    'approve',
                    'transfer',
                    'transferFrom',
                    'approve',
                    'standard',
                    'name',
                    'symbol',
                    'decimals',
                    'totalSupply',
                    'balanceOf',
                    'allowance',
                    'Transfer',
                    'Approval',
                    'constructor',
                    'transfer',
                    'transferFrom',
                    'ENJ_UNIT',
                    'totalSupply',
                    'maxPresaleSupply',
                    'minCrowdsaleAllocation',
                    'incentivisationAllocation',
                    'advisorsAllocation',
                    'enjinTeamAllocation',
                    'crowdFundAddress',
                    'advisorAddress',
                    'incentivisationFundAddress',
                    'enjinTeamAddress',
                    'totalAllocatedToAdvisors',
                    'totalAllocatedToTeam',
                    'totalAllocated',
                    'endTime'
                ]);
            },
            async 'parse presale'() {
                const { abi: abis } = await SolidityParser.extractAbi({
                    path: './test/fixtures/parser/v04/MultiSigWallet.sol'
                }, 'MultiSigWallet');

                let names = abis.map(x => x.name);
                deepEq_(names, [
                    'constructor',       'addOwner',
                    'removeOwner',          'replaceOwner',
                    'changeRequirement',    'submitTransaction',
                    'confirmTransaction',   'revokeConfirmation',
                    'executeTransaction',   'isConfirmed',
                    'getConfirmationCount', 'getTransactionCount',
                    'getOwners',            'getConfirmations',
                    'getTransactionIds',    'MAX_OWNER_COUNT',
                    'transactions',         'confirmations',
                    'isOwner',              'owners',
                    'required',             'transactionCount',
                    'Confirmation',         'Revocation',
                    'Submission',           'Execution',
                    'ExecutionFailure',     'Deposit',
                    'OwnerAddition',        'OwnerRemoval',
                    'RequirementChange'
                ]);
            },

        })

    },
    async 'should parse AavePriceOracle.sol'() {
        let { abi: abis } = await SolidityParser.extractAbi({ path: './test/fixtures/parser/PriceOracle.sol' }, 'PriceOracle');
        let names = abis.map(x => x.name);
        deepEq_(names, [
            'Failure',
            'constructor',
            '_setPendingAnchor',
            '_setPaused',
            '_setPendingAnchorAdmin',
            '_acceptAnchorAdmin',
            '_setPoster',
            'setExchangeRate',
            '_disableExchangeRate',
            'setMaxSwingRate',
            'setReaders',
            '_setMaxSwing',
            '_setMaxSwingForAsset',
            '_setMaxSwingForAssetBatch',
            '_setAssetAggregator',
            '_setAssetAggregatorBatch',
            '_disableAssetAggregator',
            '_disableAssetAggregatorBatch',
            '_setAssetStatusOracle',
            '_setAssetStatusOracleBatch',
            '_disableAssetStatusOracle',
            '_disableAssetStatusOracleBatch',
            'getAssetAggregatorPrice',
            'getAssetPrice',
            'getReaderPrice',
            'getUnderlyingPrice',
            'getAssetPriceStatus',
            'getUnderlyingPriceAndStatus',
            'getExchangeRateInfo',
            'setPrice',
            'setPrices',
            'paused',
            'numBlocksPerPeriod',
            'maxSwingMantissa',
            'MINIMUM_SWING',
            'MAXIMUM_SWING',
            'SECONDS_PER_WEEK',
            'anchorAdmin',
            'pendingAnchorAdmin',
            'poster',
            'maxSwing',
            'maxSwings',
            'exchangeRates',
            'readers',
            '_assetPrices',
            'aggregator',
            'statusOracle',
            'anchors',
            'pendingAnchors',
            'OracleFailure',
            'NewPendingAnchor',
            'SetExchangeRate',
            'SetMaxSwingRate',
            'ReaderPosted',
            'SetMaxSwing',
            'SetMaxSwingForAsset',
            'SetAssetAggregator',
            'SetAssetStatusOracle',
            'PricePosted',
            'CappedPricePosted',
            'SetPaused',
            'NewPendingAnchorAdmin',
            'NewAnchorAdmin',
            'NewPoster'
        ]);
    },
    async 'should handle state variable overrides'() {
        let { abi: abis } = await SolidityParser.extractAbi({ path: './test/fixtures/contracts/AlphaKlimaSimple.sol' }, 'AlphaKlimaSimple');
        // No public methods/getters
        deepEq_(abis.length, 0);
    },
    async 'should parse USDC.sol'() {
        let { abi } = await SolidityParser.extractAbi({ path: './test/fixtures/parser/USDC.sol' });
        let names = abi.map(x => x.name);
        deepEq_(names, [
            'totalSupply',
            'balanceOf',
            'transfer',
            'allowance',
            'approve',
            'transferFrom',
            'Transfer',
            'Approval',
            'owner',
            'transferOwnership',
            'OwnershipTransferred',
            'pause',
            'unpause',
            'updatePauser',
            'pauser',
            'paused',
            'Pause',
            'Unpause',
            'PauserChanged',
            'isBlacklisted',
            'blacklist',
            'unBlacklist',
            'updateBlacklister',
            'blacklister',
            'Blacklisted',
            'UnBlacklisted',
            'BlacklisterChanged',
            'initialize',
            'mint',
            'minterAllowance',
            'isMinter',
            'allowance',
            'totalSupply',
            'balanceOf',
            'approve',
            'transferFrom',
            'transfer',
            'configureMinter',
            'removeMinter',
            'burn',
            'updateMasterMinter',
            'name',
            'symbol',
            'decimals',
            'currency',
            'masterMinter',
            'Mint',
            'Burn',
            'MinterConfigured',
            'MinterRemoved',
            'MasterMinterChanged',
            'rescuer',
            'rescueERC20',
            'updateRescuer',
            'RescuerChanged',
            'DOMAIN_SEPARATOR',
            'authorizationState',
            'TRANSFER_WITH_AUTHORIZATION_TYPEHASH',
            'RECEIVE_WITH_AUTHORIZATION_TYPEHASH',
            'CANCEL_AUTHORIZATION_TYPEHASH',
            'AuthorizationUsed',
            'AuthorizationCanceled',
            'nonces',
            'PERMIT_TYPEHASH',
            'initializeV2',
            'increaseAllowance',
            'decreaseAllowance',
            'transferWithAuthorization',
            'receiveWithAuthorization',
            'cancelAuthorization',
            'permit',
            'initializeV2_1',
            'version'
        ]);

        has_(abi.find(x => x.name === 'version'), {
            inputs: [],
            outputs: [{ type: 'string' }],
            stateMutability: 'view'
        });

    },
})
