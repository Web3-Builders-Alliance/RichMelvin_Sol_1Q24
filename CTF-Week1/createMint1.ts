/**
 * Solana SPL Token Mint Creation for Challenge 1.
 * 
 * This TypeScript program demonstrates the creation of a new token mint on the Solana blockchain
 * using the SPL token library. It connects to a Solana devnet, initializes a wallet using a secret
 * key from a wallet file, and then creates a new token mint.
 * 
 * Prerequisites:
 * - Node.js environment with TypeScript installed
 * - Solana wallet file containing the secret key for minting tokens
 * - Access to a Solana devnet node
 * 
 * Instructions:
 * 1. Import necessary libraries and types for Solana and SPL token creation.
 * 2. Connect to the Solana devnet using a Solana connection instance.
 * 3. Load the wallet secret key from a wallet file.
 * 4. Use the loaded keypair to create a new token mint with specified parameters.
 * 5. Retrieve the mint's unique identifier (mint address) and use it as needed.
 * 
 * Note: Update the wallet file path as per your environment and customize token parameters
 *       such as decimals, freeze authority, and initial supply as needed.
 * 
 * @packageDocumentation
 */


// Import libraries and types for Solana and SPL token creation.
import { Connection, Keypair } from "@solana/web3.js";
import { createMint } from "@solana/spl-token"

import wallet from "./wallet/wba-dev-wallet.json"

//Connect our WBA Wallet
const keypair = Keypair.fromSecretKey(new Uint8Array(wallet));

//Create a Solana devnet connection to devnet SOL tokens
const connection = new Connection("https://api.devnet.solana.com", {commitment: "confirmed"});

(async () => {
  
  // Create new token mint (use 14 decimals as per instructions in README.md)
  const mint = await createMint(
    connection,
    keypair,
    keypair.publicKey,
    null,
    14
  );

  console.log(`The unique identifier of the token is: ${mint.toBase58()}. Use this as the mint address in challenge 1.`); 

})();

/* 
Run using 'yarn createMint1'
Ouptput: The unique identifier of the token is: GqZs1vL8AdDqkW9y3HzPaAdVzv4VaW7yEqRrNhVcsfX5.
Use this as the mint address in challenge 1.
*/