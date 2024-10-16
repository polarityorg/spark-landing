import { OperatorInfo, SparkWalletBindings } from '../wasm/wallet_bindings';
import { SparkClient, createSparkUserLightningInvoice, initWasmClient } from './spark-client';
import * as bip39 from 'bip39';

async function testWalletCreation() {
  // Step 1: Initialize the WASM client
  await initWasmClient();

  // Step 2: Create a new SparkClient instance
  const sparkClient = new SparkClient();

  // Step 3: Get the WASM bindings
  const wasmBindings = sparkClient.getBindings();


  let mnemonic = "idea chunk unaware hazard sunset visit cinnamon muscle have better street rigid"
  const seed = bip39.mnemonicToSeedSync(mnemonic);
  const masterKey = seed.slice(0, 32); // Use the first 32 bytes of the seed

  const network = wasmBindings.Network.Bitcoin;
  const operators = [
    new OperatorInfo(0, 'https://spark-so-0.dev.dev.sparkinfra.net/', '038c21966f4bc45d454ae3a408bb69f9168525b14e059de29169a42b18bb9ff01d'),
    new OperatorInfo(1, 'https://spark-so-1.dev.dev.sparkinfra.net/', '0245f64a263c97134138fad72a497aca74d9cc122f260a243dcd6529b632a6dd4d'),
    new OperatorInfo(2, 'https://spark-so-2.dev.dev.sparkinfra.net/', '032664d0115c6bd2441d131b9c133f9a50dfebe4af170735ae343e93a1cec20a78'),
    new OperatorInfo(3, 'https://spark-so-3.dev.dev.sparkinfra.net/', '029d7db14a8587095656faf10f55a7ff30a3e44fcab26ba623a9c890520fb1efc9'),
    new OperatorInfo(4, 'https://spark-so-4.dev.dev.sparkinfra.net/', '033549b26c17e85da9edeb5f500ba40c849bb28773d474cc5f8e57647b4b855453')
  ];
  const wallet = new wasmBindings.SparkWalletBindings(masterKey, network, operators) as SparkWalletBindings;

  console.log("Public Key: ", Buffer.from(wallet.get_master_public_key()).toString('hex'));
  const balance = await wallet.get_balance();
  console.log(balance);

    // const invoice = await createSparkUserLightningInvoice("https://spark-demo.dev.dev.sparkinfra.net", {
    //   user_pubkey: Buffer.from(wallet.get_master_public_key()).toString('hex'),
    //   payment_hash: paymentHash,
    //   amount_sats: Number(1000)
    // });

    // console.log(invoice.encoded_invoice);
}

// Run the test
testWalletCreation().catch(console.error);