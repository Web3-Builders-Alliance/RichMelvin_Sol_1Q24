/**
 * Solana Challenge 2 Completion Script
 * 
 * This script is used to complete Challenge 2 in the Solana CTF (Capture The Flag).
 * 
 * Prerequisites:
 * - Ensure that necessary libraries and modules are installed.
 * - Configure wallet file (wba-dev-wallet.json) with appropriate keys.
 * - Retrieve the correct mint address for the challenge token (mint1 or mint2).
 * 
 * Steps:
 * 1. Import required libraries and modules.
 * 2. Connect to the Solana devnet.
 * 3. Create an Anchor provider.
 * 4. Create a program instance for the specified challenge (Week1).
 * 5. Use the PDA for the CTF-Week1 profile.
 * 6. Define the mint address for the challenge token (mint1 or mint2).
 * 7. Create the PDA for the Challenge2 Vault.
 * 8. Create the associated token account (ATA) for the wallet.
 * 9. Mint tokens to the ATA.
 * 10. Complete the Challenge 2 by invoking the program's method.
 * 11. Monitor the console for transaction success and check the transaction on Solana Explorer.
 * 
 * Usage:
 * - Run the script using Node.js or similar tools.
 * - Monitor the console for transaction success messages and links to view transactions on Solana Explorer.
 */


// Import libraries and types for Solana and Anchor
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

// Paste here the mint address for challenge1 token. Yes, they really do want the mint from challenge 1!
const mint = new PublicKey("GqZs1vL8AdDqkW9y3HzPaAdVzv4VaW7yEqRrNhVcsfX5");

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
            keypair.publicKey,
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
            255 // I found this number by looking at vault transactions on Solana Explorer.
        )
        
        console.log(`Success! Check out your TX here: 
        https://explorer.solana.com/tx/${mintTx}?cluster=devnet`);
        
        // Complete the Challenge!
        const completeTx = await program.methods.completeChallenge2(new BN(255))
        .accounts({
            owner:keypair.publicKey,
            profile: profilePda,
            systemProgram: SystemProgram.programId,
            ata: (await ownerAta).address,
            vault: vault,
            mint: mint,
            tokenProgram: TOKEN_PROGRAM_ID,
            associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID
        })
        .signers([
            keypair
        ]).rpc();

        console.log(`Success! Check out your TX here: 
        https://explorer.solana.com/tx/${completeTx}?cluster=devnet`);

    } catch(e) {
        console.error(`Oops, something went wrong: ${e}`)
    }
})();

/*
Success! Check out your TX here: 
        https://explorer.solana.com/tx/2NVkBA9U22adaVPMNpJYxp35RRDeDyv4QdTXvjZNi3VXYTJ3dkGKSdWAVrFneqTUjs8JQVzPvYreWaaPKs3wWokh?cluster=devnet
Success! Check out your TX here: 
        https://explorer.solana.com/tx/5mGLTpYHMuXut9FSawNbGtRTjPMGSzx9CLTa3V2MuWG42nxU8QUUiUrcaAydBKkE43a4ZjttAeiFB4EkCQuM5nTh?cluster=devnet
*/