// test only works in node
import * as fs from "fs";
import { RAYDIUM_BTC_USDC_MARKET, RAYDIUM_ETH_USDC_MARKET, RAYDIUM_mSOL_USDC_MARKET, RAYDIUM_RAY_USDC_MARKET, RAYDIUM_SOL_USDC_MARKET } from "./raydium/raydiumConstants";
import { ORCA_ORCA_USDC_MARKET, ORCA_SBR_USDC_MARKET, ORCA_USDT_USDC_MARKET } from "./orca/orcaConstants"
import { Connection, Keypair, PublicKey, Transaction } from "@solana/web3.js";
import { Token, TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { TokenID } from "./types";
import { MINTS, DECIMALS } from "./mints";
import { MERCURIAL_USTv1_USDC_MARKET } from "./mercurial";

if(process.argv.length < 6) {
  console.log(`Usage: node ${process.argv[1]} privateKeyFile COIN buySell sellAmt`);
  console.log("privateKeyFile is the address of the private key json to use");
  console.log("COIN is one of BTC, ETH or SOL");
  console.log("buySell is buy or sell");
  process.exit();
}

const [_nodeStr, _scriptStr, fileStr, coin, buySell, sellAmt, buyAmt] = process.argv;

async function getAssociatedTokAcc(tokenId: TokenID, owner: PublicKey) : Promise<PublicKey> {
  return await Token.getAssociatedTokenAddress(
    ASSOCIATED_TOKEN_PROGRAM_ID, TOKEN_PROGRAM_ID, MINTS[tokenId], owner);

}

async function doSwap() {
  const keyStr = fs.readFileSync(fileStr, "utf8");
  const privateKey = JSON.parse(keyStr);
  const keypair = Keypair.fromSecretKey(new Uint8Array(privateKey));
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

  //const conn = new Connection("https://api.mainnet-beta.solana.com", "confirmed");
  const conn = new Connection("https://lokidfxnwlabdq.main.genesysgo.net:8899/", "confirmed");

  const isBuy = buySell === "buy";

  const mainTokenType = {
    BTC: TokenID.BTC,
    ETH: TokenID.ETH,
    SOL: TokenID.SOL,
    mSOL: TokenID.mSOL,
    USDT: TokenID.USDT,
    UST: TokenID.UST,
    SBR: TokenID.SBR,
    ORCA: TokenID.ORCA,
    RAY: TokenID.RAY,
  }[coin]!;

  const mainTokenAcc = {
    BTC: btcTokenAccount,
    ETH: ethTokenAccount,
    SOL: solTokenAccount,
    mSOL: msolTokenAccount,
    USDT: usdtTokenAccount,
    UST: ustTokenAccount,
    SBR: sbrTokenAccount,
    ORCA: orcaTokenAccount,
    RAY: rayTokenAccount,
  }[coin]!;

  const buyTokenID = isBuy ? mainTokenType : TokenID.USDC;
  const buyTokenAcc = isBuy ? mainTokenAcc : usdcTokenAccount;
  const sellTokenID = isBuy ? TokenID.USDC : mainTokenType;
  const sellTokenAcc = isBuy ? usdcTokenAccount : mainTokenAcc;

  const getSwapper = {
    BTC: ()=> RAYDIUM_BTC_USDC_MARKET,
    ETH: ()=> RAYDIUM_ETH_USDC_MARKET,
    SOL: ()=> RAYDIUM_SOL_USDC_MARKET,
    mSOL: ()=> RAYDIUM_mSOL_USDC_MARKET,
    USDT: ()=> ORCA_USDT_USDC_MARKET,
    UST: ()=> MERCURIAL_USTv1_USDC_MARKET,
    SBR: ()=> ORCA_SBR_USDC_MARKET,
    ORCA: ()=> ORCA_ORCA_USDC_MARKET,
    RAY: ()=> RAYDIUM_RAY_USDC_MARKET,
  }[coin]!;

  const swapper = getSwapper();

  const parsedBuyBeforeAmt = ((await conn.getParsedAccountInfo(buyTokenAcc, 'confirmed')).value?.data as any).parsed.info.tokenAmount.uiAmount;

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

  const parsedBuyAfterAmt = ((await conn.getParsedAccountInfo(buyTokenAcc, 'confirmed')).value?.data as any).parsed.info.tokenAmount.uiAmount;

  console.log(sig);
  console.log(`Received ${parsedBuyAfterAmt - parsedBuyBeforeAmt}`);
  console.log("DONE");
  process.exit();
}

doSwap();