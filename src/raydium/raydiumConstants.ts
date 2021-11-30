import { PublicKey, TransactionInstruction } from "@solana/web3.js";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import {Market, PairMarket, Swapper, TokenID} from "../types";
import { MINTS } from "../mints";
import { SERUM_PROGRAM } from "../serum/serumConstants";
import { Parser } from "../utils/Parser";

export const RAYDIUM_AMM_PROGRAM = new PublicKey("675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8");

export class RaydiumMarket extends Market implements Swapper, PairMarket {
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
    _fromToken: TokenID,
    fromAmount: number,
    fromTokenAccount: PublicKey,
    _toToken: TokenID,
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
  new PublicKey("HRk9CMrpq7Jn9sh7mzxE8CChHG8dneX9p475QKz4Fsfc"),  // openOrders
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

export const RAYDIUM_RAY_USDC_MARKET = new RaydiumMarket(
  "RAY/USDC", 
  TokenID.RAY, 
  TokenID.USDC, 
  new PublicKey("6UmmUiYoBjSrhakAobJw8BvkmJtDVxaeBtbt7rxWo1mg"),  // amm
  new PublicKey("5Q544fKrFoe6tsEbD7S8EmxGTJYAKtTVhAW5Q5pge4j1"),  // ammAuthority
  new PublicKey("J8u8nTHYtvudyqwLrXZboziN95LpaHFHpd97Jm5vtbkW"),  // openOrders
  new PublicKey("3cji8XW5uhtsA757vELVFAeJpskyHwbnTSceMFY5GjVT"),  // targetOrders
  new PublicKey("FdmKUE4UMiJYFK5ogCngHzShuVKrFXBamPWcewDr31th"),  // vaultA
  new PublicKey("Eqrhxd7bDUCH3MepKmdVkgwazXRzY6iHhEoBpY7yAohk"),  // vaultB

  new PublicKey("2xiv8A5xrJ7RnGdxXB42uFEkYHJjszEhaJyKKt4WaLep"),  // market
  new PublicKey("Hf84mYadE1VqSvVWAvCWc9wqLXak4RwXiPb4A91EAUn5"),  // bids
  new PublicKey("DC1HsWWRCXVg3wk2NndS5LTbce3axwUwUZH1RgnV4oDN"),  // asks
  new PublicKey("H9dZt8kvz1Fe5FyRisb77KcYTaN8LEbuVAfJSnAaEABz"),  // events
  new PublicKey("GGcdamvNDYFhAXr93DWyJ8QmwawUHLCyRqWL3KngtLRa"),  // vaultA
  new PublicKey("22jHt5WmosAykp3LPGSAKgY45p7VGh4DFWSwp21SWBVe"),  // vaultB
  new PublicKey("FmhXe9uG6zun49p222xt3nG1rBAkWvzVz7dxERQ6ouGw"),  // vaultSigner
)

export const RAYDIUM_mSOL_USDC_MARKET = new RaydiumMarket(
  "mSOL/USDC", 
  TokenID.mSOL, 
  TokenID.USDC, 
  new PublicKey("ZfvDXXUhZDzDVsapffUyXHj9ByCoPjP4thL6YXcZ9ix"),   // amm
  new PublicKey("5Q544fKrFoe6tsEbD7S8EmxGTJYAKtTVhAW5Q5pge4j1"),  // ammAuthority
  new PublicKey("4zoatXFjMSirW2niUNhekxqeEZujjC1oioKCEJQMLeWF"),  // openOrders
  new PublicKey("Kq9Vgb8ntBzZy5doEER2p4Zpt8SqW2GqJgY5BgWRjDn"),   // targetOrders
  new PublicKey("8JUjWjAyXTMB4ZXcV7nk3p6Gg1fWAAoSck7xekuyADKL"),  // vaultA
  new PublicKey("DaXyxj42ZDrp3mjrL9pYjPNyBp5P8A2f37am4Kd4EyrK"),  // vaultB

  new PublicKey("6oGsL2puUgySccKzn9XA9afqF217LfxP5ocq4B3LWsjy"),  // market
  new PublicKey("8qyWhEcpuvEsdCmY1kvEnkTfgGeWHmi73Mta5jgWDTuT"),  // bids
  new PublicKey("PPnJy6No31U45SVSjWTr45R8Q73X6bNHfxdFqr2vMq3"),   // asks
  new PublicKey("BC8Tdzz7rwvuYkJWKnPnyguva27PQP5DTxosHVQrEzg9"),  // events
  new PublicKey("2y3BtF5oRBpLwdoaGjLkfmT3FY3YbZCKPbA9zvvx8Pz7"),  // vaultA
  new PublicKey("6w5hF2hceQRZbaxjPJutiWSPAFWDkp3YbY2Aq3RpCSKe"),  // vaultB
  new PublicKey("9dEVMESKXcMQNndoPc5ji9iTeDJ9GfToboy8prkZeT96"),  // vaultSigner
)

export const RAYDIUM_APT_USDC_MARKET = new RaydiumMarket(
  "APT/USDC", 
  TokenID.APT, 
  TokenID.USDC, 
  new PublicKey("4crhN3D8R5rnZd66q9b32P7K649e5XdzCfPMPiTzBceH"),   // amm
  new PublicKey("5Q544fKrFoe6tsEbD7S8EmxGTJYAKtTVhAW5Q5pge4j1"),  // ammAuthority
  new PublicKey("9ZkyYVUKZ3iWZnx6uJNUNKdv3NW3WcKNWZMg2YDYTxSx"),  // openOrders
  new PublicKey("FWKNVdavvUKdcpCCU3XT1dsCEbHF1ak21q2EzoyMy1av"),   // targetOrders
  new PublicKey("6egmkyieHa2R2TiVoLkwmy3fXG1F8EG8KmEMBN2Lahh7"),  // vaultA
  new PublicKey("4dcKsdDe39Yp4NDzko1Jv6ViSDo2AUMh2KGxT6giidpA"),  // vaultB

  new PublicKey("ATjWoJDChATL7E5WVeSk9EsoJAhZrHjzCZABNx3Miu8B"),  // market
  new PublicKey("5M3bbs43jpQWkXccVbny317rKFFq9bZT3ccv3YoLSwRd"),  // bids
  new PublicKey("EZYkKSRfdqbQbwBrVmkkWXmosYFB4cVhcT4jLT3Qjfxt"),   // asks
  new PublicKey("7tnT8FCXaN5zryRpjJieFHLLVBUtZYR3LhYDh3da9HJh"),  // events
  new PublicKey("GesJe56oHgbA9gTxNz5BFGXxhGdScteKNdmYeLj6PBmq"),  // vaultA
  new PublicKey("GvjFcsncRnqfmRig7kkgoeur7QzkZaPurpHHyWyeriNu"),  // vaultB
  new PublicKey("Hfn1km6sEcBnQ6S1SLYsJZkwQzx7kJJ9o8UqwWhPNiW3"),  // vaultSigner
)

export const RAYDIUM_SRM_USDC_MARKET = new RaydiumMarket(
  "SRM/USDC", 
  TokenID.SRM, 
  TokenID.USDC, 
  new PublicKey("8tzS7SkUZyHPQY7gLqsMCXZ5EDCgjESUHcB17tiR1h3Z"),   // amm
  new PublicKey("5Q544fKrFoe6tsEbD7S8EmxGTJYAKtTVhAW5Q5pge4j1"),  // ammAuthority
  new PublicKey("GJwrRrNeeQKY2eGzuXGc3KBrBftYbidCYhmA6AZj2Zur"),  // openOrders
  new PublicKey("26LLpo8rscCpMxyAnJsqhqESPnzjMGiFdmXA4eF2Jrk5"),   // targetOrders
  new PublicKey("zuLDJ5SEe76L3bpFp2Sm9qTTe5vpJL3gdQFT5At5xXG"),  // vaultA
  new PublicKey("4usvfgPDwXBX2ySX11ubTvJ3pvJHbGEW2ytpDGCSv5cw"),  // vaultB

  new PublicKey("ByRys5tuUWDgL73G8JBAEfkdFf8JWBzPBDHsBVQ5vbQA"),  // market
  new PublicKey("AuL9JzRJ55MdqzubK4EutJgAumtkuFcRVuPUvTX39pN8"),  // bids
  new PublicKey("8Lx9U9wdE3afdqih1mCAXy3unJDfzSaXFqAvoLMjhwoD"),   // asks
  new PublicKey("6o44a9xdzKKDNY7Ff2Qb129mktWbsCT4vKJcg2uk41uy"),  // events
  new PublicKey("Ecfy8et9Mft9Dkavnuh4mzHMa2KWYUbBTA5oDZNoWu84"),  // vaultA
  new PublicKey("hUgoKy5wjeFbZrXDW4ecr42T4F5Z1Tos31g68s5EHbP"),  // vaultB
  new PublicKey("GVV4ZT9pccwy9d17STafFDuiSqFbXuRTdvKQ1zJX6ttX"),  // vaultSigner
)