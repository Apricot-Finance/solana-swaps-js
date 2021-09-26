import { PublicKey, TransactionInstruction } from "@solana/web3.js";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import {Market, Swapper, TokenID} from "../types";
import { MINTS } from "../mints";
import { SERUM_PROGRAM } from "../serum/serumConstants";
import { Parser } from "../utils/Parser";

export const RAYDIUM_AMM_PROGRAM = new PublicKey("675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8");

export class RaydiumMarket extends Market implements Swapper {
  mintA: PublicKey;
  mintB: PublicKey;

  INST_LAYOUT = new Parser()
    .u8("cmd")
    .u64("in_amount")
    .u64("min_out_amount");
  constructor(
    name: string,
    public tokenIdA: TokenID,
    public tokenIdB: TokenID,
    public amm: PublicKey,
    public ammAuthority: PublicKey,
    public openOrders: PublicKey,
    public targetOrders: PublicKey,
    public raydiumVaultA: PublicKey,
    public raydiumVaultB: PublicKey,
    public serumMarket: PublicKey,
    public serumBids: PublicKey,
    public serumAsks: PublicKey,
    public serumEvents: PublicKey,
    public serumVaultA: PublicKey,
    public serumVaultB: PublicKey,
    public serumVaultSigner: PublicKey,
  ) {
    super(name, [tokenIdA, tokenIdB]);
    if(name !== `${tokenIdA}/${tokenIdB}`) {
      throw new Error("Incorrect name!");
    }
    this.mintA = MINTS[tokenIdA];
    this.mintB = MINTS[tokenIdB];
  }

  getSwapper() : Swapper {
    return this;
  }

  async createSwapInstructions(
    fromToken: TokenID,
    fromAmount: number,
    fromTokenAccount: PublicKey,
    toToken: TokenID,
    minToAmount: number,
    toTokenAccount: PublicKey,
    tradeOwner: PublicKey,
  ) : Promise<TransactionInstruction[]> {
    const buffer = this.INST_LAYOUT.encode({
      cmd: 9, 
      in_amount: fromAmount, 
      min_out_amount: minToAmount
    });

    const ix = new TransactionInstruction({
      programId: RAYDIUM_AMM_PROGRAM, 
      keys: [
        {pubkey: TOKEN_PROGRAM_ID,      isSigner: false, isWritable: false},
        {pubkey: this.amm,              isSigner: false, isWritable: true},
        {pubkey: this.ammAuthority,     isSigner: false, isWritable: false},
        {pubkey: this.openOrders,       isSigner: false, isWritable: true},
        {pubkey: this.targetOrders,     isSigner: false, isWritable: true},
        {pubkey: this.raydiumVaultA,    isSigner: false, isWritable: true},
        {pubkey: this.raydiumVaultB,    isSigner: false, isWritable: true},
        {pubkey: SERUM_PROGRAM,         isSigner: false, isWritable: false},
        {pubkey: this.serumMarket,      isSigner: false, isWritable: true},
        {pubkey: this.serumBids,        isSigner: false, isWritable: true},
        {pubkey: this.serumAsks,        isSigner: false, isWritable: true},
        {pubkey: this.serumEvents,      isSigner: false, isWritable: true},
        {pubkey: this.serumVaultA,      isSigner: false, isWritable: true},
        {pubkey: this.serumVaultB,      isSigner: false, isWritable: true},
        {pubkey: this.serumVaultSigner, isSigner: false, isWritable: false},
        {pubkey: fromTokenAccount,      isSigner: false, isWritable: true},
        {pubkey: toTokenAccount,        isSigner: false, isWritable: true},
        {pubkey: tradeOwner,            isSigner: true,  isWritable: false},
      ],
      data: buffer,
    });

    return [ix];
  }

}


export const RAYDIUM_BTC_USDC_MARKET = new RaydiumMarket(
  "BTC/USDC", 
  TokenID.BTC, 
  TokenID.USDC, 
  new PublicKey("6kbC5epG18DF2DwPEW34tBy5pGFS7pEGALR3v5MGxgc5"),  // amm
  new PublicKey("5Q544fKrFoe6tsEbD7S8EmxGTJYAKtTVhAW5Q5pge4j1"),  // ammAuthority
  new PublicKey("L6A7qW935i2HgaiaRx6xNGCGQfFr4myFU51dUSnCshd"),   // openOrders
  new PublicKey("6DGjaczWfFthTYW7oBk3MXP2mMwrYq86PA3ki5YF6hLg"),  // targetOrders
  new PublicKey("HWTaEDR6BpWjmyeUyfGZjeppLnH7s8o225Saar7FYDt5"),  // vaultA
  new PublicKey("7iGcnvoLAxthsXY3AFSgkTDoqnLiuti5fyPNm2VwZ3Wz"),  // vaultB

  new PublicKey("A8YFbxQYFVqKZaoYJLLUVcQiWP7G2MeEgW5wsAQgMvFw"),  // market
  new PublicKey("6wLt7CX1zZdFpa6uGJJpZfzWvG6W9rxXjquJDYiFwf9K"),  // bids
  new PublicKey("6EyVXMMA58Nf6MScqeLpw1jS12RCpry23u9VMfy8b65Y"),  // asks
  new PublicKey("6NQqaa48SnBBJZt9HyVPngcZFW81JfDv9EjRX2M4WkbP"),  // events
  new PublicKey("GZ1YSupuUq9kB28kX9t1j9qCpN67AMMwn4Q72BzeSpfR"),  // vaultA
  new PublicKey("7sP9fug8rqZFLbXoEj8DETF81KasaRA1fr6jQb6ScKc5"),  // vaultB
  new PublicKey("GBWgHXLf1fX4J1p5fAkQoEbnjpgjxUtr4mrVgtj9wW8a"),  // vaultSigner
);

