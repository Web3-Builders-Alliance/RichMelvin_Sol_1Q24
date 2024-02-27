/**
 * Solana Token Mint Creation Script
 * 
 * This script creates a new token mint on the Solana blockchain.
 * 
 * Prerequisites:
 * - Ensure that necessary libraries and modules are installed.
 * - Configure wallet file (wba-dev-wallet.json) with appropriate keys.
 * 
 * Steps:
 * 1. Import required libraries and modules.
 * 2. Connect to the Solana devnet.
 * 3. Create a new token mint using the specified wallet.
 * 4. Output the unique identifier of the newly created token.
 * 
 * Usage:
 * - Run the script using Node.js or similar tools.
 * - Monitor the console for the unique token identifier.
 * 
 */

import { Connection, Keypair } from "@solana/web3.js";
import { createMint } from "@solana/spl-token"

import wallet from "./wallet/wba-dev-wallet.json"

//Connect our WBA Wallet
const keypair = Keypair.fromSecretKey(new Uint8Array(wallet));

//Create a Solana devnet connection to devnet SOL tokens
const connection = new Connection("https://api.devnet.solana.com", {commitment: "confirmed"});

(async () => {
  
  // Create new token mint
  const mint = await createMint(
    connection,
    keypair,
    keypair.publicKey,
    null,
    14
  );

  console.log(`The unique identifier of the token is: ${mint.toBase58()}`); 

})();

// The unique identifier of the token is: FRxKy8LqNTgAktawugzwWvhznf5F1EyTaHgDb6qiZmeZ