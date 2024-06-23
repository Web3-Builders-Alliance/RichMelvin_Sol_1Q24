use anchor_lang::prelude::*;
use anchor_spl::token_interface::{Mint, TokenInterface};

use crate::state::DesciMarketplace;
use crate::errors::DesciMarketplaceError;

//Struct used for handling account validation and lifecyle within a program instruction.
#[derive(Accounts)]

// An initialization instruction that passes a name string to the program.
#[instruction(name: String)]
pub struct Initialize<'info> {
    #[account(mut)]
    //Administrator who has authority to initialize the marketplace. 
    admin: Signer<'info>,
    #[account(
        init,
        space = DesciMarketplace::INIT_SPACE,
        payer = admin,
        seeds = [b"desciMarketplace", name.as_str().as_bytes()],
        bump
    )]
    //A program owned account that stores state about the descimarketplace. Initialized with specific seeds for deriving unique, consistent addresses.
    descimarketplace: Account<'info, DesciMarketplace>,
    #[account(
        seeds = [b"treasury", descimarketplace.key().as_ref()],
        bump,
    )]
    //A tresury for storing funds related to transaction fees, operation funds, royalties.
    treasury: SystemAccount<'info>,

    //System and Token programs of Solana. Used to create accounts and handling token-related instructions.
    system_program: Program<'info, System>,
    token_program: Interface<'info, TokenInterface>,
}

/* Implementatino of the DesciMarketplace that functions to initialize the descimarketplace account with details of
admin's pubkey, a fee structure, name of the marketplace, bumps for deterministic address creation. Includes validation of the marketplace name.
*/

impl<'info> Initialize<'info> {
    pub fn init(&mut self, name: String, fee: u16, metadata_compliance_level: u8, bumps: &InitializeBumps) -> Result<()> {
        require!(name.len() > 0 && name.len() < 33, DesciMarketplaceError::NameTooLong);
        require!(fee > 0, DesciMarketplaceError::InvalidFee);
        self.descimarketplace.set_inner(DesciMarketplace {
            admin: self.admin.key(),
            fee,
            name,
            bump: bumps.descimarketplace,
            treasury_bump: bumps.treasury,
            metadata_compliance_level,   // Initialized with a default value  
        });

        Ok(())
    }
}