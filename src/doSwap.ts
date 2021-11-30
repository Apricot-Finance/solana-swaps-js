// test only works in node
import * as fs from "fs";
import { RAYDIUM_BTC_USDC_MARKET, RAYDIUM_ETH_USDC_MARKET, RAYDIUM_mSOL_USDC_MARKET, RAYDIUM_RAY_USDC_MARKET, RAYDIUM_SOL_USDC_MARKET, RAYDIUM_APT_USDC_MARKET, RAYDIUM_SRM_USDC_MARKET} from "./raydium";
import { ORCA_MNDE_mSOL_MARKET, ORCA_ORCA_USDC_MARKET, ORCA_SBR_USDC_MARKET, ORCA_USDT_USDC_MARKET, ORCA_FTT_USDC_MARKET } from "./orca"
import { SABER_USTv2_USDC_MARKET } from './saber';
import { Connection, Keypair, ParsedAccountData, PublicKey, Transaction } from "@solana/web3.js";
import { Token, TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { SwapperType, TokenID } from "./types";
import { MINTS, DECIMALS } from "./mints";
import { MERCURIAL_USTv1_USDC_MARKET } from "./mercurial";
import invariant from "tiny-invariant";

if(process.argv.length < 6) {
  console.log(`Usage: node ${process.argv[1]} privateKeyFile COIN buySell sellAmt`);
  console.log("privateKeyFile is the address of the private key json to use");
  console.log("COIN is one of BTC, ETH or SOL");
  console.log("buySell is buy or sell");
  process.exit();
}

const [, , fileStr, coin, buySell, sellAmt, buyAmt] = process.argv;

async function getAssociatedTokAcc(tokenId: TokenID, owner: PublicKey) : Promise<PublicKey> {
  return await Token.getAssociatedTokenAddress(
    ASSOCIATED_TOKEN_PROGRAM_ID, TOKEN_PROGRAM_ID, MINTS[tokenId], owner);

}

async function doSwap() {
  const keyStr = fs.readFileSync(fileStr, "utf8");
  const privateKey = JSON.parse(keyStr);
  const keypair = Keypair.fromSecretKey(new Uint8Array(privateKey));
  const aptTokenAccount = await getAssociatedTokAcc(TokenID.APT, keypair.publicKey);
  const btcTokenAccount = await getAssociatedTokAcc(TokenID.BTC, keypair.publicKey);
  const ethTokenAccount =  await getAssociatedTokAcc(TokenID.ETH, keypair.publicKey); 
  const solTokenAccount = await getAssociatedTokAcc(TokenID.SOL, keypair.publicKey);
  const msolTokenAccount = await getAssociatedTokAcc(TokenID.mSOL, keypair.publicKey);
  const usdcTokenAccount = await getAssociatedTokAcc(TokenID.USDC, keypair.publicKey);
  const usdtTokenAccount = await getAssociatedTokAcc(TokenID.USDT, keypair.publicKey);
  const ustTokenAccount = await getAssociatedTokAcc(TokenID.UST, keypair.publicKey);
  const sbrTokenAccount = await getAssociatedTokAcc(TokenID.SBR, keypair.publicKey);
  const orcaTokenAccount = await getAssociatedTokAcc(TokenID.ORCA, keypair.publicKey);
  const rayTokenAccount = await getAssociatedTokAcc(TokenID.RAY, keypair.publicKey);
  const ustv2TokenAccount = await getAssociatedTokAcc(TokenID.USTv2, keypair.publicKey);
  const mndeTokenAccount = await getAssociatedTokAcc(TokenID.MNDE, keypair.publicKey);
  const fttTokenAccount = await getAssociatedTokAcc(TokenID.FTT, keypair.publicKey);
  const srmTokenAccount = await getAssociatedTokAcc(TokenID.SRM, keypair.publicKey);

  //const conn = new Connection("https://api.mainnet-beta.solana.com", "confirmed");
  // const conn = new Connection("https://lokidfxnwlabdq.main.genesysgo.net:8899/", "confirmed");
  const conn = new Connection("https://apricot.genesysgo.net/", "confirmed");
  
  const isBuy = buySell === "buy";

  const mainTokenType = {
    APT: TokenID.APT,
    BTC: TokenID.BTC,
    ETH: TokenID.ETH,
    SOL: TokenID.SOL,
    mSOL: TokenID.mSOL,
    USDT: TokenID.USDT,
    UST: TokenID.UST,
    SBR: TokenID.SBR,
    ORCA: TokenID.ORCA,
    RAY: TokenID.RAY,
    USTv2: TokenID.USTv2,
    MNDE: TokenID.MNDE,
    SRM: TokenID.SRM,
    FTT: TokenID.FTT,
  }[coin];
  invariant(mainTokenType);

  const tokenAccounts: Record<TokenID, PublicKey | undefined> = {
    APT: aptTokenAccount,
    USDC: usdcTokenAccount,
    BTC: btcTokenAccount,
    ETH: ethTokenAccount,
    SOL: solTokenAccount,
    mSOL: msolTokenAccount,
    USDT: usdtTokenAccount,
    UST: ustTokenAccount,
    SBR: sbrTokenAccount,
    ORCA: orcaTokenAccount,
    RAY: rayTokenAccount,
    USTv2: ustv2TokenAccount,
    MNDE: mndeTokenAccount,
    SRM: srmTokenAccount,
    PAI: undefined,
    FTT: fttTokenAccount,
  }
  const mainTokenAcc = tokenAccounts[mainTokenType];
  invariant(mainTokenAcc);

  const getSwapper = {
    APT: () => RAYDIUM_APT_USDC_MARKET,
    BTC: ()=> RAYDIUM_BTC_USDC_MARKET,
    ETH: ()=> RAYDIUM_ETH_USDC_MARKET,
    SOL: ()=> RAYDIUM_SOL_USDC_MARKET,
    mSOL: ()=> RAYDIUM_mSOL_USDC_MARKET,
    USDT: ()=> ORCA_USDT_USDC_MARKET,
    UST: ()=> MERCURIAL_USTv1_USDC_MARKET,
    SBR: ()=> ORCA_SBR_USDC_MARKET,
    ORCA: ()=> ORCA_ORCA_USDC_MARKET,
    RAY: ()=> RAYDIUM_RAY_USDC_MARKET,
    USTv2: () => SABER_USTv2_USDC_MARKET,
    MNDE: ()=> ORCA_MNDE_mSOL_MARKET,
    FTT: () => ORCA_FTT_USDC_MARKET ,
    SRM: () => RAYDIUM_SRM_USDC_MARKET,
  }[coin];
  invariant(getSwapper);
  const swapper = getSwapper();

  const tokenBAcc = tokenAccounts[swapper.tokenIdB]
  invariant(tokenBAcc);

  const buyTokenID = isBuy ? mainTokenType : swapper.tokenIdB;
  const buyTokenAcc = isBuy ? mainTokenAcc : tokenBAcc;
  const sellTokenID = isBuy ? swapper.tokenIdB : mainTokenType;
  const sellTokenAcc = isBuy ? tokenBAcc : mainTokenAcc;

  const swapperType = {
    APT: SwapperType.Single,
    BTC: SwapperType.Single,
    ETH: SwapperType.Single,
    SOL: SwapperType.Single,
    mSOL: SwapperType.Single,
    USDT: SwapperType.Single,
    UST: SwapperType.Single,
    SBR: SwapperType.Single,
    ORCA: SwapperType.Single,
    RAY: SwapperType.Single,
    USTv2: SwapperType.Single,
    MNDE: SwapperType.Single,
    FTT: SwapperType.Single,
    SRM: SwapperType.Single,
  }[coin];
  invariant(swapperType);

  const parsedBuyBeforeAmt = ((await conn.getParsedAccountInfo(buyTokenAcc, 'confirmed')).value?.data as ParsedAccountData).parsed.info.tokenAmount.uiAmount;
  console.log(sellTokenAcc.toString());
  const tradeIxs = await swapper.createSwapInstructions(
    sellTokenID,
    parseFloat(sellAmt) * DECIMALS[sellTokenID],
    sellTokenAcc,

    buyTokenID,
    parseFloat(buyAmt) * DECIMALS[buyTokenID],
    buyTokenAcc,

    keypair.publicKey
  );

  const tradeTx = new Transaction();
  tradeIxs.forEach(ix=>tradeTx.add(ix));

  const sig = await conn.sendTransaction(tradeTx, [keypair], {preflightCommitment: 'confirmed'});
  await conn.confirmTransaction(sig, 'confirmed');

  const parsedBuyAfterAmt = ((await conn.getParsedAccountInfo(buyTokenAcc, 'confirmed')).value?.data as ParsedAccountData).parsed.info.tokenAmount.uiAmount;

  console.log(sig);
  console.log(`Received ${parsedBuyAfterAmt - parsedBuyBeforeAmt}`);
  console.log("DONE");
  process.exit();
}

doSwap();
