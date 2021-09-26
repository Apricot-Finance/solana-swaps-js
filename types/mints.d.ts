import { PublicKey } from "@solana/web3.js";
import { TokenID } from "./types";
export declare const MINTS: {
    [key in TokenID]: PublicKey;
};
export declare const DECIMALS: {
    [key in TokenID]: number;
};
