import { PublicKey, TransactionInstruction } from "@solana/web3.js";
import { Market, PairMarket, Swapper, TokenID } from "../types";
import { Parser } from "../utils/Parser";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";

export const MERCURIAL_SWAP_PROGRAM = new PublicKey("MERLuDFBMmsHnsBPZw2sDQZHvXFMwp8EdjudcU2HKky");

export class MercurialMarket extends Market implements Swapper, PairMarket {
  constructor(
    public name: string,
    public tokenIdA: TokenID,
    public tokenIdB: TokenID,
    public swap: PublicKey,
    public swapAuthority: PublicKey,
    public vaultA: PublicKey,
    public vaultB: PublicKey,
    public vaultC: PublicKey,
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
    _fromToken: TokenID,
    fromAmount: number,
    fromTokenAccount: PublicKey,
    _toToken: TokenID,
    minToAmount: number,
    toTokenAccount: PublicKey,
    tradeOwner: PublicKey,
  ) : Promise<TransactionInstruction[]> {

    const buffer = this.INST_LAYOUT.encode({
      cmd: 4, 
      in_amount: fromAmount, 
      min_out_amount: minToAmount
    });

    const ix = new TransactionInstruction({
      programId: MERCURIAL_SWAP_PROGRAM, 
      keys: [
        {pubkey: this.swap,             isSigner: false, isWritable: false},
        {pubkey: TOKEN_PROGRAM_ID,      isSigner: false, isWritable: false},
        {pubkey: this.swapAuthority,    isSigner: false, isWritable: false},
        {pubkey: tradeOwner,            isSigner: true,  isWritable: false},
        {pubkey: this.vaultA,           isSigner: false, isWritable: true},
        {pubkey: this.vaultB,           isSigner: false, isWritable: true},
        {pubkey: this.vaultC,           isSigner: false, isWritable: true},
        // below 2 accounts on solscan are displayed incorrectly but on solana exporer
        {pubkey: fromTokenAccount,      isSigner: false, isWritable: true},
        {pubkey: toTokenAccount,        isSigner: false, isWritable: true},
      ],
      data: buffer,
    });

    return [ix];
  }
}

export const MERCURIAL_USTv1_USDC_MARKET = new MercurialMarket(
  "UST/USDC",
  TokenID.UST,
  TokenID.USDC,

  new PublicKey("USD6kaowtDjwRkN5gAjw1PDMQvc9xRp8xW9GK8Z5HBA"), // swap Mercurial UST 3-Pool (USDC-USDT-UST)
  new PublicKey("FDonWCo5RJhx8rzSwtToUXiLEL7dAqLmUhnyH76F888D"), // swapAuthority
  new PublicKey("Go93HBNLMK6QnSHyZTViAoti9GCmSRhkeZMiVoJmcrud"), // vaultA
  new PublicKey("2uZVPMdS8VFwMEZjZNzP1f78m1zaqvT3R2JwMs1w9fU3"), // vaultB
  new PublicKey("5nazSj6MfaEeuAoQezMG3raWuZiyFjE7fmURUgDeP8cF"), // vaultC 
)
