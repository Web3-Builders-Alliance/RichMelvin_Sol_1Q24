
/**
 * Solana CTF Week 1 Challenge 1 Completion Script
 * 
 * This TypeScript script is used to complete the Week 1 challenge #1 of a Capture The Flag (CTF) 
 * competition on the Solana blockchain. It interacts with Solana's web3 libraries, Anchor framework, 
 * and SPL token libraries to perform tasks such as minting tokens, creating associated token accounts, 
 * and completing challenge tasks defined by the CTF program.
 * 
 * Prerequisites:
 * - Node.js environment with TypeScript installed
 * - Solana wallet file containing the secret key for interacting with the Solana network
 * - Access to a Solana devnet node
 * 
 * Instructions:
 * 1. Import necessary libraries and types for Solana, Anchor, and SPL token interactions.
 * 2. Connect to the Solana devnet using a Solana connection instance.
 * 3. Load the wallet secret key from a wallet file.
 * 4. Create an Anchor provider for interacting with the CTF program.
 * 5. Define program-specific parameters such as program ID, profile PDA, mint address, and vault PDA.
 * 6. Create or retrieve associated token accounts and mint tokens as needed.
 * 7. Complete the challenge by invoking the appropriate method of the CTF program.
 * 8. Monitor the transaction status and verify completion through the Solana Explorer.
 * 
 * Note: Adjust program-specific parameters and mint addresses as per the CTF challenge requirements.
 * 
 * @packageDocumentation
 */

//Import the necessary libraries and types for Solana and Anchor
import { Connection, Keypair, SystemProgram, PublicKey } from "@solana/web3.js"
import { Program, Wallet, AnchorProvider, Address, BN } from "@project-serum/anchor"
import { Week1, IDL } from "./programs/week1";
import { ASSOCIATED_TOKEN_PROGRAM_ID, TOKEN_PROGRAM_ID, createMint, getOrCreateAssociatedTokenAccount, mintTo } from "@solana/spl-token";

import wallet from "./wallet/wba-dev-wallet.json"

// We're going to import our keypair from the wallet file
const keypair = Keypair.fromSecretKey(new Uint8Array(wallet));

// Create a devnet connection
const connection = new Connection("https://api.devnet.solana.com");

// Create our anchor provider
const provider = new AnchorProvider(connection, new Wallet(keypair), { commitment: "finalized"});

// Create our program
const program = new Program<Week1>(IDL, "ctf1VWeMtgxa24zZevsXqDg6xvcMVy4FbP3cxLCpGha" as Address, provider);

// Use the PDA for our CTF-Week1 profile (created in startCtf.ts)
const profilePda = PublicKey.findProgramAddressSync([Buffer.from("profile"), keypair.publicKey.toBuffer()], program.programId)[0];

// Paste here the mint address for challenge1 token (use createMint1.ts and use the public key that is generated.)
const mint = new PublicKey("GqZs1vL8AdDqkW9y3HzPaAdVzv4VaW7yEqRrNhVcsfX5");

// Create the PDA for the Challenge1 Vault
const vault = PublicKey.findProgramAddressSync([Buffer.from("vault1"), keypair.publicKey.toBuffer(), mint.toBuffer()], program.programId)[0];

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

        // Mint some tokens!
        const mintTx = await mintTo(
            connection,
            keypair,
            mint,
            (
                await ownerAta
                ).address,
            keypair,
            1
        );
        
        console.log(`Success! Check out your TX here: 
        https://explorer.solana.com/tx/${mintTx}?cluster=devnet`);
        
        // Complete the Challenge!
        const completeTx = await program.methods
        .completeChallenge1(new BN(1))
        .accounts({
            owner: keypair.publicKey,
            profile: profilePda,
            systemProgram: SystemProgram.programId,
            ata: (await ownerAta).address,
            vault: vault,
            mint: mint,
            tokenProgram: TOKEN_PROGRAM_ID,
            associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        })
        .signers([keypair]).rpc();

        console.log(`Success! Check out your TX here: 
        https://explorer.solana.com/tx/${completeTx}?cluster=devnet`);

    } catch(e) {
        console.error(`Oops, something went wrong: ${e}`)
    }
})();

/* To run: 'yarn challenge1'

Output: Success! Check out your TX here: 
        https://explorer.solana.com/tx/3y8ZwT5cj8zx47qc6iU7BQJVrLPeiZukz3hzYqfeCA824My6QMCcJyvkrwe9vxhw81UVdiebxFKBQwmd3hXMTHMq?cluster=devnet
        Oops, something went wrong: Error: failed to send transaction: Transaction simulation failed: Error processing Instruction 0: custom program error: 0x1

        So, the transaction was successful however logging completion of the challenge was not.

        I was doubtful so I followed the example answer. It turns out that the order of parameters for .accounts is mixed up in the example answer.
        I re-ordered the parameters for .accounts to be in the proper order and voilla! success on both accounts!

        Success! Check out your TX here: 
        https://explorer.solana.com/tx/5jqTheXoA2GQ7ieLGzzeKC2t9teTNuRGmDSo6k3w3L4D9UkZpmDsFZst6Smzu1HTQMwVpHkeEsAbco9ayY7yTY81?cluster=devnet
Success! Check out your TX here: 
        https://explorer.solana.com/tx/41Z1tQc6ySBgcp3rMR8zhb6z5fYGuqT27xXp9wNLocpeU9gKqxgBc619nMEHtcRssnxvZaxkXBUQwTukWYFhctSx?cluster=devnet
*/