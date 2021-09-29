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
exports.ORCA_USDT_USDC_MARKET = exports.OrcaMarket = exports.ORCA_SWAP_PROGRAM = void 0;
const web3_js_1 = require("@solana/web3.js");
const types_1 = require("../types");
const Parser_1 = require("../utils/Parser");
const spl_token_1 = require("@solana/spl-token");
exports.ORCA_SWAP_PROGRAM = new web3_js_1.PublicKey("9W959DqEETiGZocYWCQPaJ6sBmUzgfxXfqGeTEdp3aQP");
class OrcaMarket extends types_1.Market {
    constructor(name, tokenIdA, tokenIdB, swap, swapAuthority, vaultA, vaultB, poolMint, fees) {
        super(name, [tokenIdA, tokenIdB]);
        this.name = name;
        this.tokenIdA = tokenIdA;
        this.tokenIdB = tokenIdB;
        this.swap = swap;
        this.swapAuthority = swapAuthority;
        this.vaultA = vaultA;
        this.vaultB = vaultB;
        this.poolMint = poolMint;
        this.fees = fees;
        this.INST_LAYOUT = new Parser_1.Parser()
            .u8("cmd")
            .u64("in_amount")
            .u64("min_out_amount");
    }
    getSwapper(_args) {
        return this;
    }
    createSwapInstructions(fromToken, fromAmount, fromTokenAccount, toToken, minToAmount, toTokenAccount, tradeOwner) {
        return __awaiter(this, void 0, void 0, function* () {
            const buffer = this.INST_LAYOUT.encode({
                cmd: 1,
                in_amount: fromAmount,
                min_out_amount: minToAmount
            });
            const poolSource = fromToken === this.tokenIdA ? this.vaultA : this.vaultB;
            const poolDest = toToken === this.tokenIdA ? this.vaultA : this.vaultB;
            const ix = new web3_js_1.TransactionInstruction({
                programId: exports.ORCA_SWAP_PROGRAM,
                keys: [
                    { pubkey: this.swap, isSigner: false, isWritable: false },
                    { pubkey: this.swapAuthority, isSigner: false, isWritable: false },
                    { pubkey: tradeOwner, isSigner: true, isWritable: false },
                    { pubkey: fromTokenAccount, isSigner: false, isWritable: true },
                    { pubkey: poolSource, isSigner: false, isWritable: true },
                    { pubkey: poolDest, isSigner: false, isWritable: true },
                    { pubkey: toTokenAccount, isSigner: false, isWritable: true },
                    { pubkey: this.poolMint, isSigner: false, isWritable: true },
                    { pubkey: this.fees, isSigner: false, isWritable: true },
                    { pubkey: spl_token_1.TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
                ],
                data: buffer,
            });
            return [ix];
        });
    }
}
exports.OrcaMarket = OrcaMarket;
exports.ORCA_USDT_USDC_MARKET = new OrcaMarket("USDT/USDC", types_1.TokenID.USDT, types_1.TokenID.USDC, new web3_js_1.PublicKey("F13xvvx45jVGd84ynK3c8T89UejQVxjCLtmHfPmAXAHP"), // swap
new web3_js_1.PublicKey("3cGHDS8uWhdxQj14vTmFtYHX3NMouPpE4o9MjQ43Bbf4"), // swapAuthority
new web3_js_1.PublicKey("AiwmnLy7xPT28dqZpkRm6i1ZGwELUCzCsuN92v4JkSeU"), // vaultA
new web3_js_1.PublicKey("6uUn2okWk5v4x9Gc4n2LLGHtWoa9tmizHq1363dW7t9W"), // vaultB
new web3_js_1.PublicKey("H2uzgruPvonVpCRhwwdukcpXK8TG17swFNzYFr2rtPxy"), // poolMint
new web3_js_1.PublicKey("B4RNxMJGRzKFQyTq2Uwkmpyjtew13n7KtdqZy6qgENTu"));
