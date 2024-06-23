use anchor_lang::prelude::*;

#[account]
pub struct Metadata {
    pub name: String,
    pub symbol: String,
    pub uri: String,
    pub data_type: String,  //Descriptive field for data type: e.g. WGS, SNP, pedigree, RNAseq, EST, qPCR
    pub organism: String,   //Descriptive field for organism. Use code as for KEGG: https://www.genome.jp/kegg/tables/br08606.html
}

impl Metadata {
    pub fn space() -> usize {
        8 +             // discriminator
        4 + 32 +        // name (max 32 bytes plus 4 bytes for length prefix)
        4 + 10 +        // symbol (max 10 bytes plus 4 bytes for length prefix)
        4 + 200 +       // uri (max 200 bytes plus 4 bytes for length prefix)
        4 + 20 +        // data_type (max 20 bytes plus 4 bytes for length prefix)
        4 + 20          // organism (max 20 bytes plus 4 bytes for length prefix)
    }
}