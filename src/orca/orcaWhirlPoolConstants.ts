import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { Connection, PublicKey, TransactionInstruction } from '@solana/web3.js';
import { Market, PairMarket, Swapper, TokenID } from '../types';
import { Parser } from '../utils/Parser';
import {
  AccountFetcher,
  MAX_SQRT_PRICE,
  MIN_SQRT_PRICE,
  PDAUtil,
  SwapUtils,
} from '@orca-so/whirlpools-sdk';
import { MathUtil } from '@orca-so/common-sdk';
import invariant from 'tiny-invariant';
import Decimal from 'decimal.js';
import { MINTS } from '../mints';
import connection from '../utils/connection';

/*
 https://discord.com/channels/798712664590254081/978426739854307398/1037925971891855390
 In Orca's whirlpool, fee rate and tick_spacing have the following relationship.
 The same pair will have different addresses due to different tick_spacing.

  0.01% : 1
  0.05% : 8
  0.3% : 64
  1.0% : 128

  https://api.mainnet.orca.so/v1/whirlpool/list
 */

export const ORCA_WHIRL_POOL_PROGRAM = new PublicKey('whirLbMiicVdio4qvUfM5KAg6Ct8VwpYzGff3uctyCc');
export const ORCA_WHIRL_POOL_CONFIG_PUBKEY = new PublicKey(
  '2LecshUwdy9xi7meFgHtFJQNSKk4KdTrcpvaB56dP2NQ',
);

enum TickSpacing {
  Standard = 64,
  Stable = 1,
}

export class OrcaWhirlPoolMarket extends Market implements Swapper, PairMarket {
  private connection: Connection;
  constructor(
    public name: string,
    public tokenIdA: TokenID,
    public tokenIdB: TokenID,

    public tickSpacing: number = TickSpacing.Standard,
  ) {
    super(name, [tokenIdA, tokenIdB]);
    this.connection = connection;
  }

  getSwapper(): Swapper {
    return this;
  }

  INST_LAYOUT = new Parser()
    .u64('cmd')
    .u64('amount')
    .u64('other_amount_threshold')
    .u128('sqrt_price_limit')
    .u8('amount_specified_is_input')
    .u8('a_to_b');

  async createSwapInstructions(
    fromToken: TokenID,
    fromAmount: number,
    fromTokenAccount: PublicKey,
    toToken: TokenID,
    minToAmount: number,
    toTokenAccount: PublicKey,
    tradeOwner: PublicKey,
    sqrtPriceLimit?: number,
  ): Promise<TransactionInstruction[]> {
    const isAToB = fromToken === this.tokenIdA;

    invariant(
      (isAToB && toToken === this.tokenIdB) ||
        (!isAToB && toToken === this.tokenIdA && fromToken === this.tokenIdB),
      `Invalid fromToken ${fromToken} or toToken ${toToken}`,
    );

    const tokenAMint = MINTS[this.tokenIdA];
    const tokenBMint = MINTS[this.tokenIdB];

    const whirlpoolAddress = PDAUtil.getWhirlpool(
      ORCA_WHIRL_POOL_PROGRAM,
      ORCA_WHIRL_POOL_CONFIG_PUBKEY,
      tokenAMint,
      tokenBMint,
      this.tickSpacing,
    ).publicKey;

    const fetcher = new AccountFetcher(this.connection);
    const whirlpoolData = await fetcher.getPool(whirlpoolAddress);

    invariant(whirlpoolData, 'Empty whirl pool data');

    const tickArrays = await SwapUtils.getTickArrays(
      whirlpoolData.tickCurrentIndex,
      whirlpoolData.tickSpacing,
      isAToB,
      ORCA_WHIRL_POOL_PROGRAM,
      whirlpoolAddress,
      fetcher,
      true,
    );

    invariant(tickArrays.length === 3, 'Tick arrays length invalid');

    const orcalePda = PDAUtil.getOracle(ORCA_WHIRL_POOL_PROGRAM, whirlpoolAddress);

    let sqrt_price_limit: bigint;
    if (typeof sqrtPriceLimit === 'number') {
      sqrt_price_limit = BigInt(MathUtil.toX64(new Decimal(sqrtPriceLimit)).toString());
    } else if (isAToB) {
      sqrt_price_limit = BigInt(MIN_SQRT_PRICE);
    } else {
      sqrt_price_limit = BigInt(MAX_SQRT_PRICE);
    }

    const buffer = this.INST_LAYOUT.encode({
      cmd: 0xc88775e1919ec6f8n,
      amount: fromAmount,
      amount_specified_is_input: 1,
      other_amount_threshold: minToAmount,
      sqrt_price_limit: sqrt_price_limit,
      a_to_b: isAToB ? 1 : 0,
    });

    const tokenAAccount = isAToB ? fromTokenAccount : toTokenAccount;
    const tokenBAccount = isAToB ? toTokenAccount : fromTokenAccount;

    const ix = new TransactionInstruction({
      programId: ORCA_WHIRL_POOL_PROGRAM,
      keys: [
        { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
        { pubkey: tradeOwner, isSigner: true, isWritable: true },
        { pubkey: whirlpoolAddress, isSigner: false, isWritable: true },

        { pubkey: tokenAAccount, isSigner: false, isWritable: true },
        { pubkey: whirlpoolData.tokenVaultA, isSigner: false, isWritable: true },
        { pubkey: tokenBAccount, isSigner: false, isWritable: true },
        { pubkey: whirlpoolData.tokenVaultB, isSigner: false, isWritable: true },

        { pubkey: tickArrays[0].address, isSigner: false, isWritable: true },
        { pubkey: tickArrays[1].address, isSigner: false, isWritable: true },
        { pubkey: tickArrays[2].address, isSigner: false, isWritable: true },
        { pubkey: orcalePda.publicKey, isSigner: false, isWritable: false },
      ],
      data: buffer,
    });

    return [ix];
  }
}

export const ORCA_SOL_USDC_WHIRL_MARKET = new OrcaWhirlPoolMarket(
  'SOL/USDC',
  TokenID.SOL,
  TokenID.USDC,
);

export const ORCA_ORCA_USDC_WHIRL_MARKET = new OrcaWhirlPoolMarket(
  'ORCA/USDC',
  TokenID.ORCA,
  TokenID.USDC,
);
