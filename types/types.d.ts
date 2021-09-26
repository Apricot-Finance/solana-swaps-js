import { PublicKey, TransactionInstruction } from "@solana/web3.js";
export declare enum TokenID {
    BTC = "BTC",
    ETH = "ETH",
    SOL = "SOL",
    RAY = "RAY",
    SRM = "SRM",
    USDT = "USDT",
    USDC = "USDC",
    UST = "UST",
    PAI = "PAI"
}
export declare abstract class Market {
    name: string;
    tokenIds: TokenID[];
    constructor(name: string, tokenIds: TokenID[]);
    abstract getSwapper(args: any): Swapper;
}
export interface Swapper {
    createSwapInstructions(fromToken: TokenID, fromAmount: number, fromTokenAccount: PublicKey, toToken: TokenID, minToAmount: number, toTokenAccount: PublicKey, tradeOwner: PublicKey): Promise<TransactionInstruction[]>;
}
export declare class Dex {
    markets: {
        [name: string]: Market;
    };
    constructor(markets: [Market]);
}
