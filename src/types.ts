import { PublicKey, TransactionInstruction } from "@solana/web3.js";

export enum TokenID {
  BTC = "BTC",
  ETH = "ETH",
  SOL = "SOL",
  RAY = "RAY",
  SRM = "SRM",
  USDT = "USDT",
  USDC = "USDC",
  UST = "UST",
  PAI = "PAI",
  SBR = "SBR",
  ORCA = "ORCA",
}

// market contains meta data
export abstract class Market {

  constructor(
    public name: string, 
    public tokenIds: TokenID[]
  ) {
  }

  abstract getSwapper(args: any) : Swapper;
}

export interface PairMarket {
  tokenIdA: TokenID;
  tokenIdB: TokenID;
}

// a swapper is usually associated with a specific market, and can perform swap
export interface Swapper {
  createSwapInstructions(
    fromToken: TokenID,
    fromAmount: number,
    fromTokenAccount: PublicKey,
    toToken: TokenID,
    minToAmount: number,
    toTokenAccount: PublicKey,
    tradeOwner: PublicKey,
  ) : Promise<TransactionInstruction[]>;
}

export class Dex {
  markets: {[name: string] : Market};

  constructor(markets: [Market]) {
    this.markets = {};
    for(const market of markets) {
      this.markets[market.name] = market;
    }
  }
}