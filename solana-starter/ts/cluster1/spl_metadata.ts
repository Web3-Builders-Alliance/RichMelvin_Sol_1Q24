/* This is step 3 in the process of creating tokens using the SPL (Solana Program Library).
Once the mint and ATA are set up (steps 1 and 2), you may proceed to create metadata for the token.
 Metadata provides additional information about the token, such as its name, symbol, image, description, and other attributes.
  This metadata is often used in applications and marketplaces to display information about the token.
  */

import wallet from "./wallet/wba-dev-wallet.json"
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults"
import { 
    createMetadataAccountV3, 
    CreateMetadataAccountV3InstructionAccounts, 
    CreateMetadataAccountV3InstructionArgs,
    DataV2Args
} from "@metaplex-foundation/mpl-token-metadata";
import { createSignerFromKeypair, signerIdentity, publicKey } from "@metaplex-foundation/umi";
import base58 from "bs58";

// Define our Mint address
const mint = publicKey("5WvyZWvJH6EHjRdPZw9GUZXGEMVPhAhjPVb7ENTYLeW4")

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
            name: "WBA token - Rich Melvin",
            symbol: "WBA",
            uri: "https://www.wba.com.rmelvin.io",
            sellerFeeBasisPoints: 500,
            creators: null,
            collection: null,
            uses: null
        }

        let args: CreateMetadataAccountV3InstructionArgs = {
            data: data,
            isMutable: true,
            collectionDetails: null
        }

        let tx = createMetadataAccountV3(
            umi,
            {
                ...accounts,
               ...args
            }
        );

        let result = await tx.sendAndConfirm(umi).then(r => r.signature.toString());
        console.log("Your transaction signature:", result);

        // Convert transaction signature to base58
        const signatureBytes = result.split(',').map(Number);
        const signatureBase58 = base58.encode(Buffer.from(signatureBytes));
        console.log("Your transaction signature (base58):", signatureBase58);
        


    } catch(e) {
        console.error(`Oops, something went wrong: ${e}`);
    }


})();