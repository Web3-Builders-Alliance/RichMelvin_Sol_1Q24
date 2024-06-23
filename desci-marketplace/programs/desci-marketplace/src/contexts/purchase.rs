use anchor_lang::{
    prelude::*,
    system_program::{Transfer, transfer}
};
use anchor_spl::{
    token::{self, Mint, TokenAccount, Token, TransferChecked, transfer_checked},
    associated_token::AssociatedToken,
    associated_token::get_associated_token_address,
    associated_token::create_associated_token_account
};
use crate::{state::{DesciMarketplace, Listing}, DesciMarketplaceError};

#[derive(Accounts)]
pub struct Purchase<'info> {
    #[account(mut)]
    taker: Signer<'info>,
    #[account(mut)]
    maker: AccountInfo<'info>,
    #[account(mut)]
    admin_fee_account: AccountInfo<'info>, // Account to collect administrative fees
    #[account(mut)]
    deposit_vault: AccountInfo<'info>, // Account for holding deposits
    #[account(
        seeds = [b"desciMarketplace", desci_marketplace.name.as_bytes()],
        bump = desci_marketplace.bump,
    )]
    desci_marketplace: Account<'info, DesciMarketplace>,
    #[account(mut)]
    listing: Account<'info, Listing>,
    system_program: Program<'info, System>,
    token_program: Program<'info, Token>,
    clock: Sysvar<'info, Clock>,
}

impl<'info> Purchase<'info> {
    pub fn execute(&self, ctx: Context<Purchase>, duration: i64) -> Result<()> {
        let current_time = ctx.accounts.clock.unix_timestamp;
        require!(current_time <= ctx.accounts.listing.expiry_date, DesciMarketplaceError::AccessExpired);

        let has_history = self.check_buyer_history(&ctx.accounts.taker.key());
        let price = self.calculate_price(duration, has_history)?;

        let deposit = price * 5 / 100;  // 5% deposit
        let admin_fee = price * 25 / 100;  // 25% administrative fee
        let royalty = admin_fee * 10 / 100;  // 10% of admin fee as royalty

        // Ensure the taker has an associated account for the NFT
        let taker_associated_account = self.ensure_associated_account(&ctx, &ctx.accounts.taker, &ctx.accounts.listing.mint)?;

        // Distribute fees and funds
        **ctx.accounts.maker.lamports.borrow_mut() += price + royalty;
        **ctx.accounts.admin_fee_account.lamports.borrow_mut() += admin_fee - royalty;
        **ctx.accounts.deposit_vault.lamports.borrow_mut() += deposit;
        **ctx.accounts.taker.lamports.borrow_mut() -= price + deposit + admin_fee;

        // Transfer NFT to the taker's associated account
        let cpi_accounts = TransferChecked {
            from: ctx.accounts.listing.to_account_info(),
            to: taker_associated_account.to_account_info(),
            mint: ctx.accounts.listing.mint.to_account_info(),
            authority: ctx.accounts.listing.to_account_info(),
        };
        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);
        transfer_checked(cpi_ctx, 1, ctx.accounts.listing.mint.decimals())
            .map_err(|_| DesciMarketplaceError::NFTTransferFailed)?;

        Ok(())
    }

    fn calculate_price(&self, duration: i64, has_history: bool) -> Result<u64> {
        let base_price = match duration {
            2592000 => self.listing.monthly_price,       // 1 month
            15552000 => self.listing.semiannual_price,   // 6 months
            31536000 => self.listing.price,              // 1 year
            _ => return Err(DesciMarketplaceError::InvalidDuration),
        };

        let discounted_price = if has_history {
            (base_price as f64 * 0.9) as u64  // 10% discount for repeat buyers
        } else {
            base_price
        };

        Ok(discounted_price)
    }

    fn check_buyer_history(&self, buyer: &Pubkey) -> bool {
        // Placeholder for actual logic to check buyer's purchase history
        true
    }

    pub fn renew_access(&self, ctx: Context<Purchase>, duration: i64) -> Result<()> {
        let current_time = ctx.accounts.clock.unix_timestamp;
        require!(current_time <= ctx.accounts.listing.expiry_date, DesciMarketplaceError::AccessExpired);

        // Reset the expiry date
        ctx.accounts.listing.expiry_date = current_time + duration;

        Ok(())
    }

    pub fn return_nft(&self, ctx: Context<Purchase>) -> Result<()> {
        let current_time = ctx.accounts.clock.unix_timestamp;
        require!(current_time <= ctx.accounts.listing.expiry_date, DesciMarketplaceError::AccessExpired);

        // Refund the deposit amount
        let deposit_refund = **ctx.accounts.deposit_vault.lamports.borrow();
        **ctx.accounts.taker.lamports.borrow_mut() += deposit_refund;
        **ctx.accounts.deposit_vault.lamports.borrow_mut() -= deposit_refund;

        // Optionally mark the listing as inactive
        ctx.accounts.listing.active = false;

        Ok(())
    }

    /// Ensures that the taker has an associated token account for the NFT's mint.
    /// If not, creates it using the payer's funds.
    fn ensure_associated_account(
        &self,
        ctx: &Context<Purchase>,
        taker: &Signer<'info>,
        mint: &AccountInfo<'info>
    ) -> Result<AccountInfo<'info>> {
        let associated_address = get_associated_token_address(&taker.key(), &mint.key());
        let account_info = AccountInfo::find(associated_address)?;

        if account_info.is_none() {
            // Creating the associated account as it doesn't exist
            let seeds = &[&[b"associated", taker.key().as_ref(), mint.key().as_ref()][..]];
            let cpi_accounts = Create {
                payer: taker.to_account_info(),
                associated_token: account_info.to_account_info(),
                authority: taker.to_account_info(),
                mint: mint.to_account_info(),
                system_program: ctx.accounts.system_program.to_account_info(),
                token_program: ctx.accounts.token_program.to_account_info(),
                rent: ctx.accounts.rent.to_account_info(),
            };
            let cpi_ctx = CpiContext::new_with_signer(ctx.accounts.token_program.to_account_info(), cpi_accounts, seeds);
            create_associated_token_account(cpi_ctx)
                .map_err(|_| DesciMarketplaceError::UnableToCreateAssociatedAccount)?;
        }

        Ok(account_info)
    }
}
