"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Dex = exports.Market = exports.TokenID = void 0;
var TokenID;
(function (TokenID) {
    TokenID["BTC"] = "BTC";
    TokenID["ETH"] = "ETH";
    TokenID["SOL"] = "SOL";
    TokenID["RAY"] = "RAY";
    TokenID["SRM"] = "SRM";
    TokenID["USDT"] = "USDT";
    TokenID["USDC"] = "USDC";
    TokenID["UST"] = "UST";
    TokenID["PAI"] = "PAI";
})(TokenID = exports.TokenID || (exports.TokenID = {}));
// market contains meta data
class Market {
    constructor(name, tokenIds) {
        this.name = name;
        this.tokenIds = tokenIds;
    }
}
exports.Market = Market;
class Dex {
    constructor(markets) {
        this.markets = {};
        for (const market of markets) {
            this.markets[market.name] = market;
        }
    }
}
exports.Dex = Dex;
