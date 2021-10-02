import { PublicKey, TransactionInstruction } from "@solana/web3.js";
import { Market, PairMarket, Swapper, TokenID } from "../types";
import { Parser } from "../utils/Parser";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";

export const ORCA_SWAP_PROGRAM = new PublicKey("9W959DqEETiGZocYWCQPaJ6sBmUzgfxXfqGeTEdp3aQP");

export class OrcaMarket extends Market implements Swapper, PairMarket {
  constructor(
    public name: string,
    public tokenIdA: TokenID,
    public tokenIdB: TokenID,
    public swap: PublicKey,
    public swapAuthority: PublicKey,
    public vaultA: PublicKey,
    public vaultB: PublicKey,
    public poolMint: PublicKey,
    public fees: PublicKey,
  ) {
    super(name, [tokenIdA, tokenIdB]);
  }

  getSwapper(_args: any) : Swapper {
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
      programId: ORCA_SWAP_PROGRAM, 
      keys: [
        {pubkey: this.swap,             isSigner: false, isWritable: false},
        {pubkey: this.swapAuthority,    isSigner: false, isWritable: false},
        {pubkey: tradeOwner,            isSigner: true,  isWritable: false},
        {pubkey: fromTokenAccount,      isSigner: false, isWritable: true},
        {pubkey: poolSource,            isSigner: false, isWritable: true},
        {pubkey: poolDest,              isSigner: false, isWritable: true},
        {pubkey: toTokenAccount,        isSigner: false, isWritable: true},
        {pubkey: this.poolMint,         isSigner: false, isWritable: true},
        {pubkey: this.fees,             isSigner: false, isWritable: true},
        {pubkey: TOKEN_PROGRAM_ID,      isSigner: false, isWritable: false},
      ],
      data: buffer,
    });

    return [ix];
  }
}

export const ORCA_USDT_USDC_MARKET = new OrcaMarket(
  "USDT/USDC",
  TokenID.USDT,
  TokenID.USDC,

  new PublicKey("F13xvvx45jVGd84ynK3c8T89UejQVxjCLtmHfPmAXAHP"), // swap
  new PublicKey("3cGHDS8uWhdxQj14vTmFtYHX3NMouPpE4o9MjQ43Bbf4"), // swapAuthority
  new PublicKey("AiwmnLy7xPT28dqZpkRm6i1ZGwELUCzCsuN92v4JkSeU"), // vaultA
  new PublicKey("6uUn2okWk5v4x9Gc4n2LLGHtWoa9tmizHq1363dW7t9W"), // vaultB
  new PublicKey("H2uzgruPvonVpCRhwwdukcpXK8TG17swFNzYFr2rtPxy"), // poolMint
  new PublicKey("B4RNxMJGRzKFQyTq2Uwkmpyjtew13n7KtdqZy6qgENTu"), // fees
)

export const ORCA_SBR_USDC_MARKET = new OrcaMarket(
  "SBR/USDC",
  TokenID.SBR,
  TokenID.USDC,

  new PublicKey("HiYggjP2fN53Jw46e5UuskqNP3HH98jceRxEgVoeRwNw"), // swap
  new PublicKey("ATkEV1nEkdp7zgaGpzFCsJ5WAyejcJbxqzGhQpfcDW4S"), // swapAuthority
  new PublicKey("DrJTQqNZqNCf2HDLpYg9zRCMRwnhZEVQuGjeaWtX6CA7"), // vaultA
  new PublicKey("DEVLUv1uiUSukQoBdy9fDQyehi4N2Boojy8J2LQ8bK2E"), // vaultB
  new PublicKey("CS7fA5n4c2D82dUoHrYzS3gAqgqaoVSfgsr18kitp2xo"), // poolMint
  new PublicKey("7S3KKuvcHfcKWBGLDwmoTgtB97JE8LHruP8jbmQkGfH"), // fees
)

export const ORCA_ORCA_USDC_MARKET = new OrcaMarket(
  "ORCA/USDC",
  TokenID.ORCA,
  TokenID.USDC,

  new PublicKey("2p7nYbtPBgtmY69NsE8DAW6szpRJn7tQvDnqvoEWQvjY"), // swap
  new PublicKey("3fr1AhdiAmWLeNrS24CMoAu9pPgbzVhwLtJ6QUPmw2ob"), // swapAuthority
  new PublicKey("9vYWHBPz817wJdQpE8u3h8UoY3sZ16ZXdCcvLB7jY4Dj"), // vaultA
  new PublicKey("6UczejMUv1tzdvUzKpULKHxrK9sqLm8edR1v9jinVWm9"), // vaultB
  new PublicKey("n8Mpu28RjeYD7oUX3LG1tPxzhRZh3YYLRSHcHRdS3Zx"), // poolMint
  new PublicKey("7CXZED4jfRp3qdHB9Py3up6v1C4UhHofFvfT6RXbJLRN"), // fees
)