import { PublicKey } from "@solana/web3.js";
import {Market, PairMarket, Swapper, TokenID} from "../types";
import { MINTS } from "../mints";

export const SERUM_PROGRAM = new PublicKey("9xQeWvG816bUx9EPjHmaT23yvVM2ZWbrrpZb9PusVFin");

export class SerumMarket extends Market implements PairMarket {
  mintA: PublicKey;
  mintB: PublicKey;

  constructor(
    public name: string,
    public tokenIdA: TokenID,
    public tokenIdB: TokenID,
    public market: PublicKey,
    public bids: PublicKey,
    public asks: PublicKey,
    public events: PublicKey,
    public requests: PublicKey,
    public vaultA: PublicKey,
    public vaultB: PublicKey,
    public vaultSigner: PublicKey,
  ) {
    super(name, [tokenIdA, tokenIdB]);
    if(name !== `${tokenIdA}/${tokenIdB}`) {
      throw new Error("Incorrect name!");
    }
    this.mintA = MINTS[tokenIdA];
    this.mintB = MINTS[tokenIdB];
  }

  getSwapper(_args: any) : Swapper {
    // Serum Swap requires an OpenOrder account that costs like 0.02 SOL. Not setting it up for now.
    throw new Error("Not implemented");
  }
}

export const SERUM_BTC_USDC_MARKET = new SerumMarket(
  "BTC/USDC",
  TokenID.BTC,
  TokenID.USDC,

  new PublicKey("A8YFbxQYFVqKZaoYJLLUVcQiWP7G2MeEgW5wsAQgMvFw"),  // market
  new PublicKey("6wLt7CX1zZdFpa6uGJJpZfzWvG6W9rxXjquJDYiFwf9K"),  // bids
  new PublicKey("6EyVXMMA58Nf6MScqeLpw1jS12RCpry23u9VMfy8b65Y"),  // asks
  new PublicKey("6NQqaa48SnBBJZt9HyVPngcZFW81JfDv9EjRX2M4WkbP"),  // events
  new PublicKey("H6UaUrNVELJgTqao1CNL4252kShLKSfwoboT8tF7HNtB"),  // requests
  new PublicKey("GZ1YSupuUq9kB28kX9t1j9qCpN67AMMwn4Q72BzeSpfR"),  // vaultA
  new PublicKey("7sP9fug8rqZFLbXoEj8DETF81KasaRA1fr6jQb6ScKc5"),  // vaultB
  new PublicKey("GBWgHXLf1fX4J1p5fAkQoEbnjpgjxUtr4mrVgtj9wW8a"),  // vaultSigner
);

export const SERUM_ETH_USDC_MARKET = new SerumMarket(
  "ETH/USDC",
  TokenID.ETH,
  TokenID.USDC,


  new PublicKey("4tSvZvnbyzHXLMTiFonMyxZoHmFqau1XArcRCVHLZ5gX"),  // market
  new PublicKey("8tFaNpFPWJ8i7inhKSfAcSestudiFqJ2wHyvtTfsBZZU"),  // bids
  new PublicKey("2po4TC8qiTgPsqcnbf6uMZRMVnPBzVwqqYfHP15QqREU"),  // asks
  new PublicKey("Eac7hqpaZxiBtG4MdyKpsgzcoVN6eMe9tAbsdZRYH4us"),  // events
  new PublicKey("6yJsfduT4Av6xaECAoXf4cXHaQQYjf78D1FG3WDyuxdr"),  // requests
  new PublicKey("7Nw66LmJB6YzHsgEGQ8oDSSsJ4YzUkEVAvysQuQw7tC4"),  // vaultA
  new PublicKey("EsDTx47jjFACkBhy48Go2W7AQPk4UxtT4765f3tpK21a"),  // vaultB
  new PublicKey("C5v68qSzDdGeRcs556YoEMJNsp8JiYEiEhw2hVUR8Z8y"),  // vaultSigner
);

export const SERUM_SOL_USDC_MARKET = new SerumMarket(
  "SOL/USDC",
  TokenID.SOL,
  TokenID.USDC,

  new PublicKey("9wFFyRfZBsuAha4YcuxcXLKwMxJR43S7fPfQLusDBzvT"),  // market
  new PublicKey("14ivtgssEBoBjuZJtSAPKYgpUK7DmnSwuPMqJoVTSgKJ"),  // bids
  new PublicKey("CEQdAFKdycHugujQg9k2wbmxjcpdYZyVLfV9WerTnafJ"),  // asks
  new PublicKey("5KKsLVU6TcbVDK4BS6K1DGDxnh4Q9xjYJ8XaDCG5t8ht"),  // events
  new PublicKey("AZG3tFCFtiCqEwyardENBQNpHqxgzbMw8uKeZEw2nRG5"),  // requests
  new PublicKey("36c6YqAwyGKQG66XEp2dJc5JqjaBNv7sVghEtJv4c7u6"),  // vaultA
  new PublicKey("8CFo8bL8mZQK8abbFyypFMwEDd8tVJjHTTojMLgQTUSZ"),  // vaultB
  new PublicKey("F8Vyqk3unwxkXukZFQeYyGmFfTG3CAX4v24iyrjEYBJV"),  // vaultSigner
);