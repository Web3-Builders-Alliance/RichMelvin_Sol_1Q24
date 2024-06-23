use anchor_lang::prelude::*;

#[account]
pub struct Listing {
    pub maker: Pubkey,          // Creator or current owner of the listing.
    pub mint: Pubkey,           // Mint address of the NFT
    pub issued_nfts: u64,       // Number of NFTs already issued
    pub max_nfts: u64,          //Maximum number of NFTs that can be issued
    pub price: u64,             // Listing price in lamports (or smallest unit of a token) for 1 year access.
    pub monthly_price: u64,      // Price for 1-month access.
    pub semiannual_price: u64,   // Price for 6-months access.
    pub active: bool,           // Status to indicate if the listing is active
    pub metadata_url: String,     // URL to metadata describing the data set.
    pub access_duration: i64,   // Access duration in seconds.
    pub encryption_key: String,  // Encrypted key or token for accessing the data.
    pub creation_time: i64,     // Timestamp of listing creation.
    pub expiry_date: i64,       // Stores the expiry date
}

impl Listing {
    pub fn space() -> usize {
        8 +         // discriminator
        32 +        // maker pubkey
        32 +        //mint pubkey
        8 +         //issued_nfts as u64
        8 +         //max_nfts as u64
        8 +         //price as u64
        8 +         //monthly_price as u64
        8 +         //semiannual_price as u64
        1 +         // active as bool
        4 + 256 +   // metadata_url (max 256 bytes plus 4 bytes for the length prefix)
        8 +         // access_duration as i64
        4 + 256 +   //encryption_key (max 256 bytes plus 4 bytes for the length prefix)
        8 +         // creation_time as i64
        8           // expiry_date
    }
}