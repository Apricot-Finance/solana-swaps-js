"use strict";
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
exports.SERUM_SOL_USDC_MARKET = exports.SERUM_ETH_USDC_MARKET = exports.SERUM_BTC_USDC_MARKET = exports.SerumSwapper = exports.SerumMarket = exports.SERUM_PROGRAM = void 0;
const web3_js_1 = require("@solana/web3.js");
const types_1 = require("../types");
const mints_1 = require("../mints");
exports.SERUM_PROGRAM = new web3_js_1.PublicKey("9xQeWvG816bUx9EPjHmaT23yvVM2ZWbrrpZb9PusVFin");
class SerumMarket extends types_1.Market {
    constructor(name, tokenIdA, tokenIdB, market, bids, asks, events, requests, vaultA, vaultB, vaultSigner) {
        super(name, [tokenIdA, tokenIdB]);
        this.name = name;
        this.tokenIdA = tokenIdA;
        this.tokenIdB = tokenIdB;
        this.market = market;
        this.bids = bids;
        this.asks = asks;
        this.events = events;
        this.requests = requests;
        this.vaultA = vaultA;
        this.vaultB = vaultB;
        this.vaultSigner = vaultSigner;
        if (name !== `${tokenIdA}/${tokenIdB}`) {
            throw new Error("Incorrect name!");
        }
        this.mintA = mints_1.MINTS[tokenIdA];
        this.mintB = mints_1.MINTS[tokenIdB];
    }
    getSwapper(args) {
        // Serum Swap requires an OpenOrder account that costs like 0.02 SOL. Not setting it up for now.
        throw new Error("Not implemented");
    }
}
exports.SerumMarket = SerumMarket;
class SerumSwapper {
    constructor(market, openOrders) {
        this.market = market;
        this.openOrders = openOrders;
    }
    createSwapInstructions(fromToken, fromAmount, fromTokenAccount, toToken, toAmount, toTokenAccount, tradeOwner) {
        return __awaiter(this, void 0, void 0, function* () {
            throw new Error("NOT IMPLEMENTED");
        });
    }
}
exports.SerumSwapper = SerumSwapper;
exports.SERUM_BTC_USDC_MARKET = new SerumMarket("BTC/USDC", types_1.TokenID.BTC, types_1.TokenID.USDC, new web3_js_1.PublicKey("A8YFbxQYFVqKZaoYJLLUVcQiWP7G2MeEgW5wsAQgMvFw"), // market
new web3_js_1.PublicKey("6wLt7CX1zZdFpa6uGJJpZfzWvG6W9rxXjquJDYiFwf9K"), // bids
new web3_js_1.PublicKey("6EyVXMMA58Nf6MScqeLpw1jS12RCpry23u9VMfy8b65Y"), // asks
new web3_js_1.PublicKey("6NQqaa48SnBBJZt9HyVPngcZFW81JfDv9EjRX2M4WkbP"), // events
new web3_js_1.PublicKey("H6UaUrNVELJgTqao1CNL4252kShLKSfwoboT8tF7HNtB"), // requests
new web3_js_1.PublicKey("GZ1YSupuUq9kB28kX9t1j9qCpN67AMMwn4Q72BzeSpfR"), // vaultA
new web3_js_1.PublicKey("7sP9fug8rqZFLbXoEj8DETF81KasaRA1fr6jQb6ScKc5"), // vaultB
new web3_js_1.PublicKey("GBWgHXLf1fX4J1p5fAkQoEbnjpgjxUtr4mrVgtj9wW8a"));
exports.SERUM_ETH_USDC_MARKET = new SerumMarket("ETH/USDC", types_1.TokenID.ETH, types_1.TokenID.USDC, new web3_js_1.PublicKey("4tSvZvnbyzHXLMTiFonMyxZoHmFqau1XArcRCVHLZ5gX"), // market
new web3_js_1.PublicKey("8tFaNpFPWJ8i7inhKSfAcSestudiFqJ2wHyvtTfsBZZU"), // bids
new web3_js_1.PublicKey("2po4TC8qiTgPsqcnbf6uMZRMVnPBzVwqqYfHP15QqREU"), // asks
new web3_js_1.PublicKey("Eac7hqpaZxiBtG4MdyKpsgzcoVN6eMe9tAbsdZRYH4us"), // events
new web3_js_1.PublicKey("6yJsfduT4Av6xaECAoXf4cXHaQQYjf78D1FG3WDyuxdr"), // requests
new web3_js_1.PublicKey("7Nw66LmJB6YzHsgEGQ8oDSSsJ4YzUkEVAvysQuQw7tC4"), // vaultA
new web3_js_1.PublicKey("EsDTx47jjFACkBhy48Go2W7AQPk4UxtT4765f3tpK21a"), // vaultB
new web3_js_1.PublicKey("C5v68qSzDdGeRcs556YoEMJNsp8JiYEiEhw2hVUR8Z8y"));
exports.SERUM_SOL_USDC_MARKET = new SerumMarket("SOL/USDC", types_1.TokenID.SOL, types_1.TokenID.USDC, new web3_js_1.PublicKey("9wFFyRfZBsuAha4YcuxcXLKwMxJR43S7fPfQLusDBzvT"), // market
new web3_js_1.PublicKey("14ivtgssEBoBjuZJtSAPKYgpUK7DmnSwuPMqJoVTSgKJ"), // bids
new web3_js_1.PublicKey("CEQdAFKdycHugujQg9k2wbmxjcpdYZyVLfV9WerTnafJ"), // asks
new web3_js_1.PublicKey("5KKsLVU6TcbVDK4BS6K1DGDxnh4Q9xjYJ8XaDCG5t8ht"), // events
new web3_js_1.PublicKey("AZG3tFCFtiCqEwyardENBQNpHqxgzbMw8uKeZEw2nRG5"), // requests
new web3_js_1.PublicKey("36c6YqAwyGKQG66XEp2dJc5JqjaBNv7sVghEtJv4c7u6"), // vaultA
new web3_js_1.PublicKey("8CFo8bL8mZQK8abbFyypFMwEDd8tVJjHTTojMLgQTUSZ"), // vaultB
new web3_js_1.PublicKey("F8Vyqk3unwxkXukZFQeYyGmFfTG3CAX4v24iyrjEYBJV"));
