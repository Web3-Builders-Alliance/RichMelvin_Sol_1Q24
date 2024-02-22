import wallet from "./wba-dev-wallet.json"
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults"
import { 
    createMetadataAccountV3, 
    CreateMetadataAccountV3InstructionAccounts, 
    CreateMetadataAccountV3InstructionArgs,
    DataV2Args
} from "@metaplex-foundation/mpl-token-metadata";
import { createSignerFromKeypair, signerIdentity, publicKey } from "@metaplex-foundation/umi";
import * as bs58 from 'bs58';

// Define our Mint address
const mint = publicKey("9tG73aqFNgBfAMGGySZ7M1gBMJjhQhFqnip3ZbKG6fDS")

// Create a UMI connection
const umi = createUmi('https://api.devnet.solana.com');
const keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const signer = createSignerFromKeypair(umi, keypair);
umi.use(signerIdentity(createSignerFromKeypair(umi, keypair)));

(async () => {
    try {
        // Start here
        let accounts: CreateMetadataAccountV3InstructionAccounts = {
            mint: mint,
            mintAuthority: signer
         }

        let data: DataV2Args = {
            name: "Test",
            symbol: 'TEST',
            uri: "",
            sellerFeeBasisPoints: 0,
            creators: null,
            collection: null,
            uses: null

         }

        let args: CreateMetadataAccountV3InstructionArgs = {
             data,
             isMutable: false,
             collectionDetails: null
         }

        let tx = createMetadataAccountV3(
             umi,
             {
                ...accounts,
                 ...args
             }
         )

         // Send the transaction and confirm it, then extract the signature
         let result = await tx.sendAndConfirm(umi).then(r => {
            const signatureBuffer = r.signature;
            const signatureBase58 = bs58.encode(signatureBuffer); // Encode the signature using bs58
            console.log("Transaction signature (base58):", signatureBase58);
            const solanaExplorerUrl = `https://explorer.solana.com/tx/${signatureBase58}`;
            console.log("View the transaction on Solana Explorer:", solanaExplorerUrl);
            return { base58: signatureBase58, explorerUrl: solanaExplorerUrl }; // Return the base58 signature and the Solana Explorer URL
         });

    } catch(e) {
        console.error(`Oops, something went wrong: ${e}`)
    }
})();