import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { DesciMarketplace } from "../target/types/desci_marketplace";

describe("desci-marketplace", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.DesciMarketplace as Program<DesciMarketplace>;

  it("Is initialized!", async () => {
    // Add your test here.
    const tx = await program.methods.initialize().rpc();
    console.log("Your transaction signature", tx);
  });

  it("Lists an NFT", async () => {
    const tx = await program.methods.list(1000).rpc();
    console.log("NFT listed transaction signature", tx);
  });

  it("Purchases an NFT", async () => {
    const tx = await program.methods.purchase(31536000).rpc();
    console.log("NFT purchase transaction signature", tx);
  });

  it("Delists an NFT", async () => {
    const tx = await program.methods.delist().rpc();
    console.log("NFT delisted transactino signature", tx);
  });
});
