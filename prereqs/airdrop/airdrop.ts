import { Connection, Keypair, LAMPORTS_PER_SOL } from "@solana/web3.js";
import wallet = require('./dev-wallet.json');

const keypair = Keypair.fromSecretKey(new Uint8Array(wallet));
console.log("Key pair created:", keypair);

const connection = new Connection("https://api.devnet.solana.com");
console.log("connection established:", connection);

(async () => {
    try {
        const txhash = await connection.requestAirdrop(keypair.publicKey, 2 * LAMPORTS_PER_SOL);
        console.log(`Sucess! Check out your TX here: https://explorer.solana.com/tx/${txhash}?cluster=devnet`);
    } catch(e)  {
        console.error(`Oops, something went wrong: ${e}`)
    }
}) ();