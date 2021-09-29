"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RAYDIUM_SOL_USDC_MARKET = exports.RAYDIUM_ETH_USDC_MARKET = exports.RAYDIUM_BTC_USDC_MARKET = exports.RaydiumMarket = exports.RAYDIUM_AMM_PROGRAM = void 0;
const web3_js_1 = require("@solana/web3.js");
const spl_token_1 = require("@solana/spl-token");
const types_1 = require("../types");
const mints_1 = require("../mints");
const serumConstants_1 = require("../serum/serumConstants");
const Parser_1 = require("../utils/Parser");
exports.RAYDIUM_AMM_PROGRAM = new web3_js_1.PublicKey("675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8");
class RaydiumMarket extends types_1.Market {
    constructor(name, tokenIdA, tokenIdB, amm, ammAuthority, openOrders, targetOrders, raydiumVaultA, raydiumVaultB, serumMarket, serumBids, serumAsks, serumEvents, serumVaultA, serumVaultB, serumVaultSigner) {
        super(name, [tokenIdA, tokenIdB]);
        this.tokenIdA = tokenIdA;
        this.tokenIdB = tokenIdB;
        this.amm = amm;
        this.ammAuthority = ammAuthority;
        this.openOrders = openOrders;
        this.targetOrders = targetOrders;
        this.raydiumVaultA = raydiumVaultA;
        this.raydiumVaultB = raydiumVaultB;
        this.serumMarket = serumMarket;
        this.serumBids = serumBids;
        this.serumAsks = serumAsks;
        this.serumEvents = serumEvents;
        this.serumVaultA = serumVaultA;
        this.serumVaultB = serumVaultB;
        this.serumVaultSigner = serumVaultSigner;
        this.INST_LAYOUT = new Parser_1.Parser()
            .u8("cmd")
            .u64("in_amount")
            .u64("min_out_amount");
        if (name !== `${tokenIdA}/${tokenIdB}`) {
            throw new Error("Incorrect name!");
        }
        this.mintA = mints_1.MINTS[tokenIdA];
        this.mintB = mints_1.MINTS[tokenIdB];
    }
    getSwapper() {
        return this;
    }
    createSwapInstructions(_fromToken, fromAmount, fromTokenAccount, _toToken, minToAmount, toTokenAccount, tradeOwner) {
        return __awaiter(this, void 0, void 0, function* () {
            const buffer = this.INST_LAYOUT.encode({
                cmd: 9,
                in_amount: fromAmount,
                min_out_amount: minToAmount
            });
            const ix = new web3_js_1.TransactionInstruction({
                programId: exports.RAYDIUM_AMM_PROGRAM,
                keys: [
                    { pubkey: spl_token_1.TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
                    { pubkey: this.amm, isSigner: false, isWritable: true },
                    { pubkey: this.ammAuthority, isSigner: false, isWritable: false },
                    { pubkey: this.openOrders, isSigner: false, isWritable: true },
                    { pubkey: this.targetOrders, isSigner: false, isWritable: true },
                    { pubkey: this.raydiumVaultA, isSigner: false, isWritable: true },
                    { pubkey: this.raydiumVaultB, isSigner: false, isWritable: true },
                    { pubkey: serumConstants_1.SERUM_PROGRAM, isSigner: false, isWritable: false },
                    { pubkey: this.serumMarket, isSigner: false, isWritable: true },
                    { pubkey: this.serumBids, isSigner: false, isWritable: true },
                    { pubkey: this.serumAsks, isSigner: false, isWritable: true },
                    { pubkey: this.serumEvents, isSigner: false, isWritable: true },
                    { pubkey: this.serumVaultA, isSigner: false, isWritable: true },
                    { pubkey: this.serumVaultB, isSigner: false, isWritable: true },
                    { pubkey: this.serumVaultSigner, isSigner: false, isWritable: false },
                    { pubkey: fromTokenAccount, isSigner: false, isWritable: true },
                    { pubkey: toTokenAccount, isSigner: false, isWritable: true },
                    { pubkey: tradeOwner, isSigner: true, isWritable: false },
                ],
                data: buffer,
            });
            return [ix];
        });
    }
}
exports.RaydiumMarket = RaydiumMarket;
exports.RAYDIUM_BTC_USDC_MARKET = new RaydiumMarket("BTC/USDC", types_1.TokenID.BTC, types_1.TokenID.USDC, new web3_js_1.PublicKey("6kbC5epG18DF2DwPEW34tBy5pGFS7pEGALR3v5MGxgc5"), // amm
new web3_js_1.PublicKey("5Q544fKrFoe6tsEbD7S8EmxGTJYAKtTVhAW5Q5pge4j1"), // ammAuthority
new web3_js_1.PublicKey("L6A7qW935i2HgaiaRx6xNGCGQfFr4myFU51dUSnCshd"), // openOrders
new web3_js_1.PublicKey("6DGjaczWfFthTYW7oBk3MXP2mMwrYq86PA3ki5YF6hLg"), // targetOrders
new web3_js_1.PublicKey("HWTaEDR6BpWjmyeUyfGZjeppLnH7s8o225Saar7FYDt5"), // vaultA
new web3_js_1.PublicKey("7iGcnvoLAxthsXY3AFSgkTDoqnLiuti5fyPNm2VwZ3Wz"), // vaultB
new web3_js_1.PublicKey("A8YFbxQYFVqKZaoYJLLUVcQiWP7G2MeEgW5wsAQgMvFw"), // market
new web3_js_1.PublicKey("6wLt7CX1zZdFpa6uGJJpZfzWvG6W9rxXjquJDYiFwf9K"), // bids
new web3_js_1.PublicKey("6EyVXMMA58Nf6MScqeLpw1jS12RCpry23u9VMfy8b65Y"), // asks
new web3_js_1.PublicKey("6NQqaa48SnBBJZt9HyVPngcZFW81JfDv9EjRX2M4WkbP"), // events
new web3_js_1.PublicKey("GZ1YSupuUq9kB28kX9t1j9qCpN67AMMwn4Q72BzeSpfR"), // vaultA
new web3_js_1.PublicKey("7sP9fug8rqZFLbXoEj8DETF81KasaRA1fr6jQb6ScKc5"), // vaultB
new web3_js_1.PublicKey("GBWgHXLf1fX4J1p5fAkQoEbnjpgjxUtr4mrVgtj9wW8a"));
exports.RAYDIUM_ETH_USDC_MARKET = new RaydiumMarket("ETH/USDC", types_1.TokenID.ETH, types_1.TokenID.USDC, new web3_js_1.PublicKey("AoPebtuJC4f2RweZSxcVCcdeTgaEXY64Uho8b5HdPxAR"), // amm
new web3_js_1.PublicKey("5Q544fKrFoe6tsEbD7S8EmxGTJYAKtTVhAW5Q5pge4j1"), // ammAuthority
new web3_js_1.PublicKey("7PwhFjfFaYp7w9N8k2do5Yz7c1G5ebp3YyJRhV4pkUJW"), // openOrders
new web3_js_1.PublicKey("BV2ucC7miDqsmABSkXGzsibCVWBp7gGPcvkhevDSTyZ1"), // targetOrders
new web3_js_1.PublicKey("EHT99uYfAnVxWHPLUMJRTyhD4AyQZDDknKMEssHDtor5"), // vaultA
new web3_js_1.PublicKey("58tgdkogRoMsrXZJubnFPsFmNp5mpByEmE1fF6FTNvDL"), // vaultB
new web3_js_1.PublicKey("4tSvZvnbyzHXLMTiFonMyxZoHmFqau1XArcRCVHLZ5gX"), // market
new web3_js_1.PublicKey("8tFaNpFPWJ8i7inhKSfAcSestudiFqJ2wHyvtTfsBZZU"), // bids
new web3_js_1.PublicKey("2po4TC8qiTgPsqcnbf6uMZRMVnPBzVwqqYfHP15QqREU"), // asks
new web3_js_1.PublicKey("Eac7hqpaZxiBtG4MdyKpsgzcoVN6eMe9tAbsdZRYH4us"), // events
new web3_js_1.PublicKey("7Nw66LmJB6YzHsgEGQ8oDSSsJ4YzUkEVAvysQuQw7tC4"), // vaultA
new web3_js_1.PublicKey("EsDTx47jjFACkBhy48Go2W7AQPk4UxtT4765f3tpK21a"), // vaultB
new web3_js_1.PublicKey("C5v68qSzDdGeRcs556YoEMJNsp8JiYEiEhw2hVUR8Z8y"));
exports.RAYDIUM_SOL_USDC_MARKET = new RaydiumMarket("SOL/USDC", types_1.TokenID.SOL, types_1.TokenID.USDC, new web3_js_1.PublicKey("58oQChx4yWmvKdwLLZzBi4ChoCc2fqCUWBkwMihLYQo2"), // amm
new web3_js_1.PublicKey("5Q544fKrFoe6tsEbD7S8EmxGTJYAKtTVhAW5Q5pge4j1"), // ammAuthority
new web3_js_1.PublicKey("HRk9CMrpq7Jn9sh7mzxE8CChHG8dneX9p475QKz4Fsfc"), // openOrders
new web3_js_1.PublicKey("CZza3Ej4Mc58MnxWA385itCC9jCo3L1D7zc3LKy1bZMR"), // targetOrders
new web3_js_1.PublicKey("DQyrAcCrDXQ7NeoqGgDCZwBvWDcYmFCjSb9JtteuvPpz"), // vaultA
new web3_js_1.PublicKey("HLmqeL62xR1QoZ1HKKbXRrdN1p3phKpxRMb2VVopvBBz"), // vaultB
new web3_js_1.PublicKey("9wFFyRfZBsuAha4YcuxcXLKwMxJR43S7fPfQLusDBzvT"), // market
new web3_js_1.PublicKey("14ivtgssEBoBjuZJtSAPKYgpUK7DmnSwuPMqJoVTSgKJ"), // bids
new web3_js_1.PublicKey("CEQdAFKdycHugujQg9k2wbmxjcpdYZyVLfV9WerTnafJ"), // asks
new web3_js_1.PublicKey("5KKsLVU6TcbVDK4BS6K1DGDxnh4Q9xjYJ8XaDCG5t8ht"), // events
new web3_js_1.PublicKey("36c6YqAwyGKQG66XEp2dJc5JqjaBNv7sVghEtJv4c7u6"), // vaultA
new web3_js_1.PublicKey("8CFo8bL8mZQK8abbFyypFMwEDd8tVJjHTTojMLgQTUSZ"), // vaultB
new web3_js_1.PublicKey("F8Vyqk3unwxkXukZFQeYyGmFfTG3CAX4v24iyrjEYBJV"));
