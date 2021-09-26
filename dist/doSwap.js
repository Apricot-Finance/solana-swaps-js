"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
// test only works in node
const fs = __importStar(require("fs"));
const raydiumConstants_1 = require("./raydium/raydiumConstants");
const orcaConstants_1 = require("./orca/orcaConstants");
const web3_js_1 = require("@solana/web3.js");
const spl_token_1 = require("@solana/spl-token");
const types_1 = require("./types");
const mints_1 = require("./mints");
if (process.argv.length < 6) {
    console.log(`Usage: node ${process.argv[1]} privateKeyFile COIN buySell sellAmt`);
    console.log("privateKeyFile is the address of the private key json to use");
    console.log("COIN is one of BTC, ETH or SOL");
    console.log("buySell is buy or sell");
    process.exit();
}
const [nodeStr, scriptStr, fileStr, coin, buySell, sellAmt, buyAmt] = process.argv;
function getAssociatedTokAcc(tokenId, owner) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield spl_token_1.Token.getAssociatedTokenAddress(spl_token_1.ASSOCIATED_TOKEN_PROGRAM_ID, spl_token_1.TOKEN_PROGRAM_ID, mints_1.MINTS[tokenId], owner);
    });
}
function doSwap() {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        const keyStr = fs.readFileSync(fileStr, "utf8");
        const privateKey = JSON.parse(keyStr);
        const keypair = web3_js_1.Keypair.fromSecretKey(new Uint8Array(privateKey));
        const btcTokenAccount = yield getAssociatedTokAcc(types_1.TokenID.BTC, keypair.publicKey);
        const ethTokenAccount = yield getAssociatedTokAcc(types_1.TokenID.ETH, keypair.publicKey);
        const solTokenAccount = yield getAssociatedTokAcc(types_1.TokenID.SOL, keypair.publicKey);
        const usdcTokenAccount = yield getAssociatedTokAcc(types_1.TokenID.USDC, keypair.publicKey);
        const usdtTokenAccount = yield getAssociatedTokAcc(types_1.TokenID.USDT, keypair.publicKey);
        const conn = new web3_js_1.Connection("https://api.mainnet-beta.solana.com", "confirmed");
        const isBuy = buySell === "buy";
        const mainTokenType = {
            BTC: types_1.TokenID.BTC,
            ETH: types_1.TokenID.ETH,
            SOL: types_1.TokenID.SOL,
            USDT: types_1.TokenID.USDT,
        }[coin];
        const mainTokenAcc = {
            BTC: btcTokenAccount,
            ETH: ethTokenAccount,
            SOL: solTokenAccount,
            USDT: usdtTokenAccount,
        }[coin];
        const buyTokenID = isBuy ? mainTokenType : types_1.TokenID.USDC;
        const buyTokenAcc = isBuy ? mainTokenAcc : usdcTokenAccount;
        const sellTokenID = isBuy ? types_1.TokenID.USDC : mainTokenType;
        const sellTokenAcc = isBuy ? usdcTokenAccount : mainTokenAcc;
        const getSwapper = {
            BTC: () => raydiumConstants_1.RAYDIUM_BTC_USDC_MARKET,
            ETH: () => raydiumConstants_1.RAYDIUM_ETH_USDC_MARKET,
            SOL: () => raydiumConstants_1.RAYDIUM_SOL_USDC_MARKET,
            USDT: () => orcaConstants_1.ORCA_USDT_USDC_MARKET,
        }[coin];
        const swapper = getSwapper();
        const parsedBuyBeforeAmt = ((_a = (yield conn.getParsedAccountInfo(buyTokenAcc)).value) === null || _a === void 0 ? void 0 : _a.data).parsed.info.tokenAmount.uiAmount;
        const tradeIxs = yield swapper.createSwapInstructions(sellTokenID, parseFloat(sellAmt) * mints_1.DECIMALS[sellTokenID], sellTokenAcc, buyTokenID, parseFloat(buyAmt) * mints_1.DECIMALS[buyTokenID], buyTokenAcc, keypair.publicKey);
        const tradeTx = new web3_js_1.Transaction();
        tradeIxs.forEach(ix => tradeTx.add(ix));
        const sig = yield conn.sendTransaction(tradeTx, [keypair]);
        yield conn.confirmTransaction(sig);
        const parsedBuyAfterAmt = ((_b = (yield conn.getParsedAccountInfo(buyTokenAcc)).value) === null || _b === void 0 ? void 0 : _b.data).parsed.info.tokenAmount.uiAmount;
        console.log(sig);
        console.log(`Received ${parsedBuyAfterAmt - parsedBuyBeforeAmt}`);
        console.log("DONE");
        process.exit();
    });
}
doSwap();
