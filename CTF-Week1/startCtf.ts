/**
 * Solana CTF-Week1 Program Interaction
 * 
 * This TypeScript program demonstrates the interaction with a Solana smart contract
 * implementing challenges for Capture The Flag (CTF) Week 1. It uses the Anchor framework
 * for smart contract development and @solana/web3.js for blockchain interactions.
 * 
 * Prerequisites:
 * - Node.js environment with TypeScript installed
 * - Solana wallet file containing the keypair for transactions
 * - Access to a Solana devnet node
 * 
 * Instructions:
 * 1. Import necessary libraries and types for Solana and Anchor.
 * 2. Initialize connection to the Solana devnet.
 * 3. Create an Anchor provider and program instance.
 * 4. Generate the Program Derived Address (PDA) for the CTF-Week1 profile.
 * 5. Interact with the smart contract by calling its methods.
 * 6. Handle transaction results and errors accordingly.
 * 
 * Note: Update the program ID and wallet file path as per your environment.
 * 
 * @packageDocumentation
 */

// Import the necessary libraries and types for Solana and Anchor.
import { Connection, Keypair, SystemProgram, PublicKey } from "@solana/web3.js"
import { Program, Wallet, AnchorProvider, Address } from "@project-serum/anchor"
import { Week1, IDL } from "./programs/week1";
import wallet from "./wallet/wba-dev-wallet.json"

// We're going to import our keypair from the wallet file
const keypair = Keypair.fromSecretKey(new Uint8Array(wallet));

// Create a devnet connection
const connection = new Connection("https://api.devnet.solana.com");

// Create our anchor provider
const provider = new AnchorProvider(connection, new Wallet(keypair), { commitment: "confirmed"});

// Create our program
const program = new Program<Week1>(IDL, "ctf1VWeMtgxa24zZevsXqDg6xvcMVy4FbP3cxLCpGha" as Address, provider);

// Create the PDA for our CTF-Week1 profile
const profilePda = PublicKey.findProgramAddressSync([Buffer.from("profile"), keypair.publicKey.toBuffer()], program.programId)[0];

(async () => {
    try {
        const txhash = await program.methods
        .initializeCtfProfile()
        .accounts({
        profile: profilePda,
        owner: keypair.publicKey,
        systemProgram: SystemProgram.programId,
        })
        .signers([
            keypair
        ]).rpc();
        console.log(`Success! Check out your TX here: 
        https://explorer.solana.com/tx/${txhash}?cluster=devnet`);
        
    } catch(e) {
        console.error(`Oops, something went wrong: ${e}`)
    }
})();


/*
Success! Check out your TX here: 
        https://explorer.solana.com/tx/5e2TutZYxUzp4EUuCyoqCZNTGHSr4rwVzS2TbobVVsEkSHsCB35zh8ogKKa4hzNxFahHW1j1ZzJ2tQBTymBdWc1M?cluster=devnet

        Profile: Gn3UMNgfEnyPuzYui4J3PMmZjNSdFEbZKMiqasuFi9YQ
*/