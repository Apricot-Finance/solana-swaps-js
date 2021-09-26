// test only works in node
import * as fs from "fs";
import { RAYDIUM_BTC_USDC_MARKET, RAYDIUM_ETH_USDC_MARKET, RAYDIUM_SOL_USDC_MARKET } from "./raydium/raydiumConstants";
import { ORCA_USDT_USDC_MARKET } from "./orca/orcaConstants"
import { Connection, Keypair, PublicKey, Transaction } from "@solana/web3.js";
import { Token, TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { TokenID } from "./types";
import { MINTS, DECIMALS } from "./mints";

if(process.argv.length < 6) {
  console.log(`Usage: node ${process.argv[1]} privateKeyFile COIN buySell sellAmt`);
  console.log("privateKeyFile is the address of the private key json to use");
  console.log("COIN is one of BTC, ETH or SOL");
  console.log("buySell is buy or sell");
  process.exit();
}

const [nodeStr, scriptStr, fileStr, coin, buySell, sellAmt, buyAmt] = process.argv;

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
  const usdcTokenAccount = await getAssociatedTokAcc(TokenID.USDC, keypair.publicKey);
  const usdtTokenAccount = await getAssociatedTokAcc(TokenID.USDT, keypair.publicKey);

  const conn = new Connection("https://api.mainnet-beta.solana.com", "confirmed");

  const isBuy = buySell === "buy";

  const mainTokenType = {
    BTC: TokenID.BTC,
    ETH: TokenID.ETH,
    SOL: TokenID.SOL,
    USDT: TokenID.USDT,
  }[coin]!;

  const mainTokenAcc = {
    BTC: btcTokenAccount,
    ETH: ethTokenAccount,
    SOL: solTokenAccount,
    USDT: usdtTokenAccount,
  }[coin]!;

  const buyTokenID = isBuy ? mainTokenType : TokenID.USDC;
  const buyTokenAcc = isBuy ? mainTokenAcc : usdcTokenAccount;
  const sellTokenID = isBuy ? TokenID.USDC : mainTokenType;
  const sellTokenAcc = isBuy ? usdcTokenAccount : mainTokenAcc;

  const getSwapper = {
    BTC: ()=> RAYDIUM_BTC_USDC_MARKET,
    ETH: ()=> RAYDIUM_ETH_USDC_MARKET,
    SOL: ()=> RAYDIUM_SOL_USDC_MARKET,
    USDT: ()=> ORCA_USDT_USDC_MARKET,
  }[coin]!;

  const swapper = getSwapper();



  const parsedBuyBeforeAmt = ((await conn.getParsedAccountInfo(buyTokenAcc)).value?.data as any).parsed.info.tokenAmount.uiAmount;

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

  const sig = await conn.sendTransaction(tradeTx, [keypair]);
  await conn.confirmTransaction(sig);

  const parsedBuyAfterAmt = ((await conn.getParsedAccountInfo(buyTokenAcc)).value?.data as any).parsed.info.tokenAmount.uiAmount;

  console.log(sig);
  console.log(`Received ${parsedBuyAfterAmt - parsedBuyBeforeAmt}`);
  console.log("DONE");
  process.exit();
}

doSwap();