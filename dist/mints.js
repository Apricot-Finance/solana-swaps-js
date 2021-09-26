"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DECIMALS = exports.MINTS = void 0;
const web3_js_1 = require("@solana/web3.js");
const types_1 = require("./types");
exports.MINTS = {
    [types_1.TokenID.BTC]: new web3_js_1.PublicKey("9n4nbM75f5Ui33ZbPYXn59EwSgE8CGsHtAeTH5YFeJ9E"),
    [types_1.TokenID.ETH]: new web3_js_1.PublicKey("2FPyTwcZLUg1MDrwsyoP4D6s1tM7hAkHYRjkNb5w6Pxk"),
    [types_1.TokenID.SOL]: new web3_js_1.PublicKey("So11111111111111111111111111111111111111112"),
    [types_1.TokenID.RAY]: new web3_js_1.PublicKey("4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R"),
    [types_1.TokenID.SRM]: new web3_js_1.PublicKey("SRMuApVNdxXokk5GT7XD5cUUgXMBCoAz2LHeuAoKWRt"),
    [types_1.TokenID.USDT]: new web3_js_1.PublicKey("Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB"),
    [types_1.TokenID.USDC]: new web3_js_1.PublicKey("EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"),
    [types_1.TokenID.UST]: new web3_js_1.PublicKey("CXLBjMMcwkc17GfJtBos6rQCo1ypeH6eDbB82Kby4MRm"),
    [types_1.TokenID.PAI]: new web3_js_1.PublicKey("Ea5SjE2Y6yvCeW5dYTn7PYMuW5ikXkvbGdcmSnXeaLjS"),
};
exports.DECIMALS = {
    [types_1.TokenID.BTC]: 1e6,
    [types_1.TokenID.ETH]: 1e6,
    [types_1.TokenID.SOL]: 1e9,
    [types_1.TokenID.RAY]: 1e9,
    [types_1.TokenID.SRM]: 1e6,
    [types_1.TokenID.USDT]: 1e6,
    [types_1.TokenID.USDC]: 1e6,
    [types_1.TokenID.UST]: 1e9,
    [types_1.TokenID.PAI]: 1e6,
};
