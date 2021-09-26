import { PublicKey, TransactionInstruction } from "@solana/web3.js";
import { Market, Swapper, TokenID } from "../types";
export declare const SERUM_PROGRAM: PublicKey;
export declare class SerumMarket extends Market {
    name: string;
    tokenIdA: TokenID;
    tokenIdB: TokenID;
    market: PublicKey;
    bids: PublicKey;
    asks: PublicKey;
    events: PublicKey;
    requests: PublicKey;
    vaultA: PublicKey;
    vaultB: PublicKey;
    vaultSigner: PublicKey;
    mintA: PublicKey;
    mintB: PublicKey;
    constructor(name: string, tokenIdA: TokenID, tokenIdB: TokenID, market: PublicKey, bids: PublicKey, asks: PublicKey, events: PublicKey, requests: PublicKey, vaultA: PublicKey, vaultB: PublicKey, vaultSigner: PublicKey);
    getSwapper(args: any): Swapper;
}
export declare class SerumSwapper implements Swapper {
    market: SerumMarket;
    openOrders: PublicKey;
    constructor(market: SerumMarket, openOrders: PublicKey);
    createSwapInstructions(fromToken: TokenID, fromAmount: number, fromTokenAccount: PublicKey, toToken: TokenID, toAmount: number, toTokenAccount: PublicKey, tradeOwner: PublicKey): Promise<TransactionInstruction[]>;
}
export declare const SERUM_BTC_USDC_MARKET: SerumMarket;
export declare const SERUM_ETH_USDC_MARKET: SerumMarket;
export declare const SERUM_SOL_USDC_MARKET: SerumMarket;
