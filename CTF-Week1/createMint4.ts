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

/*
The unique identifier of the token is: AbbX5pibKUzwfupXR1CeJtJm1YGyfY5UNUdm774YSeHS

The unique identifier of the token is: 9PjFo7Rrs3zwxEbTJ66gvXnBvrfdj5drYoxYa2MHLKwB
*/