"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HopBridge = void 0;
const a_di_1 = __importDefault(require("a-di"));
const BlockChainExplorerProvider_1 = require("@dequanto/BlockchainExplorer/BlockChainExplorerProvider");
const Web3ClientFactory_1 = require("@dequanto/clients/Web3ClientFactory");
const TokenService_1 = require("@dequanto/tokens/TokenService");
const TokensServiceFactory_1 = require("@dequanto/tokens/TokensServiceFactory");
const _bigint_1 = require("@dequanto/utils/$bigint");
const _date_1 = require("@dequanto/utils/$date");
const mainnet_1 = require("@hop-protocol/core/networks/mainnet");
const sdk_1 = require("@hop-protocol/sdk");
const ethers_1 = require("ethers");
const atma_utils_1 = require("atma-utils");
const Dai_l2AmmWrapperContract_1 = require("./contracts/polygon/Dai_l2AmmWrapperContract");
const HopAddresses_1 = require("./HopAddresses");
const Dai_l2BridgeContract_1 = require("./contracts/polygon/Dai_l2BridgeContract");
const _fn_1 = require("@dequanto/utils/$fn");
const PlatformFactory_1 = require("@dequanto/chains/PlatformFactory");
const _require_1 = require("@dequanto/utils/$require");
const Dai_l2SaddleSwapContract_1 = require("./contracts/polygon/Dai_l2SaddleSwapContract");
const _address_1 = require("@dequanto/utils/$address");
class HopBridge {
    constructor() {
        this.name = 'hop';
        // tested and used chains
        this.SUPPORTED_CHAINS = ['polygon', 'xdai'];
    }
    async withdraw(account, platform, symbol, params) {
        _require_1.$require.oneOf(platform, this.SUPPORTED_CHAINS, 'Supporting only tested chains');
        _require_1.$require.match(/^h/i, symbol, 'We can withdraw hop wrapped tokens, like "hDAI"');
        symbol = symbol.substring(1).toUpperCase();
        let addresses = HopAddresses_1.HopAddresses.bridges[symbol]?.[platform];
        if (addresses == null) {
            throw new Error(`No bridge addresses for symbol ${symbol} and platform ${platform}`);
        }
        let swapAddress = addresses.l2SaddleSwap;
        _require_1.$require.Address(swapAddress, `Swap Address undefined for ${symbol} and ${platform}`);
        let bridgeTokenAddress = addresses.l2HopBridgeToken;
        _require_1.$require.Address(bridgeTokenAddress, `Bridge Token undefined for ${symbol} and ${platform}`);
        let chain = await a_di_1.default.resolve(PlatformFactory_1.PlatformFactory).get(platform);
        let swapContract = new Dai_l2SaddleSwapContract_1.Dai_l2SaddleSwapContract(swapAddress, chain.client, chain.explorer);
        let tokens = await Promise.all([
            swapContract.getToken(0),
            swapContract.getToken(1),
        ]);
        let hTokenAddr = tokens.find(x => _address_1.$address.eq(x, bridgeTokenAddress));
        _require_1.$require.notNull(hTokenAddr, `Bridge Token (${bridgeTokenAddress}) not found in ${tokens}`);
        let hTokenIndex = tokens.indexOf(hTokenAddr);
        let hToken = {
            decimals: 18,
            address: hTokenAddr,
            platform,
            symbol: 'hDAI'
        };
        let hTokenContract = await chain.tokens.erc20(hToken);
        let amount = await hTokenContract.balanceOf(account.address);
        console.log(amount);
        let txApprove = await chain.token.ensureApproved(account, hToken, swapContract.address, amount);
        if (txApprove) {
            await txApprove.onCompleted;
        }
        let tx = await swapContract
            .$config(params?.config ?? {})
            .swap(account, hTokenIndex, hTokenIndex === 0 ? 1 : 0, amount, _bigint_1.$bigint.multWithFloat(amount, .97), BigInt(_date_1.$date.tool().add('24h').toUnixTimestamp()));
        return tx;
    }
    async canTransfer(account, amount, symbol, fromPlatform, toPlatform) {
        const client = Web3ClientFactory_1.Web3ClientFactory.get(fromPlatform);
        const tokenService = a_di_1.default.resolve(TokenService_1.TokenService, client);
        const tokensService = TokensServiceFactory_1.TokensServiceFactory.get(fromPlatform);
        const TokenBridges = this.getTokenBridges(symbol);
        this.checkPlatforms(fromPlatform, toPlatform, symbol, TokenBridges);
        let token = await this.getToken(tokensService, symbol, fromPlatform);
        let balance = await tokenService.balanceOf(account, token);
        if (balance === 0n) {
            return { error: new Error(`Balance is empty to transfer`) };
        }
        if (amount != null) {
            let amountWei = this.getAmount(amount, token);
            if (balance < amountWei) {
                return { error: new Error(`Invalid balance to transfer`) };
            }
        }
        return { error: null };
    }
    async transfer(account, amount, symbol, fromPlatform, toPlatform) {
        const chainFrom = await a_di_1.default.resolve(PlatformFactory_1.PlatformFactory).get(fromPlatform);
        // const client = Web3ClientFactory.get(fromPlatform);
        // const tokenService = di.resolve(TokenService, client);
        // const tokensService = TokensServiceFactory.get(fromPlatform);
        let token = await this.getToken(chainFrom.tokens, symbol, fromPlatform);
        let amountWei = this.getAmount(amount, token);
        let TokenBridges = this.getTokenBridges(symbol);
        this.checkPlatforms(fromPlatform, toPlatform, symbol, TokenBridges);
        const url = await chainFrom.client.getNodeURL({ ws: false });
        const provider = new ethers_1.providers.JsonRpcProvider(url, Utils.getChainId(fromPlatform));
        // WORKAROUND: make hop sdk to use our RPC.
        mainnet_1.networks[fromPlatform].publicRpcUrl = url;
        const signer = new ethers_1.Wallet(account.key, provider);
        const hop = new sdk_1.Hop('mainnet', signer);
        const bridge = hop.bridge(symbol);
        let BridgeAddresses = this.getBridgeAddresses(fromPlatform, symbol, TokenBridges);
        const l2AmmWrapperAddr = BridgeAddresses.l2AmmWrapper;
        const l2BridgeAddr = BridgeAddresses.l2Bridge;
        let withRemainder = amountWei < 0;
        let balance = null;
        let remainder = null;
        if (withRemainder) {
            remainder = amountWei * -1n;
            balance = await chainFrom.token.balanceOf(account.address, token);
            amountWei = balance + amountWei;
            let gasPrice = await chainFrom.client.getGasPrice();
            let gasLimit = 300000n;
            amountWei -= gasPrice * gasLimit;
            console.log(`Estimated GAS Price: ${_bigint_1.$bigint.toGweiFromWei(gasPrice)}GWEI; Total: ${_bigint_1.$bigint.toGweiFromWei(gasPrice * gasLimit)}GWEI`);
            if (amountWei < 0) {
                throw new Error(`Not enough amount to be left on chain. Balance ${balance}`);
            }
        }
        const isNative = chainFrom.tokens.isNative(token);
        if (isNative === false) {
            // ERC20, check approval
            let txApprove = await chainFrom.token.ensureApproved(account, token, l2AmmWrapperAddr, amountWei);
            if (txApprove) {
                await txApprove.onCompleted;
            }
        }
        // console.log(
        //     'Hop.transfer',
        //     symbol, l2AmmWrapperAddr,
        //     chainFrom.client.platform,
        //     fromPlatform,
        //     toPlatform,
        //     url
        // );
        let depositContract = new Dai_l2AmmWrapperContract_1.Dai_l2AmmWrapperContract(l2AmmWrapperAddr, chainFrom.client, BlockChainExplorerProvider_1.BlockChainExplorerProvider.get(fromPlatform));
        let bridgeContract = new Dai_l2BridgeContract_1.Dai_l2BridgeContract(l2BridgeAddr, chainFrom.client, BlockChainExplorerProvider_1.BlockChainExplorerProvider.get(fromPlatform));
        let deadline = bridge.defaultDeadlineSeconds; // BigInt($date.tool().add(`${bridge.defaultDeadlineSeconds}s`).toUnixTimestamp());
        let sendData = await bridge.getSendData(amountWei.toString(), Utils.getChain(fromPlatform), Utils.getChain(toPlatform));
        let params = {
            bonderFee: BigInt(sendData.adjustedBonderFee.toString()),
            txFee: BigInt(sendData.adjustedDestinationTxFee.toString()),
            totalFee: BigInt(sendData.totalFee.toString()),
            estimatedReceived: BigInt(sendData.estimatedReceived.toString()),
            amountOut: BigInt(sendData.amountOut.toString())
        };
        let txWriter = await depositContract
            .$config({
            gasLimit: 300000,
            gasLimitRatio: 1,
        })
            .swapAndSend({
            ...account,
            value: isNative ? amountWei : 0n
        }, BigInt(Utils.getChainId(toPlatform)), account.address, amountWei, params.totalFee, params.amountOut - _bigint_1.$bigint.toWei(.15, token.decimals), BigInt(deadline), params.estimatedReceived - _bigint_1.$bigint.toWei(.15, token.decimals), BigInt(deadline));
        let result = {
            txWriter: txWriter,
            txReceipt: new atma_utils_1.class_Dfr(),
            txTransferId: new atma_utils_1.class_Dfr()
        };
        (async function () {
            try {
                let receipt = await txWriter.onCompleted;
                result.txReceipt.resolve(receipt);
                let [event] = bridgeContract.extractLogsTransferSent(receipt);
                if (event == null) {
                    throw new Error(`TransferSent Event was not parsed`);
                }
                result.txTransferId.resolve(event.transferId);
            }
            catch (error) {
                result.txTransferId.reject(error);
            }
        }());
        return result;
    }
    async waitForTransfer(transferId, symbol, toPlatform, toAccount) {
        let r = await _fn_1.$fn.waitForObject(async () => {
            let val = await this.status(transferId, symbol, toPlatform);
            console.log(`${_date_1.$date.format(new Date(), 'HH:mm')} Checked for bridge transfer completion: ${val}`);
            if (val) {
                return [null, {}];
            }
            return null;
        }, {
            intervalMs: 20000,
            timeoutMs: 5 * 60 * 60 * 1000,
            timeoutMessage: `Waiting the Transfer to be Completed timeouted`
        });
    }
    async status(transferId, symbol, toPlatform) {
        symbol = symbol.toUpperCase();
        if (symbol === 'XDAI') {
            symbol = 'DAI';
        }
        let TokenBridges = HopAddresses_1.HopAddresses.bridges[symbol];
        if (TokenBridges == null) {
            throw new Error(`Token ${symbol} is not supported by the HOP Protocol`);
        }
        let bridgeToPlatform = getBridgePlatform(toPlatform);
        if (bridgeToPlatform in TokenBridges === false) {
            throw new Error(`Unsupported chain ("${toPlatform}") to transfer ${symbol} token to`);
        }
        let BridgeAddresses = TokenBridges[bridgeToPlatform];
        if (BridgeAddresses == null) {
            throw new Error(`No BridgeAddresses for ${toPlatform} and token ${symbol}`);
        }
        const l2BridgeAddr = BridgeAddresses.l2Bridge;
        const client = Web3ClientFactory_1.Web3ClientFactory.get(toPlatform);
        let bridgeContract = new Dai_l2BridgeContract_1.Dai_l2BridgeContract(l2BridgeAddr, client, BlockChainExplorerProvider_1.BlockChainExplorerProvider.get(toPlatform));
        return bridgeContract.isTransferIdSpent(transferId);
    }
    async transferWithSDK(account, amount, token, fromPlatform, toPlatform) {
        if (typeof amount === 'number') {
            amount = _bigint_1.$bigint.toWei(amount, token.decimals);
        }
        const client = Web3ClientFactory_1.Web3ClientFactory.get(fromPlatform);
        const url = await client.getNodeURL({ ws: false });
        const provider = new ethers_1.providers.JsonRpcProvider(url);
        const signer = new ethers_1.Wallet(account.key, provider);
        const hop = new sdk_1.Hop('mainnet', signer);
        const bridge = hop.bridge(token.symbol);
        const tx = await bridge.approveAndSend(amount.toString(), Utils.getChain(fromPlatform), Utils.getChain(toPlatform));
        console.log(tx);
        return tx;
    }
    checkPlatforms(fromPlatform, toPlatform, symbol, TokenBridges) {
        if (this.SUPPORTED_CHAINS.includes(fromPlatform) === false) {
            throw new Error(`From ${fromPlatform} platform is not tested yet`);
        }
        if (this.SUPPORTED_CHAINS.includes(toPlatform) === false) {
            throw new Error(`To ${toPlatform} platform is not tested yet`);
        }
        /** throws if invalid */
        this.getBridgePlatform(fromPlatform, symbol, TokenBridges);
        /** throws if invalid */
        this.getBridgePlatform(toPlatform, symbol, TokenBridges);
        /** throws if invalid */
        this.getBridgeAddresses(fromPlatform, symbol, TokenBridges);
    }
    getAmount(amount, token) {
        if (typeof amount === 'number') {
            return _bigint_1.$bigint.toWei(amount, token.decimals);
        }
        return amount;
    }
    async getToken(tokensService, symbol, fromPlatform) {
        if (fromPlatform === 'xdai') {
            if (symbol === 'DAI') {
                symbol = 'XDAI';
            }
        }
        let token = await tokensService.getKnownToken(symbol);
        if (token.platform !== fromPlatform) {
            throw new Error(`Token ${symbol} has wrong chain: ${token.platform}. Transfering from ${fromPlatform}`);
        }
        return token;
    }
    getTokenBridges(symbol) {
        let TokenBridges = HopAddresses_1.HopAddresses.bridges[symbol];
        if (TokenBridges == null) {
            throw new Error(`Token ${symbol} is not supported by the HOP Protocol`);
        }
        return TokenBridges;
    }
    getBridgePlatform(platform, symbol, TokenBridges) {
        let bridgePlatform = getBridgePlatform(platform);
        if (bridgePlatform in TokenBridges === false) {
            throw new Error(`Unsupported chain ("${platform}") to transfer ${symbol} token from`);
        }
        return bridgePlatform;
    }
    getBridgeAddresses(platform, symbol, TokenBridges) {
        let bridgePlatform = this.getBridgePlatform(platform, symbol, TokenBridges);
        let BridgeAddresses = TokenBridges[bridgePlatform];
        if (BridgeAddresses == null) {
            throw new Error(`No BridgeAddresses for ${platform} and token ${symbol}`);
        }
        return BridgeAddresses;
    }
}
exports.HopBridge = HopBridge;
var Utils;
(function (Utils) {
    function getChain(platform) {
        switch (platform) {
            case 'eth':
                return sdk_1.Chain.Ethereum;
            case 'bsc':
                break;
            case 'polygon':
                return sdk_1.Chain.Polygon;
            case 'xdai':
                return sdk_1.Chain.xDai;
            case 'arbitrum':
                return sdk_1.Chain.Arbitrum;
        }
        throw new Error(`Not supported "${platform}" chain`);
    }
    Utils.getChain = getChain;
    function getChainId(platform) {
        switch (platform) {
            case 'eth':
                return 1;
            case 'bsc':
                return 56;
            case 'polygon':
                return 137;
            case 'xdai':
                return 100;
            case 'arbitrum':
                return 42161;
        }
        throw new Error(`Not supported "${platform}" chain`);
    }
    Utils.getChainId = getChainId;
})(Utils || (Utils = {}));
function getBridgePlatform(platform) {
    switch (platform) {
        case 'eth': return 'ethereum';
        default: return platform;
    }
}
