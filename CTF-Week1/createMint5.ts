import { Connection, Keypair, PublicKey } from "@solana/web3.js"
import { Program, Wallet, AnchorProvider, Address } from "@project-serum/anchor"
import { Week1, IDL } from "./programs/week1";
import { createMint } from "@solana/spl-token"

import wallet from "./wallet/wba-dev-wallet.json"

//Connect our WBA Wallet
const keypair = Keypair.fromSecretKey(new Uint8Array(wallet));

//Create a Solana devnet connection to devnet SOL tokens
const connection = new Connection("https://api.devnet.solana.com", {commitment: "confirmed"});

// Create our anchor provider
const provider = new AnchorProvider(connection, new Wallet(keypair), { commitment: "confirmed"});

// Create our program
const program = new Program<Week1>(IDL, "ctf1VWeMtgxa24zZevsXqDg6xvcMVy4FbP3cxLCpGha" as Address, provider);

// Create the PDA for our CTF-Week1 profile
const authPda = PublicKey.findProgramAddressSync(
  [Buffer.from("auth")],
  program.programId
)[0];

(async () => {
  
  // Create new token mint
  const mint = await createMint(
    connection,
    keypair,
    keypair.publicKey,
    authPda,
    14
  );

  console.log(`The unique identifier of the token is: ${mint.toBase58()}`); 

})();

/*
The unique identifier of the token is: dzvWT5GWANvQR3KpsogFYC3JpFgsL7vNBLEiNCWNAwq
*/