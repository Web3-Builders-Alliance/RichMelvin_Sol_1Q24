import wallet from "./wba-dev-wallet.json"
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults"
import { createGenericFile, createSignerFromKeypair, signerIdentity } from "@metaplex-foundation/umi"
import { createIrysUploader } from "@metaplex-foundation/umi-uploader-irys"
import { readFile } from "fs/promises"

// Create a devnet connection
const umi = createUmi('https://api.devnet.solana.com');

const irysUploader = createIrysUploader(umi);

let keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const myKeypairSigner = createSignerFromKeypair(umi, keypair);

umi.use(signerIdentity(myKeypairSigner));

(async () => {
    try {
        //1. Load image. It is necessary to use the absolute path here.
        const image = await readFile('/home/rgmelvinphd/wba/solana-starter/ts/cluster1/images/adelT_face.png');

        //2. Convert image to generic file.
        const nft_image = createGenericFile(image, "adelT_face.png");

        //3. Upload image
        const [myUri] = await irysUploader.upload([nft_image]);

        console.log("Your image URI: ", myUri);
    }
    catch(error) {
        console.log("Oops.. Something went wrong", error);
    }
})();


//Your image URI:  https://arweave.net/hA4p2_PefK06VSEFqZLA7whS1eJ2SGc8bdU0yKFfdWg