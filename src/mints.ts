import { PublicKey } from "@solana/web3.js";
import { TokenID } from "./types";

export const MINTS : {[key in TokenID] : PublicKey} = {
  [TokenID.APT] : new PublicKey("APTtJyaRX5yGTsJU522N4VYWg3vCvSb65eam5GrPT5Rt"),
  [TokenID.BTC] : new PublicKey("9n4nbM75f5Ui33ZbPYXn59EwSgE8CGsHtAeTH5YFeJ9E"),
  [TokenID.ETH] : new PublicKey("2FPyTwcZLUg1MDrwsyoP4D6s1tM7hAkHYRjkNb5w6Pxk"),
  [TokenID.SOL] : new PublicKey("So11111111111111111111111111111111111111112"),
  [TokenID.mSOL] : new PublicKey("mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So"),
  [TokenID.RAY] : new PublicKey("4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R"),
  [TokenID.SRM] : new PublicKey("SRMuApVNdxXokk5GT7XD5cUUgXMBCoAz2LHeuAoKWRt"),
  [TokenID.USDT] : new PublicKey("Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB"),
  [TokenID.USDC] : new PublicKey("EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"),
  [TokenID.UST] : new PublicKey("CXLBjMMcwkc17GfJtBos6rQCo1ypeH6eDbB82Kby4MRm"),
  [TokenID.PAI] : new PublicKey("Ea5SjE2Y6yvCeW5dYTn7PYMuW5ikXkvbGdcmSnXeaLjS"),
  [TokenID.SBR] : new PublicKey("Saber2gLauYim4Mvftnrasomsv6NvAuncvMEZwcLpD1"),
  [TokenID.ORCA] : new PublicKey("orcaEKTdK7LKz57vaAYr9QeNsVEPfiu6QeMU1kektZE"),
  [TokenID.USTv2] : new PublicKey("9vMJfxuKxXBoEa7rM12mYLMwTacLMLDJqHozw96WQL8i"),
  [TokenID.MNDE] : new PublicKey("MNDEFzGvMt87ueuHvVU9VcTqsAP5b3fTGPsHuuPA5ey"),
  [TokenID.FTT]: new PublicKey("AGFEad2et2ZJif9jaGpdMixQqvW5i81aBdvKe7PHNfz3"),
}

export const DECIMALS : {[key in TokenID]: number} = {
  [TokenID.APT] : 1e6,
  [TokenID.BTC] : 1e6,
  [TokenID.ETH] : 1e6,
  [TokenID.SOL] : 1e9,
  [TokenID.mSOL] : 1e9,
  [TokenID.RAY] : 1e6,
  [TokenID.SRM] : 1e6,
  [TokenID.USDT]: 1e6,
  [TokenID.USDC]: 1e6,
  [TokenID.UST] : 1e9,
  [TokenID.PAI] : 1e6,
  [TokenID.SBR] : 1e6,
  [TokenID.ORCA] : 1e6,
  [TokenID.USTv2] : 1e6,
  [TokenID.MNDE] : 1e9,
  [TokenID.FTT]: 1e6,
}