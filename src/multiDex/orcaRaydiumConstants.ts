import { PublicKey, TransactionInstruction } from "@solana/web3.js";
import { MultiMarket, PairMarket, MultiSwapper, TokenID} from "../types";
import { OrcaMarket, ORCA_MNDE_mSOL_MARKET} from "../orca";
import { RaydiumMarket, RAYDIUM_mSOL_USDC_MARKET } from "../raydium";
import { DECIMALS } from "../mints";

export class OrcaRaydiumMarket extends MultiMarket implements MultiSwapper, PairMarket {
    constructor(
        public name: string,
        public tokenIdA: TokenID,
        public tokenIdM: TokenID,
        public tokenIdB: TokenID,
        public orcaMarket: OrcaMarket,
        public raydiumMarket: RaydiumMarket,
    ) {
        super([orcaMarket, raydiumMarket]);
    }

    async createMultiSwapInstructions(
        fromToken: TokenID,
        fromAmount: number,
        fromTokenAccount: PublicKey,
        middleToken: TokenID,
        middleTokenAccount: PublicKey,
        toToken: TokenID,
        minToAmount: number,
        toTokenAccount: PublicKey,
        tradeOwner: PublicKey,
      ) : Promise<TransactionInstruction[]> {
        // Temparorily support only one direction swap, sell the first tokenIdA
        if (fromToken !== this.tokenIdA) {
            throw new Error(`Buying Token: ${toToken} is not supported`);
        }

        if (middleToken !== this.tokenIdM) {
            throw new Error(`Incorrect Middle Token: ${middleToken}`);
        }

        // TODO: how do I know this without sending a transaction???
        let middleAmount: number = 0;
        let ix = await this.orcaMarket.createSwapInstructions(
            fromToken,
            fromAmount * DECIMALS[fromToken],
            fromTokenAccount,

            middleToken,
            middleAmount,
            middleTokenAccount,
        
            tradeOwner
        );

        let secIx = await this.raydiumMarket.createSwapInstructions(
            middleToken,
            middleAmount * DECIMALS[fromToken],
            middleTokenAccount,

            toToken,
            minToAmount,
            toTokenAccount,
        
            tradeOwner
        )
        ix.concat(secIx);

        return ix;
      }
}

export const ORCA_RAYDIUMN_MNDE_USDC_MARKET = new OrcaRaydiumMarket(
    "MNDE/mSOL/USDC",
    TokenID.MNDE,
    TokenID.mSOL,
    TokenID.USDC,
    ORCA_MNDE_mSOL_MARKET,
    RAYDIUM_mSOL_USDC_MARKET,
);
