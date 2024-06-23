use anchor_lang::prelude::*;
use anchor_spl::{
    token::{Mint, TokenAccount, Token},
    metadata::{Metadata, MetadataAccount},
    associated_token::AssociatedToken,
    associated_token::get_associated_token_address,
    associated_token::create
};
use crate::state::{Listing, DesciMarketplace};
use crate::errors::DesciMarketplaceError;

#[derive(Accounts)]
pub struct List<'info> {
    #[account(mut)]
    maker: Signer<'info>,
    #[account(
        seeds = [b"desciMarketplace", desci_marketplace.name.as_bytes()],
        bump = desci_marketplace.bump,
    )]
    desci_marketplace: Account<'info, DesciMarketplace>,
    #[account(mut)]
    maker_mint: Account<'info, Mint>,
    #[account(
        init_if_needed,
        payer = maker,
        associated_token::mint = maker_mint,
        associated_token::authority = listing,
    )]
    vault: Account<'info, TokenAccount>,
    #[account(
        init,
        payer = maker,
        space = Listing::space() // Dynamic space calculation.
    )]
    listing: Account<'info, Listing>,
    #[account(
        init,
        payer = maker,
        space = Metadata::space(),
        seeds = [b"metadata", maker_mint.key().as_ref()],
        bump
    )]
    metadata: Account<'info, MetadataAccount>,
    system_program: Program<'info, System>,
    token_program: Program<'info, Token>,
    associated_token_program: Program<'info, AssociatedToken>,
    rent: Sysvar<'info, Rent>,
    clock: Sysvar<'info, Clock>, // Obtain the current timestamp.
    #[account(mut)]
    admin_fee_account: AccountInfo<'info>,  // Administrative fee account to deposit fees.
}

impl<'info> List<'info> {
    pub fn execute(
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
        organism: String,
    ) -> Result<()> {
        require!(price > 0, DesciMarketplaceError::InvalidPrice); // Ensures that the price is a positive amount.

        let listing_fee = price * 5 / 100 + (max_nfts as u64 * 100);   // 5% fee plus 100 lamports per additional NFT.
        
        // Initialize listing
        let listing = &mut ctx.accounts.listing;
        listing.maker = ctx.accounts.maker.key();
        listing.mint = ctx.accounts.maker_mint.key();
        listing.price = price;
        listing.metadata_url = metadata_url;
        listing.max_nfts = max_nfts;
        listing.issued_nfts = 0; // Initialize as no NFTs issued yet.
        listing.active = true;
        listing.access_duration = duration;
        listing.encryption_key = encryption_key;
        listing.creation_time = ctx.accounts.clock.unix_timestamp;
        listing.expiry_date = listing.creation_time + listing.access_duration; // Sets the expiry date.

        // Ensure that the vault associated token account exists
        let vault_associated_address = get_associated_token_address(&listing.key(), &ctx.accounts.maker_mint.key());
        if ctx.accounts.vault.to_account_info().key != &vault_associated_address {
            let cpi_accounts = create::CpiAccounts {
                payer: ctx.accounts.maker.to_account_info(),
                associated_token: ctx.accounts.vault.to_account_info(),
                authority: ctx.accounts.listing.to_account_info(),
                mint: ctx.accounts.maker_mint.to_account_info(),
                system_program: ctx.accounts.system_program.to_account_info(),
                token_program: ctx.accounts.token_program.to_account_info(),
                rent: ctx.accounts.rent.to_account_info(),
            };
            let cpi_ctx = CpiContext::new(ctx.accounts.associated_token_program.to_account_info(), cpi_accounts);
            create(cpi_ctx).map_err(|_| DesciMarketplaceError::UnableToDepositNFT)?;
        }

        // Call the metadata initialization function
        initialize_metadata(ctx, name, symbol, uri, data_type, organism)?;

        // Transfer the listing fee to the admin fee account.
        **ctx.accounts.admin_fee_account.lamports.borrow_mut() += listing_fee;
        **ctx.accounts.maker.lamports.borrow_mut() -= listing_fee;

        Ok(())
    }

    fn initialize_metadata(
        ctx: Context<List>,
        name: String,
        symbol: String,
        uri: String,
        data_type: String,
        organism: String,
    ) -> Result<()> {
        // Initialize metadata
        let metadata = &mut ctx.accounts.metadata;
        metadata.name = name;
        metadata.symbol = symbol;
        metadata.uri = uri;
        metadata.data_type = data_type;
        metadata.organism = organism;

        Ok(())
    }
}
