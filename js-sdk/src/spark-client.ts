import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { initWasm, getWasmModule } from './wasm-wrapper.js';

export async function initWasmClient() {
  await initWasm();
}

export class SparkClient {
  private wasmBindings: any;

  constructor() {
    initWasm();
    this.wasmBindings = getWasmModule();
  }

  getBindings() {
    return this.wasmBindings;
  }

  // Your methods here, using this.wasmBindings instead of directly importing from wallet_bindings.js
}

export async function createSparkUserLightningInvoice(host: string, params: {
  user_pubkey: string;
  payment_hash: string;
  amount_sats: number;
}): Promise<{ encoded_invoice: string }> {
  const url = `https://${host}/spark/create_invoice`;
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return {
      encoded_invoice: data.encoded_invoice,
    };
  } catch (error) {
    console.error('Error creating Spark user lightning invoice:', error);
    throw error;
  }
}

export async function getSparkUserPubkey(host: string, phoneNumber: string): Promise<{ user_pubkey: string }> {
  const url = `https://${host}/spark/user_pubkey`;
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ phone_number: phoneNumber }),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return {
      user_pubkey: data.user_pubkey,
    };
  } catch (error) {
    console.error('Error getting Spark user public key:', error);
    throw error;
  }
}


export async function getSparkUserMasterSeed(host: string, phoneNumber: string): Promise<{ user_master_seed: string }> {
  const url = `https://${host}/spark/user_master_seed`;
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ phone_number: phoneNumber }),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return {
      user_master_seed: data.user_master_seed,
    };
  } catch (error) {
    console.error('Error getting Spark user master seed:', error);
    throw error;
  }
}

export async function notifyReceiverTransfer(host: string, params: {
  receiver_phone_number: string;
  currency: string;
  amount: number;
}): Promise<void> {
  const url = `https://${host}/spark/notify_receiver_transfer`;
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    console.error('Error notifying receiver of transfer:', error);
    throw error;
  }
}

export async function payLightningInvoice(host: string, params: {
  user_pubkey: string;
  encoded_invoice: string;
}): Promise<{
  id: string;
  user_pubkey: string;
  encoded_invoice: string;
  status: 'CREATED' | 'PAYMENT_INITIATED' | 'PAYMENT_SUCCEEDED' | 'COMPLETED' | 'PAYMENT_FAILED' | 'SPARK_NODES_TRANSFER_FAILED';
}> {
  const url = `https://${host}/spark/pay_invoice`;
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error paying lightning invoice:', error);
    throw error;
  }
}

export async function querySparkLnurlp(host: string, uma: string): Promise<any> {
  const url = `https://${host}/spark/uma/lnurlp/${encodeURIComponent(uma)}`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error querying Spark LNURL-pay:', error);
    throw error;
  }
}

export async function sendUmaPayRequest(host: string, params: {
  receiver_uma_address: string;
  receiving_amount: number;
  receiving_currency_code: string;
  payreq_url: string;
}): Promise<{ encoded_invoice: string; invoice_amount_msats: number }> {
  const url = `https://${host}/spark/uma/payreq`;
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return {
      encoded_invoice: data.encoded_invoice,
      invoice_amount_msats: data.invoice_amount_msats,
    };
  } catch (error) {
    console.error('Error sending UMA pay request:', error);
    throw error;
  }
}
