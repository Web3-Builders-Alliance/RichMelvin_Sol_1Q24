use anchor_lang::prelude::*;
use anchor_spl::token::{Mint, TokenAccount, TokenInterface, TransferChecked, transfer_checked};
use crate::state::{Listing, DesciMarketplace};

#[derive(Accounts)]
pub struct Delist<'info> {
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
        mut,
        associated_token::authority = maker,
        associated_token::mint = maker_mint,
    )]
    maker_ata: Account<'info, TokenAccount>,
    #[account(
        mut,
        close = maker,
        seeds = [desci_marketplace.key().as_ref(), maker_mint.key().as_ref()],
        bump = listing.bump,
    )]
    listing: Account<'info, Listing>,
    #[account(
        mut,
        associated_token::mint = maker_mint,
        associated_token::authority = listing,
    )]
    vault: Account<'info, TokenAccount>,
    token_program: Program<'info, TokenInterface>,
}

impl<'info> Delist<'info> {
    pub fn withdraw_nft(&mut self) -> Result<()> {
        let seeds = &[
            &self.desci_marketplace.key().to_bytes()[..],
            &self.maker_mint.key().to_bytes()[..],
            &[self.listing.bump],
        ];
        let signer_seeds = &[seeds[..]];

        let accounts = TransferChecked {
            from: self.vault.to_account_info(),
            to: self.maker_ata.to_account_info(),
            authority: self.listing.to_account_info(),
            mint: self.maker_mint.to_account_info(),
        };

        let cpi_ctx = CpiContext::new_with_signer(
            self.token_program.to_account_info(),
            accounts,
            signer_seeds,
        );

        transfer_checked(cpi_ctx, 1, self.maker_mint.decimals())
            .map_err(|_| DesciMarketPlaceError::NFTTransferFailed)?;

        ok(())
    } 
}