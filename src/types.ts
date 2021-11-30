import { PublicKey, TransactionInstruction } from "@solana/web3.js";

export enum TokenID {
  APT = "APT",
  BTC = "BTC",
  ETH = "ETH",
  SOL = "SOL",
  mSOL = "mSOL",
  RAY = "RAY",
  SRM = "SRM",
  USDT = "USDT",
  USDC = "USDC",
  UST = "UST",
  PAI = "PAI",
  SBR = "SBR",
  ORCA = "ORCA",
  USTv2 = "USTv2",
  MNDE = "MNDE",
  FTT = "FTT",
}

export enum SwapperType {
  Single = "Single",
  Multi = "Multi",
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

export abstract class MultiMarket {
  constructor(
    public markets: Market[]
  ) {

  }
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

export interface MultiSwapper {
  createMultiSwapInstructions(
    fromToken: TokenID,
    fromAmount: number,
    fromTokenAccount: PublicKey,
    middleToken: TokenID,
    middleTokenAccount: PublicKey,
    toToken: TokenID,
    minToAmount: number,
    toTokenAccount: PublicKey,
    tradeOwner: PublicKey,
  ) : Promise<TransactionInstruction[]>;
}

export function IsMultiSwapper(object: any): boolean {
  return 'createMultiSwapInstructions' in object;
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