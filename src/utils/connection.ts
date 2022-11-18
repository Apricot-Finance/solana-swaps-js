import { Connection } from '@solana/web3.js';

const connection = new Connection((process.env.RPC_TRITON_URL as string) || process.env.RPC as string || 'https://api.mainnet-beta.solana.com');

export default connection;
