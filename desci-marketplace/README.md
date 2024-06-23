# Desci Marketplace

## Introduction

This Desci Marketplace is a blockchain-based platform on the Solana network designed to facilitate the listing, purchasing, and delisting of NFTs that represent access to scientific data sets. The marketplace operates through three key roles: the Maker, the Taker, and the Marketplace.

- **Maker**: The creator or current owner of a data set who lists the NFT on the marketplace. Makers earn royalties on the usage of their data sets, incentivizing them to provide high-quality data.
- **Taker**: The user who purchases an NFT to gain access to a data set. Takers make a small deposit that is returned when they return the NFT. Returning Takers also receive a discount on future purchases, encouraging continued use of the marketplace.
- **Marketplace**: The platform that facilitates the transactions between Makers and Takers, ensuring secure and efficient management of listings and payments.

## Features

- **NFT Listings**: Makers can list their data sets as NFTs on the marketplace.
- **Secure Transactions**: The marketplace handles secure transactions, including deposits and administrative fees.
- **Royalties**: Makers earn royalties on the usage of their data sets.
- **Deposits**: Takers make a deposit that is refunded upon returning the NFT.
- **Discounts**: Returning Takers receive a discount on future purchases.

## Usage

### Listing an NFT
Makers can list a genetic data set by calling the `list` function. Provide the necessary parameters such as price, metadata, max NFTs, encryption key, duration, and other details.

### Purchasing an NFT
Takers can purchase an NFT by calling the `purchase` function, specifying the desired access duration. The system will handle the transaction, including fees and metadata updates.

### Delisting an NFT
Makers can delist their NFTs by calling the `delist` function, which withdraws the NFT from the marketplace.

## Code Overview

### contexts/init.rs
Handles the initialization of the marketplace. Sets up the admin, treasury, and initial configurations.

### contexts/list.rs
Manages the listing of NFTs. Includes creating listings, handling associated token accounts, and initializing metadata.

### contexts/purchase.rs
Manages the purchase process. Calculates prices, handles deposits, admin fees, royalties, and transfers NFTs to buyers.

### contexts/delist.rs
Handles the delisting of NFTs, ensuring proper withdrawal and transfer of the NFT back to the maker.

### state/desci_marketplace.rs
Defines the `DesciMarketplace` struct, which holds the marketplace's state, including admin, fee, bumps, and metadata compliance level.

### state/listing.rs
Defines the `Listing` struct, which holds the state of each listed NFT, including maker, mint, prices, metadata URL, and access details.

### state/metadata.rs
Defines the `Metadata` struct, which holds metadata information such as name, symbol, URI, data type, and organism.

### errors.rs
Defines custom error types for handling various failure scenarios in the marketplace.

### lib.rs
The main entry point of the program, defining the initialization, listing, purchase, and delisting functions.

### tests/desci-marketplace.ts
Contains tests for the marketplace functions, including initialization, listing, purchasing, and delisting.


## TODO

- [ ] Implement browsing functionality for users to view available NFT listings.
- [ ] Include an encoded access key in the NFT metadata.
- [ ] Rank data sets by usage statistics.
- [ ] Implement incentives to remove unused or little-used data sets to a subordinate, storage (freezer). Listings in the freezer do not appear in the regular marketplace but can be browsed and 'thawed' upon request.

