use anchor_lang::prelude::*;

#[account]
pub struct DesciMarketplace {
    pub admin: Pubkey,
    pub fee: u16,  // Transaction fee percentage.
    pub bump: u8,
    pub treasury_bump: u8,
    pub name: String, //Set max length to be 32, dont' forget 4 bytes for header
    pub metadata_compliance_level: u8,
}

impl Space for DesciMarketplace {
    const INIT_SPACE: usize = 8 + 32 + 2 + 1 + 1 + 4 + 32 + 1;
}