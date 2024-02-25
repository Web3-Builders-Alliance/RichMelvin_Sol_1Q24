/* The process of creating tokens using SPL (Solana Program Library).
Here we create the token mint, which represents the source of the tokens.
 The mint defines the properties of the tokens, such as token supply, decimals, and authority.
*/

import { Keypair, Connection, Commitment } from "@solana/web3.js";
import { createMint } from '@solana/spl-token';
import wallet from "./wallet/wba-dev-wallet.json"

// Import our keypair from the wallet file
const keypair = Keypair.fromSecretKey(new Uint8Array(wallet));

//Create a Solana devnet connection
const commitment: Commitment = "confirmed";
const connection = new Connection("https://api.devnet.solana.com", commitment);

(async () => {
    try {
        // Start here
        const mint = await createMint(connection, keypair, keypair.publicKey, null, 6);
        console.log("Mint created:", mint);

    } catch(error) {
        console.log(`Oops, something went wrong: ${error}`)
    }
})()

/* Mint created: PublicKey [PublicKey(DhHhRXaUZwfP8YyhFJS9ELd9AKybYD4kTVUcB2Bmkjz6)] {
  _bn: <BN: bc9e5ad2a2bd305e7b6be68ab6e073a6b3788452e82c0a947f3c8c3aa7ccd0cf>
} */