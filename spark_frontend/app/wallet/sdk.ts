import { SparkClient, createSparkUserLightningInvoice, initWasmClient, querySparkLnurlp, sendUmaPayRequest } from 'js-sdk/src/spark-client';
import * as bip39 from 'bip39';

import { NoncePair, OperatorInfo, RPCResult, SparkWalletBindings } from 'js-sdk/wasm';
import { decode } from "@gandlaf21/bolt11-decode";

class WalletSDK {
  private client: SparkClient | null = null;
  private wallet: SparkWalletBindings | null = null;
  private initialized: boolean = false;

  constructor() {
    this.initAsync();
  }

  private async initAsync() {
    if (!this.initialized) {
      await initWasmClient();
      this.client = new SparkClient();
      this.initialized = true;
    }
  }

  /**
   * Generates a new 12-word mnemonic phrase.
   * @returns {string} A 12-word mnemonic phrase.
   */
  generateMnemonic(): string {
    return bip39.generateMnemonic();
  }

  /**
   * Imports a wallet using a mnemonic phrase and initializes the Spark client.
   * @param {string} mnemonic - The mnemonic phrase to import.
   * @returns {Promise<{ isValid: boolean; pubkey?: string }>} An object indicating the validity and the public key if valid.
   */
  async importWallet(mnemonic: string, phoneNumber: string): Promise<{ isValid: boolean; pubkey?: string }> {
      const isValid = bip39.validateMnemonic(mnemonic);
      if (isValid) {
          // Initialize the user's wallet with the new mnemonic
          const pubkey = await this.createSparkClient(mnemonic);

          // Check if the user has a master seed from registration (escrow wallet)
          const response = await fetch('https://spark-demo.dev.dev.sparkinfra.net/spark/user_master_seed', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ phone_number: phoneNumber }),
          });

          if (response.ok) {
              const { user_master_seed } = await response.json();
              // turn it into a Uint8Array
              const user_master_seed_array = new Uint8Array(Buffer.from(user_master_seed, 'hex'));
              // slice it to 32 bytes
              const user_master_seed_array_32 = user_master_seed_array.slice(0, 32);
              await this.ensureInitialized();
              if (!this.client) {
                throw new Error('WalletSDK not initialized. Call init() first.');
              }
              const bindings = this.client.getBindings();
    

              const network = bindings.Network.Bitcoin;

              const operators = [
                new OperatorInfo(0, 'https://spark-so-0.dev.dev.sparkinfra.net/', '038c21966f4bc45d454ae3a408bb69f9168525b14e059de29169a42b18bb9ff01d'),
                new OperatorInfo(1, 'https://spark-so-1.dev.dev.sparkinfra.net/', '0245f64a263c97134138fad72a497aca74d9cc122f260a243dcd6529b632a6dd4d'),
                new OperatorInfo(2, 'https://spark-so-2.dev.dev.sparkinfra.net/', '032664d0115c6bd2441d131b9c133f9a50dfebe4af170735ae343e93a1cec20a78'),
                new OperatorInfo(3, 'https://spark-so-3.dev.dev.sparkinfra.net/', '029d7db14a8587095656faf10f55a7ff30a3e44fcab26ba623a9c890520fb1efc9'),
                new OperatorInfo(4, 'https://spark-so-4.dev.dev.sparkinfra.net/', '033549b26c17e85da9edeb5f500ba40c849bb28773d474cc5f8e57647b4b855453')
              ];
              
              // Shuffle the array
              for (let i = operators.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [operators[i], operators[j]] = [operators[j], operators[i]];
              }
              
              const wallet = new bindings.SparkWalletBindings(user_master_seed_array_32, network, operators) as SparkWalletBindings;
              
              const escrowpubkey = wallet.get_master_public_key();
              console.log('Escrow public key:', Buffer.from(escrowpubkey).toString('hex'));

              // Get balance of the escrow wallet
              const escrowBalance = await wallet.get_balance();

              if (escrowBalance > 0) {
                  // Transfer the whole balance to the new user's wallet
                  await wallet.transfer(escrowBalance, pubkey);
              }
          } else {
            console.log("No master seed found");
          }

          // set the wallet back to the new wallet
          const realPubkey = await this.createSparkClient(mnemonic);



          console.log("Registering user");
          // Update the user's public key and remove the master seed
          const updateResponse = await fetch('https://spark-demo.dev.dev.sparkinfra.net/spark/register_user', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                  phone_number: phoneNumber,
                  pubkey: pubkey
              }),
          });

          if (!updateResponse.ok) {
              console.error('Failed to update user pubkey:', await updateResponse.text());
          } else {
            console.log("User registered");
          }

          return { isValid, pubkey: realPubkey };
      }
      return { isValid: false, pubkey: undefined };
  }
  /**
   * Creates a Spark client and initializes the wallet.
   * @param {string} mnemonic - The mnemonic phrase.
   * @returns {string} The public key in hexadecimal format.
   */
  async createSparkClient(mnemonic: string): Promise<string> {
    await this.ensureInitialized();
    if (!this.client) {
      throw new Error('WalletSDK not initialized. Call init() first.');
    }

    const bindings = this.client.getBindings();
    
    const seed = bip39.mnemonicToSeedSync(mnemonic);
    const masterKey = seed.slice(0, 32); // Use the first 32 bytes of the seed
    //console.log("Master Seed is: " + Buffer.from(masterKey).toString('hex'));
    const network = bindings.Network.Bitcoin;


    const operators = [
      new OperatorInfo(0, 'https://spark-so-0.dev.dev.sparkinfra.net/', '038c21966f4bc45d454ae3a408bb69f9168525b14e059de29169a42b18bb9ff01d'),
      new OperatorInfo(1, 'https://spark-so-1.dev.dev.sparkinfra.net/', '0245f64a263c97134138fad72a497aca74d9cc122f260a243dcd6529b632a6dd4d'),
      new OperatorInfo(2, 'https://spark-so-2.dev.dev.sparkinfra.net/', '032664d0115c6bd2441d131b9c133f9a50dfebe4af170735ae343e93a1cec20a78'),
      new OperatorInfo(3, 'https://spark-so-3.dev.dev.sparkinfra.net/', '029d7db14a8587095656faf10f55a7ff30a3e44fcab26ba623a9c890520fb1efc9'),
      new OperatorInfo(4, 'https://spark-so-4.dev.dev.sparkinfra.net/', '033549b26c17e85da9edeb5f500ba40c849bb28773d474cc5f8e57647b4b855453')
    ];
    
    // Shuffle the array
    for (let i = operators.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [operators[i], operators[j]] = [operators[j], operators[i]];
    }

    const wallet = new bindings.SparkWalletBindings(masterKey, network, operators) as SparkWalletBindings;
    
    const pubkey = wallet.get_master_public_key();
    this.wallet = wallet;
    return Buffer.from(pubkey).toString('hex');
  }

  /**
   * Creates a spark client with a seed key, not a mnemonic
   * @param {Uint8Array} seedKey - The seed key.
   * @returns {Promise<void>}
   */
  async createSparkClientWithSeedKey(seedKey: Uint8Array): Promise<void> {
    await this.ensureInitialized();
    if (!this.client) {
      throw new Error('WalletSDK not initialized. Call init() first.');
    }
    const bindings = this.client.getBindings();
    const network = bindings.Network.Bitcoin;
    const operators = [
      new OperatorInfo(0, 'https://spark-so-0.dev.dev.sparkinfra.net/', '038c21966f4bc45d454ae3a408bb69f9168525b14e059de29169a42b18bb9ff01d'),
      new OperatorInfo(1, 'https://spark-so-1.dev.dev.sparkinfra.net/', '0245f64a263c97134138fad72a497aca74d9cc122f260a243dcd6529b632a6dd4d'),
      new OperatorInfo(2, 'https://spark-so-2.dev.dev.sparkinfra.net/', '032664d0115c6bd2441d131b9c133f9a50dfebe4af170735ae343e93a1cec20a78'),
      new OperatorInfo(3, 'https://spark-so-3.dev.dev.sparkinfra.net/', '029d7db14a8587095656faf10f55a7ff30a3e44fcab26ba623a9c890520fb1efc9'),
      new OperatorInfo(4, 'https://spark-so-4.dev.dev.sparkinfra.net/', '033549b26c17e85da9edeb5f500ba40c849bb28773d474cc5f8e57647b4b855453')
    ];
    
    // Shuffle the array
    for (let i = operators.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [operators[i], operators[j]] = [operators[j], operators[i]];
    }
    this.wallet = new SparkWalletBindings(seedKey, network, operators);
  }
  /**
   * Gets the master xpriv key.
   * @returns {string}
   */
  getMasterXpriv(): string {
    if (!this.wallet) {
      throw new Error('Wallet not initialized. Call createSparkClient() first.');
    }
    return this.wallet.get_master_xpriv();
  }

  /**
   * Gets the master xpub key.
   * @returns {string}
   */
  getMasterXpub(): string {
    if (!this.wallet) {
      throw new Error('Wallet not initialized. Call createSparkClient() first.');
    }
    return this.wallet.get_master_xpub();
  }

  /**
   * Gets the master public key.
   * @returns {Uint8Array}
   */
  getMasterPublicKey(): Uint8Array {
    if (!this.wallet) {
      throw new Error('Wallet not initialized. Call createSparkClient() first.');
    }
    return this.wallet.get_master_public_key();
  }

  /**
   * Gets the master secret key.
   * @returns {Uint8Array}
   */
  getMasterSecretKey(): Uint8Array {
    if (!this.wallet) {
      throw new Error('Wallet not initialized. Call createSparkClient() first.');
    }
    return this.wallet.get_master_secret_key();
  }

  /**
   * Generates a new deposit address request.
   * @param {string | undefined} luma
   * @param {string | undefined} chroma
   * @returns {RPCResult}
   */
  newDepositAddressRequest(luma?: string, chroma?: string): RPCResult {
    if (!this.wallet) {
      throw new Error('Wallet not initialized. Call createSparkClient() first.');
    }
    return this.wallet.new_deposit_address_request(luma, chroma);
  }

  /**
   * Creates a nonce pair.
   * @param {number} index
   * @returns {NoncePair}
   */
  createNoncePair(index: number): NoncePair {
    if (!this.wallet) {
      throw new Error('Wallet not initialized. Call createSparkClient() first.');
    }
    return this.wallet.create_nonce_pair(index);
  }

  /**
   * Performs a deposit using a given UTXO.
   * @param {string} utxoTxid
   * @param {number} utxoVout
   * @param {bigint} utxoAmount
   * @param {string | undefined} luma
   * @param {string | undefined} chroma
   * @returns {Promise<void>}
   */
  async deposit(
    utxoTxid: string,
    utxoVout: number,
    utxoAmount: bigint,
    luma?: string,
    chroma?: string
  ): Promise<void> {
    if (!this.wallet) {
      throw new Error('Wallet not initialized. Call createSparkClient() first.');
    }
    await this.wallet.deposit(utxoTxid, utxoVout, utxoAmount, luma, chroma);
  }

  /**
   * Performs a transfer to a specified receiver.
   * @param {bigint} amount
   * @param {string} receiverPubkey
   * @param {string | undefined} luma
   * @param {string | undefined} chroma
   * @returns {Promise<void>}
   */
  async transfer(
    amount: bigint,
    receiverPubkey: string,
    luma?: string,
    chroma?: string
  ): Promise<void> {
    if (!this.wallet) {
      throw new Error('Wallet not initialized. Call createSparkClient() first.');
    }
    await this.wallet.transfer(amount, receiverPubkey, luma, chroma);
  }

  /**
   * Claims pending payments from SOs.
   * @returns {Promise<void>}
   */
  async claimPendingPayments(): Promise<void> {
    if (!this.wallet) {
      throw new Error('Wallet not initialized. Call createSparkClient() first.');
    }
    await this.wallet.claim_pending_payments();
  }

  /**
   * Fetches the balance of the user.
   * @returns {Promise<bigint>}
   */
  async getBtcBalance(): Promise<bigint> {
    await this.ensureInitialized();
    if (!this.wallet) {
      throw new Error('Wallet not initialized. Call createSparkClient() first.');
    }
    const balance = await this.wallet.get_balance();
    console.log("BTC Balance: ", balance);
    return balance;
  }

    /**
   * Fetches the balance of the user.
   * @returns {Promise<bigint>}
   */
    async getStablecoinBalance(): Promise<bigint> {
      await this.ensureInitialized();
      if (!this.wallet) {
        throw new Error('Wallet not initialized. Call createSparkClient() first.');
      }
      const balances = await this.wallet.get_lrc20_balance();
      console.log("Stablecoin Balance: ", balances);
      // TODO: Support different stablecoins seperately
      if (!balances) {
        console.log("No stablecoin balances provided.");
        return BigInt(0);
      } else if (balances instanceof Map) {
        const totalBalance = Array.from(balances.values()).reduce((sum, value) => sum + BigInt(value), BigInt(0));
        return totalBalance;
      } else {
        console.log("Unexpected type for stablecoin balance");
        return BigInt(0);
      }
    }

  /**
   * Synchronizes the wallet with the server by fetching the latest leaves and balances.
   * @returns {Promise<void>}
   */
  async syncWallet(): Promise<void> {
    await this.ensureInitialized();
    if (!this.wallet) {
      throw new Error('Wallet not initialized. Call createSparkClient() first.');
    }
    await this.wallet.sync_wallet();
  }

  /**
   * Creates a Lightning invoice payment hash.
   * @param {bigint} amount - The amount in satoshis.
   * @returns {Promise<string>}
   */
  async createLightningInvoice(amount: bigint, threshold: number, participants: number): Promise<string> {
    if (!this.wallet) {
      throw new Error('Wallet not initialized. Call createSparkClient() first.');
    }
    const paymentHash = await this.wallet.create_lightning_invoice_payment_hash(amount, threshold, participants);

    const invoice = await createSparkUserLightningInvoice("spark-demo.dev.dev.sparkinfra.net", {
      user_pubkey: Buffer.from(this.getMasterPublicKey()).toString('hex'),
      payment_hash: paymentHash,
      amount_sats: Number(amount)
    });

    return invoice.encoded_invoice;
  }

  /**
   * Pays a Lightning invoice.
   * @param {string} invoice - The encoded Lightning invoice.
   * @returns {Promise<void>}
   */
  async payLightningInvoice(invoice: string): Promise<void> {
    if (!this.wallet) {
      throw new Error('Wallet not initialized. Call createSparkClient() first.');
    }
    const decoded = decode(invoice);
    const amountSection = decoded.sections.find((section) => section.name === 'amount');
    if (!amountSection || !amountSection.value) {
      throw new Error('Amount not found in the invoice');
    }
    const amount = BigInt(amountSection.value / 1000);


    await this.wallet.send_lightning_payment(invoice, amount, "03c56f7d10037de2cd79db8cd0d32482bfa78e848e502f2b6c6c647f8f36151084");

    // await payLightningInvoice("https://spark-demo.dev.dev.sparkinfra.net", {
    //   user_pubkey: Buffer.from(this.getMasterPublicKey()).toString('hex'),
    //   encoded_invoice: invoice
    // });

    const paymentResponse = await fetch('https://spark-demo.dev.dev.sparkinfra.net/spark/pay_invoice', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_pubkey: Buffer.from(this.getMasterPublicKey()).toString('hex'),
        encoded_invoice: invoice
      }),
    });

    if (!paymentResponse.ok) {
      throw new Error('Failed to pay Lightning invoice');
    }

    const paymentData = await paymentResponse.json();
    console.log('Payment response:', paymentData);
  }

  /**
   * Decodes a UMA or LNURL address and retrieves the corresponding Lightning invoice.
   * @param {string} uma - The UMA address or LNURL.
   * @param {bigint} amount - The amount in satoshis.
   * @returns {Promise<string>} The encoded Lightning invoice.
   */
  async decodeUma(uma: string, amount: bigint): Promise<string> {
    if (uma.startsWith('$')) {
      // Handle UMA address
      const lnurlPayReq = await querySparkLnurlp("spark-demo.dev.dev.sparkinfra.net", uma);
      const invoice = await sendUmaPayRequest("spark-demo.dev.dev.sparkinfra.net", {
        receiver_uma_address: uma,
        receiving_amount: Number(amount),
        receiving_currency_code: "SAT",
        payreq_url: lnurlPayReq.payreq_url
      });
      return invoice.encoded_invoice;
    } else {
      // Handle LNURL address
      // Assume the address is in the format 'username@domain.com'
      const [username, domain] = uma.split('@');
      if (!username || !domain) {
        throw new Error('Invalid LNURL address format');
      }

      // Construct the LNURL pay endpoint
      const lnurlpUrl = `https://${domain}/.well-known/lnurlp/${username}`;
      const lnurlpResponse = await fetch(lnurlpUrl);
      if (!lnurlpResponse.ok) {
        throw new Error('Failed to fetch LNURL pay information');
      }

      const lnurlpData = await lnurlpResponse.json();
      const { callback, minSendable, maxSendable } = lnurlpData;
      const milliSatoshiAmount = Number(amount) * 1000; // Convert satoshis to millisatoshis

      if (milliSatoshiAmount < minSendable || milliSatoshiAmount > maxSendable) {
        throw new Error('Amount is out of bounds for this LNURL pay request');
      }

      // Append the amount to the callback URL
      const callbackUrl = new URL(callback);
      callbackUrl.searchParams.append('amount', milliSatoshiAmount.toString());

      // Fetch the invoice from the callback URL
      const invoiceResponse = await fetch(callbackUrl.toString());
      if (!invoiceResponse.ok) {
        throw new Error('Failed to fetch invoice from the LNURL callback');
      }

      const invoiceData = await invoiceResponse.json();
      if (!invoiceData.pr) {
        throw new Error('Invoice data does not contain an invoice');
      }

      return invoiceData.pr;
    }
  }
  private async ensureInitialized() {
    if (!this.initialized) {
      await this.initAsync();
    }
  }
}

export const walletSDK = new WalletSDK();