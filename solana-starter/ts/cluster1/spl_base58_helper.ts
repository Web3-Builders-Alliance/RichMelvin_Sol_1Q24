import * as bs58 from 'bs58';

const byteString = "138,221,107,17,234,215,251,181,173,12,255,22,105,131,95,111,183,237,50,28,123,110,128,124,59,29,148,37,103,154,64,166,110,40,132,10,119,161,13,205,203,118,214,91,57,173,63,94,51,251,213,105,89,50,41,91,101,231,150,0,177,130,38,2,73,5,67,99,10";
const bytes = byteString
  .split(',') // Split by comma
  .map(Number); // Convert strings to numbers

const base58String = bs58.encode(Uint8Array.from(bytes)).toString();

console.log("Base58:", base58String);