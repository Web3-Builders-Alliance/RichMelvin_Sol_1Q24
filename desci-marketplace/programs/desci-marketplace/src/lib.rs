/*
This contract will be used to manage the listing, buying, and delisting of NFTs which represent access to desci data sets.
 */

//Import components from the anchor_lang crate
use anchor_lang::prelude::*;

//Macro that sets the unique identifier for the desci marketplace on the Solana blockchain.
declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

pub mod state;
pub mod contexts;
pub mod errors;

//Make the contents of contexts and errors available to this library
pub use contexts::{Initialize, List, Purchase, Delist};
pub use state::DesciMarketplace;
pub use errors::DesciMarketplaceError;

// Importing specific errors directly to ensure they are recognized
use crate::errors::DesciMarketplaceError;

// Entry points of the desci marketplace contract
#[program]
pub mod desci_marketplace {
    use super::*;
    
    //Initialize the marketplace with a name, a fee, and a metadata compliance level
    pub fn initialize(ctx: Context<Initialize>, name: String, fee: u16, metadata_compliance_level: u8) -> Result<()> {
        ctx.accounts.init(name, fee, metadata_compliance_level, &ctx.bumps)
    }

    //List an NFT for sale, setting sale price and transfers to a vault account.
    pub fn list(
        ctx: Context<List>,
        price: u64,
        metadata_url: String,
        max_nfts: u64,
        encryption_key: String,
        duration: u64,
        name: String,
        symbol: String,
        uri: String,
        data_type: String,
        organism: String
    ) -> Result<()> {
        require!(price > 0, DesciMarketplaceError::InvalidPrice); // Ensures that the price is a positive amount.

        // Attempt to create a listing and handle possible errors.
        ctx.accounts.create_listing(price, &ctx.bumps)
            .map_err(|_| DesciMarketplaceError::UnableToList)?;

        // Attempt to deposit NFT and handle possible errors.
        ctx.accounts.deposit_nft()
            .map_err(|_| DesciMarketplaceError::UnableToDepositNFT)?;

        ctx.accounts.execute(price, metadata_url, max_nfts, encryption_key, duration, name, symbol, uri, data_type, organism)
            .map_err(|_| DesciMarketplaceError::UnableToList)?;

        Ok(())
    }

    //Removing an NFT listing (transfer back to provider account?)
    pub fn delist(ctx: Context<Delist>) -> Result<()> {
        ctx.accounts.withdraw_nft()
    }

    //Manage the purchasing process with duration parameter for different access lengths.
    pub fn purchase(ctx: Context<Purchase>, duration: i64) -> Result<()> {
        // Attempt to send SOL and handle possible errors.
        ctx.accounts.execute(ctx, duration)
            .map_err(|_| DesciMarketplaceError::PaymentFailed)
    }

    pub fn renew(ctx: Context<Purchase>, duration: i64) -> Result<()> {
        ctx.accounts.renew_access(ctx, duration)
    }

    pub fn return_nft(ctx: Context<Purchase>) -> Result<()> {
        ctx.accounts.return_nft(ctx)
    }
}

/*
#[derive(Accounts)] is handled in /contexts/init.rs
*/
