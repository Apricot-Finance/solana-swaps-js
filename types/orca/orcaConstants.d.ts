import { PublicKey, TransactionInstruction } from "@solana/web3.js";
import { Market, Swapper, TokenID } from "../types";
import { Parser } from "../utils/Parser";
export declare const ORCA_SWAP_PROGRAM: PublicKey;
export declare class OrcaMarket extends Market implements Swapper {
    name: string;
    tokenIdA: TokenID;
    tokenIdB: TokenID;
    swap: PublicKey;
    swapAuthority: PublicKey;
    vaultA: PublicKey;
    vaultB: PublicKey;
    poolMint: PublicKey;
    fees: PublicKey;
    constructor(name: string, tokenIdA: TokenID, tokenIdB: TokenID, swap: PublicKey, swapAuthority: PublicKey, vaultA: PublicKey, vaultB: PublicKey, poolMint: PublicKey, fees: PublicKey);
    getSwapper(args: any): Swapper;
    INST_LAYOUT: Parser;
    createSwapInstructions(fromToken: TokenID, fromAmount: number, fromTokenAccount: PublicKey, toToken: TokenID, minToAmount: number, toTokenAccount: PublicKey, tradeOwner: PublicKey): Promise<TransactionInstruction[]>;
}
export declare const ORCA_USDT_USDC_MARKET: OrcaMarket;
