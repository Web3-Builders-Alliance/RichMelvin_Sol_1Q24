import { createUmi } from "@metaplex-foundation/umi-bundle-defaults"
import { createSignerFromKeypair, signerIdentity, generateSigner, percentAmount } from "@metaplex-foundation/umi"
import { createNft, createProgrammableNft, mplTokenMetadata, ruleSetToggle } from "@metaplex-foundation/mpl-token-metadata";

import wallet from "./wallet/wba-dev-wallet.json"
import { base58 } from "@metaplex-foundation/umi/serializers";

const RPC_ENDPOINT = "https://api.devnet.solana.com";
const umi = createUmi(RPC_ENDPOINT);

let keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const myKeypairSigner = createSignerFromKeypair(umi, keypair);
umi.use(signerIdentity(myKeypairSigner));
umi.use(mplTokenMetadata())

const name = "faces";
// Metadata uri:
const uri = 'https://arweave.net/dHwdXcpPFI2RwLYxX9N9hFUttaM3QsGzw1Gz41MFc_w';
const mint = generateSigner(umi);
const sellerFeeBasisPoints = percentAmount(10, 2);

(async () => {
  
    let tx = createNft(
        umi,
         {
            mint,
            name,
            uri,
            sellerFeeBasisPoints,
        },
    )

    let result = await tx.sendAndConfirm(umi);
    const signature = base58.deserialize(result.signature);
    
    console.log(`Succesfully Minted! Check out your TX here: https://solana.fm/tx/${signature[0]}?cluster=devnet`)

    console.log("Mint Address: ", mint.publicKey);
})();

/*Succesfully Minted! Check out your TX here: https://solana.fm/tx/2obary2kKPHWnTZnktNkmkpG8ULoseYab6bft5Uk5mA2gzPhin9FgzChQLVnBrA4dW1HsmkwT2u43eHZyfrXXA1J?cluster=devnet
Mint Address:  BXyxXUyAHJAu75EwtFsVGpGfeLjb6fX1FZJojpjewfRp. */