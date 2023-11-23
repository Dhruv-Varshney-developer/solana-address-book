const solanaWeb3 = require('@solana/web3.js');

main();

async function main() {
    const connection = new solanaWeb3.Connection(solanaWeb3.clusterApiUrl('devnet'));
    const slot = await connection.getSlot();
    const payer = solanaWeb3.Keypair.generate();
    const authority = solanaWeb3.Keypair.generate();
    console.log('Payer address:', payer.publicKey.toBase58());
    console.log('Authority address:', authority.publicKey.toBase58());  
    console.log('Recent slot:', slot);
    console.log('connection', connection);
  
    const [lookupTableInst, lookupTableAddress] = await createLookupTable(connection, payer, authority);
  
    const addressesToAdd = [
      payer.publicKey,
      solanaWeb3.SystemProgram.programId,
      // Add more addresses as needed
    ];
  
    const extendInstruction = await extendLookupTable(connection, payer,authority, lookupTableAddress, addressesToAdd);
  
    // Create other transaction instructions as needed
    const arrayOfInstructions = [extendInstruction];
  
    const recentBlockhash = await connection.getRecentBlockhash();
    const messageV0 = new solanaWeb3.TransactionMessage({
      recentBlockhash,
      instructions: arrayOfInstructions,
    });
    
    const transactionV0 = new solanaWeb3.VersionedTransaction({
      message: messageV0.compileToV0Message(),
    });
    transactionV0.sign([payer]);
    
    const txid = await solanaWeb3.sendAndConfirmTransaction(connection, transactionV0);
    
  
    console.log(`Transaction: https://explorer.solana.com/tx/${txid}?cluster=devnet`);
  }
  

async function createLookupTable(connection, payer, authority) {
  
  const [lookupTableInst, lookupTableAddress] = solanaWeb3.AddressLookupTableProgram.createLookupTable({
    authority: authority.publicKey,
    payer: payer.publicKey,
    recentSlot: slot,
  });
  console.log('Lookup table address:', lookupTableAddress.toBase58());
  return [lookupTableInst, lookupTableAddress];
}

async function extendLookupTable(connection, payer,authority, lookupTableAddress, addresses) {
  const extendInstruction = solanaWeb3.AddressLookupTableProgram.extendLookupTable({
    payer: authority.publicKey,
    authority: payer.publicKey,
    lookupTable: lookupTableAddress,
    addresses,
  });
  return extendInstruction;
}



