import wallet from "./wallet/wba-dev-wallet.json"
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults"
import { createSignerFromKeypair, signerIdentity } from "@metaplex-foundation/umi"
import { irysUploader } from "@metaplex-foundation/umi-uploader-irys"

// Create a devnet connection
const umi = createUmi('https://api.devnet.solana.com');


let keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const signer = createSignerFromKeypair(umi, keypair);

umi.use(irysUploader()).use(signerIdentity(signer));

(async () => {
    try {
        // Follow this JSON structure
        // https://docs.metaplex.com/programs/token-metadata/changelog/v1.0#json-structure

        // image = 
        const metadata = {
             name: "faces_0001",
             symbol: "FACE",
             description: "face_0001",
             // Image uri:
             image: 'https://arweave.net/sZIa305u9hDHMtwXKDp4VvxoobGdpjLdTrf6gmOCfgg',
             attributes: [
                 {trait_type: 'random', value: '?'}
             ],
             properties: {
                 files: [
                     {
                         type: "image/png",
                         // image uri:
                         uri: "https://arweave.net/sZIa305u9hDHMtwXKDp4VvxoobGdpjLdTrf6gmOCfgg"
                        },
                 ]
             },
             creators: []
         };
        const myUri = await umi.uploader.uploadJson([metadata])
         console.log("Your metadata URI: ", myUri);
    }
    catch(error) {
        console.log("Oops.. Something went wrong", error);
    }
})();

//Your metadata URI:  https://arweave.net/gM8vawDufh_tRVIWqAYWDHxcvbGcZTYA_-tq7Qdu3p0