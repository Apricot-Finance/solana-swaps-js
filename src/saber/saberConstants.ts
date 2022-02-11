import { PublicKey, SYSVAR_CLOCK_PUBKEY, TransactionInstruction } from "@solana/web3.js";
import { Market, PairMarket, Swapper, TokenID } from "../types";
import { Parser } from "../utils/Parser";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import invariant from "tiny-invariant";

export const SABER_SWAP_PROGRAM = new PublicKey("SSwpkEEcbUqx4vtoEByFjSkhKdCT862DNVb52nZg1UZ");

export class SaberMarket extends Market implements Swapper, PairMarket {
  constructor(
    public name: string,
    public tokenIdA: TokenID,
    public tokenIdB: TokenID,
    public swap: PublicKey,
    public swapAuthority: PublicKey,
    public swapVaultA: PublicKey,
    public swapVaultB: PublicKey,
    public adminFeeDestinationA: PublicKey,
    public adminFeeDestinationB: PublicKey,
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

    invariant([this.tokenIdA, this.tokenIdB].includes(fromToken));
    invariant([this.tokenIdA, this.tokenIdB].includes(toToken));

    const buffer = this.INST_LAYOUT.encode({
      cmd: 1,
      in_amount: fromAmount, 
      min_out_amount: minToAmount
    });
    
    const swapSource = fromToken === this.tokenIdA ? this.swapVaultA : this.swapVaultB;
    const swapDestination = toToken === this.tokenIdB ? this.swapVaultB : this.swapVaultA;
    const adminFeeDestination = toToken === this.tokenIdB ? this.adminFeeDestinationB : this.adminFeeDestinationA;

    const ix = new TransactionInstruction({
      programId: SABER_SWAP_PROGRAM,
      keys: [
        {pubkey: this.swap,                isSigner: false, isWritable: false},
        {pubkey: this.swapAuthority,       isSigner: false, isWritable: false},
        {pubkey: tradeOwner,               isSigner: true,  isWritable: false},
        {pubkey: fromTokenAccount,         isSigner: false, isWritable: true},
        {pubkey: swapSource,               isSigner: false, isWritable: true},
        {pubkey: swapDestination,          isSigner: false, isWritable: true},
        {pubkey: toTokenAccount,           isSigner: false, isWritable: true},
        {pubkey: adminFeeDestination,      isSigner: false, isWritable: true},
        {pubkey: TOKEN_PROGRAM_ID,         isSigner: false, isWritable: false},
        {pubkey: SYSVAR_CLOCK_PUBKEY,      isSigner: false, isWritable: false},
      ],
      data: buffer,
    });

    return [ix];
  }
}

export const SABER_USTv2_USDC_MARKET = new SaberMarket(
  "USTv2/USDC",
  TokenID.USTv2,
  TokenID.USDC,

  new PublicKey("KwnjUuZhTMTSGAaavkLEmSyfobY16JNH4poL9oeeEvE"), // swap
  new PublicKey("9osV5a7FXEjuMujxZJGBRXVAyQ5fJfBFNkyAf6fSz9kw"), // swapAuthority
  new PublicKey("J63v6qEZmQpDqCD8bd4PXu2Pq5ZbyXrFcSa3Xt1HdAPQ"), // USTv2 valut
  new PublicKey("BnKQtTdLw9qPCDgZkWX3sURkBAoKCUYL1yahh6Mw7mRK"), // USDC vault
  new PublicKey("BYgyVxdrGa3XNj1cx1XHAVyRG8qYhBnv1DS59Bsvmg5h"), // USTv2 admin fee dest
  new PublicKey("G9nt2GazsDj3Ey3KdA49Sfaq9K95Dc72Ejps4NKTP2SR"), // USDC admin fee dest
);

export const SABER_USDT_USDC_MARKET = new SaberMarket(
  "USDT/USDC",
  TokenID.USDT,
  TokenID.USDC,

  new PublicKey("YAkoNb6HKmSxQN9L8hiBE5tPJRsniSSMzND1boHmZxe"), // swap
  new PublicKey("5C1k9yV7y4CjMnKv8eGYDgWND8P89Pdfj79Trk2qmfGo"), // swapAuthority
  new PublicKey("EnTrdMMpdhugeH6Ban6gYZWXughWxKtVGfCwFn78ZmY3"), // USDT valut
  new PublicKey("CfWX7o2TswwbxusJ4hCaPobu2jLCb1hfXuXJQjVq3jQF"), // USDC vault
  new PublicKey("63aJYYuZddSnCGyE8FNrCVQWnXhjh6CQSRwcDeSMhdVC"), // USDT admin fee dest
  new PublicKey("XZuQG7CQrAA6y6tHM9CLrDjDUWwuUU2SBoV7pLaGDQT"), // USDC admin fee dest
);
