/**
 * Solana CTF Challenge 3 Script
 * 
 * This script completes Challenge 3 of the Solana Capture The Flag (CTF) competition.
 * It interacts with a Solana program defined by the provided IDL and addresses.
 * 
 * Requirements:
 * - Node.js environment with @solana/web3.js and @project-serum/anchor packages installed
 * - Wallet JSON file containing the keypair for authentication
 * 
 * Instructions:
 * 1. Import necessary libraries and dependencies.
 * 2. Set up connection, wallet, and program provider.
 * 3. Define addresses and keys required for the challenge.
 * 4. Execute the challenge completion transaction.
 * 5. Display transaction status or error message.
 * 
 * WARNING: Ensure the correctness of provided addresses and keys. Use at your own risk.
 * 
 */

import { Connection, Keypair, SystemProgram, PublicKey } from "@solana/web3.js"
import { Program, Wallet, AnchorProvider, Address, BN } from "@project-serum/anchor"
import { Week1, IDL } from "./programs/week1";
import { ASSOCIATED_TOKEN_PROGRAM_ID, TOKEN_PROGRAM_ID, getOrCreateAssociatedTokenAccount, mintTo } from "@solana/spl-token";

import wallet from "./wallet/wba-dev-wallet.json"

// We're going to import our keypair from the wallet file
const keypair = Keypair.fromSecretKey(new Uint8Array(wallet));

// Create a devnet connection
const connection = new Connection("https://api.devnet.solana.com");

// Create our anchor provider
const provider = new AnchorProvider(connection, new Wallet(keypair), { commitment: "confirmed"});

// Create our program
const program = new Program<Week1>(IDL, "ctf1VWeMtgxa24zZevsXqDg6xvcMVy4FbP3cxLCpGha" as Address, provider);

// Use the PDA for our CTF-Week1 profile
const profilePda = PublicKey.findProgramAddressSync([Buffer.from("profile"), keypair.publicKey.toBuffer()], program.programId)[0];

// Use the PDA for the Auth account
const authPda = PublicKey.findProgramAddressSync([Buffer.from("auth")], program.programId);

// Paste here the mint address for challenge1 token (This mint account was generated using createMint3 and includes the PDA for the profile.)
const mint = new PublicKey("85qUm5ETb8uKsKaD69hecwG8zLrUwX6vEQubSmLkwye5");

// Create the PDA for the Challenge2 Vault
const vault = PublicKey.findProgramAddressSync([Buffer.from("vault2"), keypair.publicKey.toBuffer(), mint.toBuffer()], program.programId)[0];


(async () => {
    try {

        // NB if you get TokenAccountNotFoundError, wait a few seconds and try again!

        // Create the ATA for your Wallet
        const ownerAta = getOrCreateAssociatedTokenAccount(
            connection,
            keypair,
            mint,
            keypair.publicKey
        );
    
        // Complete the Challenge!
        const completeTx = await program.methods
        .completeChallenge3()
        .accounts({
            owner: keypair.publicKey,
            profile: profilePda,
            systemProgram: SystemProgram.programId,
            ata: (await ownerAta).address,
            mint: mint,
            tokenProgram: TOKEN_PROGRAM_ID,
            associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
            authority: authPda[0]
        })
        .signers([keypair]).rpc();

        console.log(`Success! Check out your TX here: 
        https://explorer.solana.com/tx/${completeTx}?cluster=devnet`);

    } catch(e) {
        console.error(`Oops, something went wrong: ${e}`)
    }
})();

/*
Success! Check out your TX here: 
        https://explorer.solana.com/tx/3FDYZwUzUWFRymDNXEUj7iQFnu4KBERrZeZSx2aM5UcEkToCtqNbRiev4hDG1boqaBXb8ApLdHrNdxEopCpytSZq?cluster=devnet

        I had to mess around a bit with this one, I did get the TokenAccountNotFoundError. But before that I was getting an
        Anchor Error that said the mint authority was violated. I am not sure why that error occured.
*/