/* After creating the mint, you would typically create an associated token account (ATA) for an owner.
 The ATA serves as the wallet for holding the tokens and is associated with a specific token mint.
  Each user can have multiple ATAs for different tokens. */

import { Connection, Keypair, PublicKey, Transaction, sendAndConfirmTransaction } from "@solana/web3.js";
import { getOrCreateAssociatedTokenAccount, mintTo, getAssociatedTokenAddressSync, createAssociatedTokenAccountIdempotentInstruction } from '@solana/spl-token';

import wallet from "./wallet/wba-dev-wallet.json";

//Connect our WBA Wallet
const keypair = Keypair.fromSecretKey(new Uint8Array(wallet));

//Create a Solana devnet connection to devnet SOL tokens
const connection = new Connection("https://api.devnet.solana.com", {commitment: "confirmed"});

(async () => {
    try {

        // Mint address
        const mint = new PublicKey("qp1sMknHoREEB9e3W7h75XzUuHtFiUE3ioYFkybHrnP");

        // Create an ATA
        const ata = await getOrCreateAssociatedTokenAccount(
            connection,
            keypair,
            mint,
            keypair.publicKey
            );

        console.log(`Your ata is: ${ata.address.toBase58()}`);

        // Mint new token to your wallet
        const mintx = await mintTo(
            connection,
            keypair,
            mint,
            ata.address,
            keypair.publicKey,
            1000000
            );

            console.log(`Succesfully Minted!. Transaction Here: https://explorer.solana.com/tx/${mintx}?cluster=devnet`);

    } catch(error) {
        console.log(`Oops, something went wrong: ${error}`);
    }
})();

/* Your ata is: Dj1JLqGJAXKHysTBr2hYKDxC1xCtgFXNpCdftZ4NjzWu
Your mint txid: 43GcWd1M6oHmktR6GZDspPtrtuSAo8QVN6JR5d9DFmLxsK1XnczNWr8xAkhPFgd39NdfjB1sPqoPp7E79gxSPMTv
*/