export const RAYDIUM_ETH_USDC_MARKET = new RaydiumMarket(
  "ETH/USDC", 
  TokenID.ETH, 
  TokenID.USDC, 
  new PublicKey("AoPebtuJC4f2RweZSxcVCcdeTgaEXY64Uho8b5HdPxAR"),  // amm
  new PublicKey("5Q544fKrFoe6tsEbD7S8EmxGTJYAKtTVhAW5Q5pge4j1"),  // ammAuthority
  new PublicKey("7PwhFjfFaYp7w9N8k2do5Yz7c1G5ebp3YyJRhV4pkUJW"),   // openOrders
  new PublicKey("BV2ucC7miDqsmABSkXGzsibCVWBp7gGPcvkhevDSTyZ1"),  // targetOrders
  new PublicKey("EHT99uYfAnVxWHPLUMJRTyhD4AyQZDDknKMEssHDtor5"),  // vaultA
  new PublicKey("58tgdkogRoMsrXZJubnFPsFmNp5mpByEmE1fF6FTNvDL"),  // vaultB

  new PublicKey("4tSvZvnbyzHXLMTiFonMyxZoHmFqau1XArcRCVHLZ5gX"),  // market
  new PublicKey("8tFaNpFPWJ8i7inhKSfAcSestudiFqJ2wHyvtTfsBZZU"),  // bids
  new PublicKey("2po4TC8qiTgPsqcnbf6uMZRMVnPBzVwqqYfHP15QqREU"),  // asks
  new PublicKey("Eac7hqpaZxiBtG4MdyKpsgzcoVN6eMe9tAbsdZRYH4us"),  // events
  new PublicKey("7Nw66LmJB6YzHsgEGQ8oDSSsJ4YzUkEVAvysQuQw7tC4"),  // vaultA
  new PublicKey("EsDTx47jjFACkBhy48Go2W7AQPk4UxtT4765f3tpK21a"),  // vaultB
  new PublicKey("C5v68qSzDdGeRcs556YoEMJNsp8JiYEiEhw2hVUR8Z8y"),  // vaultSigner
)

export const RAYDIUM_SOL_USDC_MARKET = new RaydiumMarket(
  "SOL/USDC", 
  TokenID.SOL, 
  TokenID.USDC, 
  new PublicKey("58oQChx4yWmvKdwLLZzBi4ChoCc2fqCUWBkwMihLYQo2"),  // amm
  new PublicKey("5Q544fKrFoe6tsEbD7S8EmxGTJYAKtTVhAW5Q5pge4j1"),  // ammAuthority
  new PublicKey("HRk9CMrpq7Jn9sh7mzxE8CChHG8dneX9p475QKz4Fsfc"),   // openOrders
  new PublicKey("CZza3Ej4Mc58MnxWA385itCC9jCo3L1D7zc3LKy1bZMR"),  // targetOrders
  new PublicKey("DQyrAcCrDXQ7NeoqGgDCZwBvWDcYmFCjSb9JtteuvPpz"),  // vaultA
  new PublicKey("HLmqeL62xR1QoZ1HKKbXRrdN1p3phKpxRMb2VVopvBBz"),  // vaultB

  new PublicKey("9wFFyRfZBsuAha4YcuxcXLKwMxJR43S7fPfQLusDBzvT"),  // market
  new PublicKey("14ivtgssEBoBjuZJtSAPKYgpUK7DmnSwuPMqJoVTSgKJ"),  // bids
  new PublicKey("CEQdAFKdycHugujQg9k2wbmxjcpdYZyVLfV9WerTnafJ"),  // asks
  new PublicKey("5KKsLVU6TcbVDK4BS6K1DGDxnh4Q9xjYJ8XaDCG5t8ht"),  // events
  new PublicKey("36c6YqAwyGKQG66XEp2dJc5JqjaBNv7sVghEtJv4c7u6"),  // vaultA
  new PublicKey("8CFo8bL8mZQK8abbFyypFMwEDd8tVJjHTTojMLgQTUSZ"),  // vaultB
  new PublicKey("F8Vyqk3unwxkXukZFQeYyGmFfTG3CAX4v24iyrjEYBJV"),  // vaultSigner
)