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

export const RAYDIUM_USDT_USDC_MARKET = new RaydiumMarket(
  "USDT/USDC", 
  TokenID.USDT, 
  TokenID.USDC, 
  new PublicKey("7TbGqz32RsuwXbXY7EyBCiAnMbJq1gm1wKmfjQjuwoyF"),  // amm
  new PublicKey("5Q544fKrFoe6tsEbD7S8EmxGTJYAKtTVhAW5Q5pge4j1"),  // ammAuthority
  new PublicKey("6XXvXS3meWqnftEMUgdY8hDWGJfrb8t22x2k1WyVYwhF"),  // openOrders
  new PublicKey("AXY75qWM1t5X16FaeUovd9ZjL1W698cV843sDHV5EMqb"),  // targetOrders
  new PublicKey("Enb9jGaKzgDBfEbbUN3Ytx2ZLoZuBhBpjVX6DULiRmvu"),  // vaultA
  new PublicKey("HyyZpz1JUZjsfyiVSt3qz6E9PkwnBcyhUg4zKGthMNeH"),  // vaultB

  new PublicKey("77quYg4MGneUdjgXCunt9GgM1usmrxKY31twEy3WHwcS"),  // market
  new PublicKey("37m9QdvxmKRdjm3KKV2AjTiGcXMfWHQpVFnmhtb289yo"),  // bids
  new PublicKey("AQKXXC29ybqL8DLeAVNt3ebpwMv8Sb4csberrP6Hz6o5"),  // asks
  new PublicKey("9MgPMkdEHFX7DZaitSh6Crya3kCCr1As6JC75bm3mjuC"),  // events
  new PublicKey("H61Y7xVnbWVXrQQx3EojTEqf3ogKVY5GfGjEn5ewyX7B"),  // vaultA
  new PublicKey("9FLih4qwFMjdqRAGmHeCxa64CgjP1GtcgKJgHHgz44ar"),  // vaultB
  new PublicKey("FGBvMAu88q9d1Csz7ZECB5a2gbWwp6qicNxN2Mo7QhWG"),  // vaultSigner
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

export const RAYDIUM_SBR_USDC_MARKET = new RaydiumMarket(
  "SBR/USDC", 
  TokenID.SBR, 
  TokenID.USDC, 
  new PublicKey("5cmAS6Mj4pG2Vp9hhyu3kpK9yvC7P6ejh9HiobpTE6Jc"),   // amm
  new PublicKey("5Q544fKrFoe6tsEbD7S8EmxGTJYAKtTVhAW5Q5pge4j1"),  // ammAuthority
  new PublicKey("8bEDWrUBqMV7ei55PgySABm8swC9WFW24NB6U5f5sPJT"),  // openOrders
  new PublicKey("G2nswHPqZLXtMimXZtsiLHVZ5gJ9GTiKRdLxahDDdYag"),   // targetOrders
  new PublicKey("8vwzjpW7KPGFLQdRuyoBBoiBCsNG6SLRGssKMNsofch2"),  // vaultA
  new PublicKey("AcK6bv25Q7xofBUiXKwUgueSi3ELS6anMbmNn2NPV8FZ"),  // vaultB

  new PublicKey("HXBi8YBwbh4TXF6PjVw81m8Z3Cc4WBofvauj5SBFdgUs"),  // market
  new PublicKey("FdGKYpHxpQEkRitZw6KZ8b21Q2mYiATHXZgJjFDhnRWM"),  // bids
  new PublicKey("cxqTRyeoGeh6TBEgo3NAieHaMkdmfZiCjSEfkNAe1Y3"),   // asks
  new PublicKey("EUre4VPaLh7B95qG3JPS3atquJ5hjbwtX7XFcTtVNkc7"),  // events
  new PublicKey("38r5pRYVzdScrJNZowNyrpjVbtRKQ5JMcQxn7PgKE45L"),  // vaultA
  new PublicKey("4YqAGXQEQTQbn4uKX981yCiSjUuYPV8aCajc9qQh3QPy"),  // vaultB
  new PublicKey("84aqZGKMzbr8ddA267ML7JUTAjieVJe8oR1yGUaKwP53"),  // vaultSigner
)

export const RAYDIUM_FTT_USDC_MARKET = new RaydiumMarket(
  "FTT/USDC", 
  TokenID.FTT, 
  TokenID.USDC, 
  new PublicKey("4C2Mz1bVqe42QDDTyJ4HFCFFGsH5YDzo91Cen5w5NGun"),   // amm
  new PublicKey("5Q544fKrFoe6tsEbD7S8EmxGTJYAKtTVhAW5Q5pge4j1"),  // ammAuthority
  new PublicKey("23WS5XY3srvBtnP6hXK64HAsXTuj1kT7dd7srjrJUNTR"),  // openOrders
  new PublicKey("CYbPm6BCkMyX8NnnS7AoCUkpxHVwYyxvjQWwZLsrFcLR"),   // targetOrders
  new PublicKey("4TaBaR1ZgHNuQM3QNHnjJdAT4Sws9cz46MtVWVebg7Ax"),  // vaultA
  new PublicKey("7eDiHvsfcZf1VFC2sUDJwr5EMMr66TpQ2nmAreUjoASV"),  // vaultB

  new PublicKey("2Pbh1CvRVku1TgewMfycemghf6sU9EyuFDcNXqvRmSxc"),  // market
  new PublicKey("9HTDV2r7cQBUKL3fgcJZCUfmJsKA9qCP7nZAXyoyaQou"),  // bids
  new PublicKey("EpnUJCMCQNZi45nCBoNs6Bugy67Kj3bCSTLYPfz6jkYH"),   // asks
  new PublicKey("2XHxua6ZaPKpCGUNvSvTwc9teJBmexp8iMWCLu4mtzGb"),  // events
  new PublicKey("4LXjM6rptNvhBZTcWk4AL49oF4oA8AH7D4CV6z7tmpX3"),  // vaultA
  new PublicKey("2ycZAqQ3YNPfBZnKTbz2FqPiV7fmTQpzF95vjMUekP5z"),  // vaultB
  new PublicKey("B5b9ddFHrjndUieLAKkyzB1xmq8sNqGGZPmbyYWPzCyu"),  // vaultSigner
)

export const RAYDIUM_ORCA_USDC_MARKET = new RaydiumMarket(
  "ORCA/USDC", 
  TokenID.ORCA, 
  TokenID.USDC, 
  new PublicKey("C5yXRTp39qv5WZrfiqoqeyK6wvbqS97oBqbsDUqfZyu"),   // amm
  new PublicKey("5Q544fKrFoe6tsEbD7S8EmxGTJYAKtTVhAW5Q5pge4j1"),  // ammAuthority
  new PublicKey("BUwThGpiXwei6xeAZyeSofZYAsQRwnqhyyZ3Xe3J1YAB"),  // openOrders
  new PublicKey("3g7Ef2aZzvWo57Cggv8o8dnMLGz2NSB1BRNyvVnb8AYm"),   // targetOrders
  new PublicKey("48uXZgcnxxDSipQoXMdFmvDsu3xwDsEjHnhKXVYpeHvF"),  // vaultA
  new PublicKey("8eLo3ppAUnjwa4HekixbZ6wTkKGgcMXF3NzxYpduV3if"),  // vaultB

  new PublicKey("8N1KkhaCYDpj3awD58d85n973EwkpeYnRp84y1kdZpMX"),  // market
  new PublicKey("HaAjqsdR6CzDJAioL6s9RGYL7tNC84Hv65S1Gm6MeS9s"),  // bids
  new PublicKey("BQUychhbQfWHsAdTtrcy3DxPRm3dbqZTfYy1W7PQS9e"),   // asks
  new PublicKey("3ajZQLGpAiTnX9quZyoRw1T4E5emWbTAjFtdVyfevXds"),  // events
  new PublicKey("4noUQEJF15yMVWHc7JkWid5EKoE6XLjQEHfdN3pT43NZ"),  // vaultA
  new PublicKey("38DxyYjp4ZqAqjrvAPvDhdALYd4y91jxcpnj28hbvyky"),  // vaultB
  new PublicKey("Dtz4cysczNNTUbHMqnZW2UfUm87bGecR98snGZePt2ot"),  // vaultSigner
)

export const RAYDIUM_MNDE_mSOL_MARKET = new RaydiumMarket(
  "MNDE/mSOL", 
  TokenID.MNDE, 
  TokenID.mSOL, 
  new PublicKey("2kPA9XUuHUifcCYTnjSuN7ZrC3ma8EKPrtzUhC86zj3m"),   // amm
  new PublicKey("5Q544fKrFoe6tsEbD7S8EmxGTJYAKtTVhAW5Q5pge4j1"),  // ammAuthority
  new PublicKey("G3qeShDT2w3Y9XnJbk5TZsx1qbxkBLFmRsnNVLMnkNZb"),  // openOrders
  new PublicKey("DfMpzNeT4XHs2xtN74j5q94QfqPSJbng5BgGyyyChsVm"),   // targetOrders
  new PublicKey("F1zwWuPfYLZfLykDYUqu43A74TUsv8mHuWL6BUrwVhL7"),  // vaultA
  new PublicKey("TuT7ftAgCQGsETei4Q4nMBwp2QLcDwKnixAEgFSBuao"),  // vaultB

  new PublicKey("AVxdeGgihchiKrhWne5xyUJj7bV2ohACkQFXMAtpMetx"),  // market
  new PublicKey("9YBjtad6ZxR7hxNXyTjRRPnPgS7geiBMHbBp4BqHsgV2"),  // bids
  new PublicKey("8UZpvreCr8bprUwstHMPb1pe5jQY82N9fJ1XLa3oKMXg"),   // asks
  new PublicKey("3eeXmsg8byQEC6Q18NE7MSgSbnAJkxz8KNPbW2zfKyfY"),  // events
  new PublicKey("aj1igzDQNRg18h9yFGvNqMPBfCGGWLDvKDp2NdYh92C"),  // vaultA
  new PublicKey("3QjiyDAny7ZrwPohN8TecXL4jBwGWoSUe7hzTiX35Pza"),  // vaultB
  new PublicKey("6Ysd8CE6KwC7KQYpPD9Ax8B77z3bWRnHt1SVrBM8AYC9"),  // vaultSigner
)

export const RAYDIUM_BTC_USDT_MARKET = new RaydiumMarket(
  "BTC/USDT", 
  TokenID.BTC, 
  TokenID.USDT, 
  new PublicKey("AMMwkf57c7ZsbbDCXvBit9zFehMr1xRn8ZzaT1iDF18o"),  // amm
  new PublicKey("5Q544fKrFoe6tsEbD7S8EmxGTJYAKtTVhAW5Q5pge4j1"),  // ammAuthority
  new PublicKey("G5rZ4Qfv5SxpJegVng5FuZftDrJkzLkxQUNjEXuoczX5"),   // openOrders
  new PublicKey("DMEasFJLDw27MLkTBFqSX2duvV5GV6LzwtoVqVfBqeGR"),  // targetOrders
  new PublicKey("7KwCHoQ9nqTnGea4XrcfLUr1pwEWp2maGBHWFqBTeoKW"),  // vaultA
  new PublicKey("HwbXe9YJVez3BKK22jBH1i64YeX2fSKaYny5jrcPDxAk"),  // vaultB

  new PublicKey("C1EuT9VokAKLiW7i2ASnZUvxDoKuKkCpDDeNxAptuNe4"),  // market
  new PublicKey("2e2bd5NtEGs6pb758QHUArNxt6X9TTC5abuE1Tao6fhS"),  // bids
  new PublicKey("F1tDtTDNzusig3kJwhKwGWspSu8z2nRwNXFWc6wJowjM"),  // asks
  new PublicKey("FERWWtsZoSLcHVpfDnEBnUqHv4757kTUUZhLKBCbNfpS"),  // events
  new PublicKey("DSf7hGudcxhhegMpZA1UtSiW4RqKgyEex9mqQECWwRgZ"),  // vaultA
  new PublicKey("BD8QnhY2T96h6KwyJoCT9abMcPBkiaFuBNK9h6FUNX2M"),  // vaultB
  new PublicKey("EPzuCsSzHwhYWn2j69HQPKWuWz6wuv4ANZiVigLGMBoD"),  // vaultSigner
);

export const RAYDIUM_ETH_USDT_MARKET = new RaydiumMarket(
  "ETH/USDT", 
  TokenID.ETH, 
  TokenID.USDT, 
  new PublicKey("He3iAEV5rYjv6Xf7PxKro19eVrC3QAcdic5CF2D2obPt"),  // amm
  new PublicKey("5Q544fKrFoe6tsEbD7S8EmxGTJYAKtTVhAW5Q5pge4j1"),  // ammAuthority
  new PublicKey("8x4uasC632WSrk3wgwoCWHy7MK7Xo2WKAe9vV93tj5se"),   // openOrders
  new PublicKey("G1eji3rrfRFfvHUbPEEbvnjmJ4eEyXeiJBVbMTUPfKL1"),  // targetOrders
  new PublicKey("DZZwxvJakqbraXTbjRW3QoGbW5GK4R5nmyrrGrFMKWgh"),  // vaultA
  new PublicKey("HoGPb5Rp44TyR1EpM5pjQQyFUdgteeuzuMHtimGkAVHo"),  // vaultB

  new PublicKey("7dLVkUfBVfCGkFhSXDCq1ukM9usathSgS716t643iFGF"),  // market
  new PublicKey("J8a3dcUkMwrE5kxN86gsL1Mwrg63RnGdvWsPbgdFqC6X"),  // bids
  new PublicKey("F6oqP13HNZho3bhwuxTmic4w5iNgTdn89HdihMUNR24i"),  // asks
  new PublicKey("CRjXyfAxboMfCAmsvBw7pdvkfBY7XyGxB7CBTuDkm67v"),  // events
  new PublicKey("2CZ9JbDYPux5obFXb9sefwKyG6cyteNBSzbstYQ3iZxE"),  // vaultA
  new PublicKey("D2f4NG1NC1yeBM2SgRe5YUF91w3M4naumGQMWjGtxiiE"),  // vaultB
  new PublicKey("CVVGPFejAj3A75qPy2116iJFma7zGEuL8DgnxhwUaFBF"),  // vaultSigner
)


export const RAYDIUM_RAY_USDT_MARKET = new RaydiumMarket(
  "RAY/USDT", 
  TokenID.RAY, 
  TokenID.USDT, 
  new PublicKey("DVa7Qmb5ct9RCpaU7UTpSaf3GVMYz17vNVU67XpdCRut"),  // amm
  new PublicKey("5Q544fKrFoe6tsEbD7S8EmxGTJYAKtTVhAW5Q5pge4j1"),  // ammAuthority
  new PublicKey("7UF3m8hDGZ6bNnHzaT2YHrhp7A7n9qFfBj6QEpHPv5S8"),  // openOrders
  new PublicKey("3K2uLkKwVVPvZuMhcQAPLF8hw95somMeNwJS7vgWYrsJ"),  // targetOrders
  new PublicKey("3wqhzSB9avepM9xMteiZnbJw75zmTBDVmPFLTQAGcSMN"),  // vaultA
  new PublicKey("5GtSbKJEPaoumrDzNj4kGkgZtfDyUceKaHrPziazALC1"),  // vaultB

  new PublicKey("teE55QrL4a4QSfydR9dnHF97jgCfptpuigbb53Lo95g"),  // market
  new PublicKey("AvKStCiY8LTp3oDFrMkiHHxxhxk4sQUWnGVcetm4kRpy"),  // bids
  new PublicKey("Hj9kckvMX96mQokfMBzNCYEYMLEBYKQ9WwSc1GxasW11"),  // asks
  new PublicKey("58KcficuUqPDcMittSddhT8LzsPJoH46YP4uURoMo5EB"),  // events
  new PublicKey("2kVNVEgHicvfwiyhT2T51YiQGMPFWLMSp8qXc1hHzkpU"),  // vaultA
  new PublicKey("5AXZV7XfR7Ctr6yjQ9m9dbgycKeUXWnWqHwBTZT6mqC7"),  // vaultB
  new PublicKey("HzWpBN6ucpsA9wcfmhLAFYqEUmHjE9n2cGHwunG5avpL"),  // vaultSigner
)

export const RAYDIUM_mSOL_USDT_MARKET = new RaydiumMarket(
  "mSOL/USDT", 
  TokenID.mSOL, 
  TokenID.USDT, 
  new PublicKey("BhuMVCzwFVZMSuc1kBbdcAnXwFg9p4HJp7A9ddwYjsaF"),  // amm
  new PublicKey("5Q544fKrFoe6tsEbD7S8EmxGTJYAKtTVhAW5Q5pge4j1"),  // ammAuthority
  new PublicKey("67xxC7oyzGFMVX8AaAHqcT3UWpPt4fMsHuoHrHvauhog"),  // openOrders
  new PublicKey("HrNUwbZF4NPRSdZ9hwD7EWV1cwQoJ9Yhu9Jf7ybXALpe"),  // targetOrders
  new PublicKey("FaoMKkKzMDQaURce1VLewT6K38F6FQS5UQXD1mTXJ2Cb"),  // vaultA
  new PublicKey("GE8m3rHHejrNf4jE96n5gzMmLbxTfPPcmv9Ppaw24FZa"),  // vaultB

  new PublicKey("HxkQdUnrPdHwXP5T9kewEXs3ApgvbufuTfdw9v1nApFd"),  // market
  new PublicKey("wNv6YZ31PX5hS42XCijwgd7SuMAu63aPvDWjMNTM2UP"),   // bids
  new PublicKey("7g28QYJPPNypyPvoAdir8WzPT2Me78u78jufiG7M3wym"),  // asks
  new PublicKey("Ee9UPY9CH2jHx2LLW2daLyc9VS5Bnp4yTykw4aveeXLX"),  // events
  new PublicKey("FgVVda2Wnp2PuDpuh23B341qZx2cnArqVNSgxsU877Y"),   // vaultA
  new PublicKey("2PtdrUGJd7aYoMKXpQ5d19r5Aa1z8dkRj6NNRCNGTE3D"),  // vaultB
  new PublicKey("QMhH9Mnv1jg8tLNanAvKf3ymbuzh7sDENyjCgiyn3Kk"),   // vaultSigner
)


export const RAYDIUM_SRM_USDT_MARKET = new RaydiumMarket(
  "SRM/USDT", 
  TokenID.SRM, 
  TokenID.USDT, 
  new PublicKey("af8HJg2ffWoKJ6vKvkWJUJ9iWbRR83WgXs8HPs26WGr"),   // amm
  new PublicKey("5Q544fKrFoe6tsEbD7S8EmxGTJYAKtTVhAW5Q5pge4j1"),  // ammAuthority
  new PublicKey("8E2GLzSgLmzWdpdXjjEaHbPXRXsA5CFehg6FP6N39q2e"),  // openOrders
  new PublicKey("8R5TVxXvRfCaYvT493FWAJyLt8rVssUHYVGbGupAbYaQ"),   // targetOrders
  new PublicKey("D6b4Loa4LoidUor2ffouE5BTMt6tLP6MtkNrsfBWG2C3"),  // vaultA
  new PublicKey("4gNeJniq6yqEygFmbAJa82TQjH1j3Fczm4bdeBHhwGJ1"),  // vaultB

  new PublicKey("AtNnsY1AyRERWJ8xCskfz38YdvruWVJQUVXgScC1iPb"),  // market
  new PublicKey("EE2CYFBSoMvcUR9mkEF6tt8kBFhW9zcuFmYqRM9GmqYb"),  // bids
  new PublicKey("nkNzrV3ZtkWCft6ykeNGXXCbNSemqcauYKiZdf5JcKQ"),   // asks
  new PublicKey("2i34Kriz23ZaQaJK6FVhzkfLhQj8DSqdQTmMwz4FF9Cf"),  // events
  new PublicKey("GxPFMyeb7BUnu2mtGV2Zvorjwt8gxHqwL3r2kVDe6rZ8"),  // vaultA
  new PublicKey("149gvUQZeip4u8bGra5yyN11btUDahDVHrixzknfKFrL"),  // vaultB
  new PublicKey("4yWr7H2p8rt11QnXb2yxQF3zxSdcToReu5qSndWFEJw"),  // vaultSigner
)

export const RAYDIUM_stSOL_USDC_MARKET = new RaydiumMarket(
  "stSOL/USDC",
  TokenID.stSOL,
  TokenID.USDC,
  new PublicKey("6a1CsrpeZubDjEJE9s1CMVheB6HWM5d7m1cj2jkhyXhj"),   // amm
  new PublicKey("5Q544fKrFoe6tsEbD7S8EmxGTJYAKtTVhAW5Q5pge4j1"),  // ammAuthority
  new PublicKey("28NQqHxrqMYMQ67aWyn9AzZ1F16PYd4zvLpiiKnEZpsD"),  // openOrders
  new PublicKey("B8nmqinHQjyqAnMWNiqSzs1Jb8VbMpX5k9VUMnDp1gUA"),   // targetOrders
  new PublicKey("DD6oh3HRCvMzqHkGeUW3za4pLgWNPJdV6aNYW3gVjXXi"),  // vaultA
  new PublicKey("6KR4qkJN91LGko2gdizheri8LMtCwsJrhtsQt6QPwCi5"),  // vaultB

  new PublicKey("5F7LGsP1LPtaRV7vVKgxwNYX4Vf22xvuzyXjyar7jJqp"),  // market
  new PublicKey("HjJSzUbis6VhBZLCbSFN1YtvWLLdxutb7WEvymCLrBJt"),  // bids
  new PublicKey("9e37wf6QUqe2s4J6UUNsuv6REQkwTxd47hXhDanm1adp"),   // asks
  new PublicKey("CQY7LwdZJrfLRZcmEzUYp34XJbxhnxgF4UXmLKqJPLCk"),  // events
  new PublicKey("4gqecEySZu6SEgCNhBJm7cEn2TFqCMsMNoiyski5vMTD"),  // vaultA
  new PublicKey("6FketuhRzyTpevhgjz4fFgd5GL9fHeBeRsq9uJvu8h9m"),  // vaultB
  new PublicKey("x1vRSsrhXkSn7xzJfu9mYP2i19SPqG1gjyj3vUWhim1"),  // vaultSigner
)

export const RAYDIUM_whETH_USDC_MARKET = new RaydiumMarket(
  "whETH/USDC", 
  TokenID.whETH, 
  TokenID.USDC,
  new PublicKey("EoNrn8iUhwgJySD1pHu8Qxm5gSQqLK3za4m8xzD2RuEb"),   // amm
  new PublicKey("5Q544fKrFoe6tsEbD7S8EmxGTJYAKtTVhAW5Q5pge4j1"),  // ammAuthority
  new PublicKey("6iwDsRGaQucEcfXX8TgDW1eyTfxLAGrypxdMJ5uqoYcp"),  // openOrders
  new PublicKey("EGZL5PtEnSHrNmeoQF64wXG6b5oqiTArDvAQuSRyomX5"),   // targetOrders
  new PublicKey("DVWRhoXKCoRbvC5QUeTECRNyUSU1gwUM48dBMDSZ88U"),  // vaultA
  new PublicKey("HftKFJJcUTu6xYcS75cDkm3y8HEkGgutcbGsdREDWdMr"),  // vaultB

  new PublicKey("8Gmi2HhZmwQPVdCwzS7CM66MGstMXPcTVHA7jF19cLZz"),  // market
  new PublicKey("3nXzH1gYKM1FKdSLHM7GCRG76mhKwyDjwinJxAg8jjx6"),  // bids
  new PublicKey("b3L5dvehk48X4mDoKzZUZKA4nXGpPAMFkYxHZmsZ98n"),   // asks
  new PublicKey("3z4QQPFdgNSxazqEAzmZD5C5tJWepczimVqWak2ZPY8v"),  // events
  new PublicKey("8cCoWNtgCL7pMapGZ6XQ6NSyD1KC9cosUEs4QgeVq49d"),  // vaultA
  new PublicKey("C7KrymKrLWhCsSjFaUquXU3SYRmgYLRmMjQ4dyQeFiGE"),  // vaultB
  new PublicKey("FG3z1H2BBsf5ekEAxSc1K6DERuAuiXpSdUGkYecQrP5v"),  // vaultSigner
)
