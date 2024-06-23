use anchor_lang::error_code;

#[error_code]
pub enum DesciMarketplaceError {
    // General Errors
    #[msg("Name must be between 1 and 32 characters")]
    NameTooLong,

    #[msg("Invalid price provided, must be greater than zero")]
    InvalidPrice,

    #[msg("Invalid fee provided, must be greater than zero")]
    InvalidFee,

    // Listing Errors
    #[msg("Unable to list the data set, check listing parameters and account permissions")]
    UnableToList,

    #[msg("Unable to deposit NFT into vault, check ownership and vault status")]
    UnableToDepositNFT,

    // Payment Errors
    #[msg("Payment transaction failed, ensure sufficient funds and correct account details")]
    PaymentFailed,

    // NFT Transfer Errors
    #[msg("Failed to transfer NFT, check ownership and recipient's account status")]
    NFTTransferFailed,

    // Metadata Errors
    #[msg("Metadata validation failed")]
    MetadataValidationFailed,

    // Access Errors
    #[msg("Access to this NFT has expired")]
    AccessExpired,

    #[msg("The listing is not active")]
    ListingNotActive,

    // Vault Errors
    #[msg("Failed to close mint vault, check account status and permissions")]
    FailedToCloseMintVault,
}
