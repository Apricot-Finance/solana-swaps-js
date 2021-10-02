import { PublicKey, SYSVAR_CLOCK_PUBKEY, TransactionInstruction } from "@solana/web3.js";
import { Market, PairMarket, Swapper, TokenID } from "../types";
import { Parser } from "../utils/Parser";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";

export const SABER_SWAP_PROGRAM = new PublicKey("SSwpkEEcbUqx4vtoEByFjSkhKdCT862DNVb52nZg1UZ");

export class SaberMarket extends Market implements Swapper, PairMarket {
  constructor(
    public name: string,
    public tokenIdA: TokenID,
    public tokenIdB: TokenID,
    public swap: PublicKey,
    public swapAuthority: PublicKey,
    public vaultA: PublicKey,
    public vaultB: PublicKey,
    public fees: PublicKey,
  ) {
    super(name, [tokenIdA, tokenIdB]);
  }

  getSwapper() : Swapper {
    return this;
  }

  INST_LAYOUT = new Parser()
    .u8("cmd")
    .u64("in_amount")
    .u64("min_out_amount");

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
      cmd: 1, 
      in_amount: fromAmount, 
      min_out_amount: minToAmount
    });

    const poolSource = fromToken === this.tokenIdA ? this.vaultA : this.vaultB;
    const poolDest = toToken === this.tokenIdA ? this.vaultA : this.vaultB;

    const ix = new TransactionInstruction({
      programId: SABER_SWAP_PROGRAM, 
      keys: [
        {pubkey: this.swap,             isSigner: false, isWritable: false},
        {pubkey: this.swapAuthority,    isSigner: false, isWritable: false},
        {pubkey: tradeOwner,            isSigner: true,  isWritable: false},
        {pubkey: fromTokenAccount,      isSigner: false, isWritable: true},
        {pubkey: poolSource,            isSigner: false, isWritable: true},
        {pubkey: poolDest,              isSigner: false, isWritable: true},
        {pubkey: toTokenAccount,        isSigner: false, isWritable: true},
        {pubkey: this.fees,             isSigner: false, isWritable: true},
        {pubkey: TOKEN_PROGRAM_ID,      isSigner: false, isWritable: false},
        {pubkey: SYSVAR_CLOCK_PUBKEY,   isSigner: false, isWritable: false},
      ],
      data: buffer,
    });

    return [ix];
  }
}

export const SABER_USTv1_USDC_MARKET = new SaberMarket(
  "UST/USDC",
  TokenID.UST,
  TokenID.USDC,

  new PublicKey("7oAd7xG4m3oC2qeWB1szghTebAZyyGPAFDJ4wwwbRSNi"), // swap
  new PublicKey("ASpJBf8HtyrNxaMqFNpjYCqi8SsJC5h56hd3HQUNk6M7"), // swapAuthority
  new PublicKey("HDYfJLpZKaMFb84jM4mRytn7XLR8UFZUnQpSfhJJaNEy"), // vaultA
  new PublicKey("D9yh4KAysxt9GLacVe4Wwh2XqghhcjTCSTV9HuM7TBJd"), // vaultB
  new PublicKey("H8sa4bG8oWg89vHQeZnwzumqTk2gnRWKb19LzZgge3W6"), // fees
)
