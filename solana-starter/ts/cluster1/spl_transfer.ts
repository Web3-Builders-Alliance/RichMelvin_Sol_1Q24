import { Commitment, Connection, Keypair, PublicKey } from "@solana/web3.js";
import { getOrCreateAssociatedTokenAccount, transfer } from "@solana/spl-token";

import wallet from "./wallet/wba-dev-wallet.json";

// We're going to import our keypair from the wallet file
const keypair = Keypair.fromSecretKey(new Uint8Array(wallet));

//Create a Solana devnet connection
const commitment: Commitment = "confirmed";
const connection = new Connection("https://api.devnet.solana.com", commitment);

// Mint address
const mint = new PublicKey("qp1sMknHoREEB9e3W7h75XzUuHtFiUE3ioYFkybHrnP");

// Recipient address
const to = new PublicKey("7gVcfVusRrKbVBGpMbgCbZUKvLKq5maDGZ2BCDeSghpL");

(async () => {
    try {
        // Get the token account of the fromWallet address, and if it does not exist, create it
        const from_ata = await getOrCreateAssociatedTokenAccount(
            connection,
            keypair,
            mint,
            keypair.publicKey
            );

        // Get the token account of the toWallet address, and if it does not exist, create it
        const to_ata = await getOrCreateAssociatedTokenAccount(
            connection,
            keypair,
            mint,
            to
            );

        // Transfer the new token to the "toTokenAccount" we just created
        const tx = await transfer(
            connection,
            keypair,
            from_ata.address,
            to_ata.address,
            keypair.publicKey,
            1000
            );
        
            console.log(`Succesfully Minted!. Transaction Here: https://explorer.solana.com/tx/${tx}?cluster=devnet`);

    } catch(e) {
        console.error(`Oops, something went wrong: ${e}`);
    }
})();