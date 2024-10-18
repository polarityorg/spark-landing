/* tslint:disable */
/* eslint-disable */
/**
 * An enum representing the network type. Convertible to and from the `bitcoin::Network` enum.
 */
export enum Network {
  /**
   * Mainnet Bitcoin.
   */
  Bitcoin = 0,
  /**
   * Bitcoin's testnet network.
   */
  Testnet = 1,
  /**
   * Bitcoin's signet network.
   */
  Signet = 2,
  /**
   * Bitcoin's regtest network.
   */
  Regtest = 3,
}
/**
 * Error types that can be returned by the wallet.
 */
export enum SparkError {
  /**
   * An error occurred.
   */
  InternalError = 0,
  /**
   * An error occurred during creating preimage.
   */
  CreatePreImageError = 1,
  /**
   * An error occurred during the serialization of json.
   */
  SerializationError = 2,
  /**
   * An error occurred during the creation of a nonce pair.
   */
  CreateNoncePairError = 3,
  /**
   * An error occurred during the deposit
   */
  DepositError = 4,
  /**
   * An error occurred during the transfer operation.
   */
  TransferError = 5,
  /**
   * An error occurred during the claim operation.
   */
  ClaimError = 6,
  /**
   * An error occurred during the synchronization process.
   */
  SyncError = 7,
}
/**
 * A struct representing the result of a deposit operation.
 */
export class DepositResult {
  free(): void;
  /**
   * Returns the signed deposit transaction.
   * @returns {string}
   */
  signed_deposit_tx(): string;
  /**
   * Returns the signed intermediate transaction.
   * @returns {string}
   */
  signed_intermediate_tx(): string;
  /**
   * Returns the signed exit transaction.
   * @returns {string}
   */
  signed_exit_tx(): string;
}
/**
 * A struct representing the result of a nonce pair operation.
 */
export class NoncePair {
  free(): void;
  /**
   * Creates a new NoncePairResult.
   * @param {Uint8Array} secret_key1
   * @param {Uint8Array} secret_key2
   * @param {Uint8Array} public_key1
   * @param {Uint8Array} public_key2
   * @returns {NoncePair}
   */
  static new(secret_key1: Uint8Array, secret_key2: Uint8Array, public_key1: Uint8Array, public_key2: Uint8Array): NoncePair;
  /**
   * Returns the secret key.
   * @returns {Uint8Array}
   */
  secret_key1(): Uint8Array;
  /**
   * Returns the secret key.
   * @returns {Uint8Array}
   */
  secret_key2(): Uint8Array;
  /**
   * Returns the public key.
   * @returns {Uint8Array}
   */
  public_key1(): Uint8Array;
  /**
   * Returns the public key.
   * @returns {Uint8Array}
   */
  public_key2(): Uint8Array;
}
/**
 * Information about an operator.
 */
export class OperatorInfo {
  free(): void;
  /**
   * Creates a new OperatorInfo instance.
   * @param {number} id
   * @param {string} url
   * @param {string} master_public_key
   */
  constructor(id: number, url: string, master_public_key: string);
  /**
   * Returns the ID of the operator.
   * @returns {number}
   */
  id(): number;
  /**
   * Returns the URL of the operator.
   * @returns {string}
   */
  url(): string;
  /**
   * Returns the master public key of the operator.
   * @returns {string}
   */
  master_public_key(): string;
}
/**
 * A struct representing the result of a preimage operation.
 */
export class PreimageResult {
  free(): void;
  /**
   * Creates a new PreimageResult.
   * @param {string} preimage
   * @param {string} payment_hash
   * @param {(PreimageShard)[]} preimage_shard
   * @returns {PreimageResult}
   */
  static new(preimage: string, payment_hash: string, preimage_shard: (PreimageShard)[]): PreimageResult;
  /**
   * Returns the preimage.
   * @returns {string}
   */
  preimage(): string;
  /**
   * Returns the payment hash.
   * @returns {string}
   */
  payment_hash(): string;
  /**
   * Returns the preimage shard.
   * @returns {(PreimageShard)[]}
   */
  preimage_shard(): (PreimageShard)[];
}
/**
 * A struct representing a shard of the preimage.
 */
export class PreimageShard {
  free(): void;
}
/**
 * A struct representing the result of an RPC call.
 *
 * This struct encapsulates the method name and parameters of an RPC call,
 * typically used for communication between the wallet and a server.
 */
export class RPCResult {
  free(): void;
  /**
   * Creates a new RPCResult instance.
   *
   * # Arguments
   *
   * * `method` - A string slice containing the name of the RPC method.
   * * `params` - A string slice containing the JSON-encoded parameters of the RPC call.
   *
   * # Returns
   *
   * A new `RPCResult` instance.
   * @param {string} method
   * @param {string} params
   * @returns {RPCResult}
   */
  static new(method: string, params: string): RPCResult;
  /**
   * Returns the RPC method name.
   * @returns {string}
   */
  method(): string;
  /**
   * Returns the RPC parameters as a JSON string.
   * @returns {string}
   */
  params(): string;
}
/**
 * A struct representing the WebAssembly bindings for the Spark wallet.
 */
export class SparkWalletBindings {
  free(): void;
  /**
   * Creates a new SparkWalletWasm instance.
   * @param {Uint8Array} master_key
   * @param {Network} network
   * @param {(OperatorInfo)[]} so_list
   */
  constructor(master_key: Uint8Array, network: Network, so_list: (OperatorInfo)[]);
  /**
   * Gets the master xpriv key
   * @returns {string}
   */
  get_master_xpriv(): string;
  /**
   * Gets the master xpub key
   * @returns {string}
   */
  get_master_xpub(): string;
  /**
   * Gets the master public key
   * @returns {Uint8Array}
   */
  get_master_public_key(): Uint8Array;
  /**
   * Gets the master secret key
   * @returns {Uint8Array}
   */
  get_master_secret_key(): Uint8Array;
  /**
   * Generates a new deposit address request. This is the first step in the deposit process.
   * @param {string | undefined} [luma]
   * @param {string | undefined} [chroma]
   * @returns {RPCResult}
   */
  new_deposit_address_request(luma?: string, chroma?: string): RPCResult;
  /**
   * Creates a nonce pair
   * @param {number} index
   * @returns {NoncePair}
   */
  create_nonce_pair(index: number): NoncePair;
  /**
   * Create and distribute lightning preimage.
   * @param {bigint} amount_sats
   * @param {number} threshold
   * @param {number} participants
   * @returns {Promise<string>}
   */
  create_lightning_invoice_payment_hash(amount_sats: bigint, threshold: number, participants: number): Promise<string>;
  /**
   * Locks leaves on condition that an invoice is paid
   * This is called by the user when the user wants to pay a Lightning invoice
   * THIS IS CALLED BY THE USER, THE SSP MUST BE CALLED AFTER SO IT CAN ACTUALYL SEND AND SETTLE
   * THE LN PAYMENT
   * @param {string} invoice
   * @param {bigint | undefined} amount
   * @param {string} ssp_pubkey
   * @returns {Promise<void>}
   */
  send_lightning_payment(invoice: string, amount: bigint | undefined, ssp_pubkey: string): Promise<void>;
  /**
   * Performs a deposit using a given UTXO.
   *
   * # Arguments
   * * `utxo_txid` - The transaction ID (as a hex string) of the UTXO to deposit.
   * * `utxo_vout` - The output index of the UTXO to deposit.
   * * `utxo_amount` - The amount of the UTXO in satoshis.
   * @param {string} utxo_txid
   * @param {number} utxo_vout
   * @param {bigint} utxo_amount
   * @param {string | undefined} [luma]
   * @param {string | undefined} [chroma]
   * @returns {Promise<void>}
   */
  deposit(utxo_txid: string, utxo_vout: number, utxo_amount: bigint, luma?: string, chroma?: string): Promise<void>;
  /**
   * Performs a transfer to a specified receiver.
   *
   * # Arguments
   * * `amount` - The amount of funds to transfer in satoshis.
   * * `receiver_pubkey` - The public key of the receiver as a 33-byte array.
   * @param {bigint} amount
   * @param {string} receiver_pubkey
   * @param {string | undefined} [luma]
   * @param {string | undefined} [chroma]
   * @returns {Promise<void>}
   */
  transfer(amount: bigint, receiver_pubkey: string, luma?: string, chroma?: string): Promise<void>;
  /**
   * Claim pending payments from SOs.
   * @returns {Promise<void>}
   */
  claim_pending_payments(): Promise<void>;
  /**
   * Fetches the balance of the user.
   * @returns {Promise<bigint>}
   */
  get_balance(): Promise<bigint>;
  /**
   * Fetches the balance of the user.
   * @returns {Promise<any>}
   */
  get_lrc20_balance(): Promise<any>;
  /**
   * Synchronizes the wallet with the server by fetching the latest leaves and balances.
   * @returns {Promise<void>}
   */
  sync_wallet(): Promise<void>;
}

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly __wbg_sparkwalletbindings_free: (a: number, b: number) => void;
  readonly sparkwalletbindings_new: (a: number, b: number, c: number, d: number, e: number) => number;
  readonly sparkwalletbindings_get_master_xpriv: (a: number, b: number) => void;
  readonly sparkwalletbindings_get_master_xpub: (a: number, b: number) => void;
  readonly sparkwalletbindings_get_master_public_key: (a: number, b: number) => void;
  readonly sparkwalletbindings_get_master_secret_key: (a: number, b: number) => void;
  readonly sparkwalletbindings_new_deposit_address_request: (a: number, b: number, c: number, d: number, e: number, f: number) => void;
  readonly sparkwalletbindings_create_nonce_pair: (a: number, b: number, c: number) => void;
  readonly sparkwalletbindings_create_lightning_invoice_payment_hash: (a: number, b: number, c: number, d: number) => number;
  readonly sparkwalletbindings_send_lightning_payment: (a: number, b: number, c: number, d: number, e: number, f: number, g: number) => number;
  readonly sparkwalletbindings_deposit: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number, i: number) => number;
  readonly sparkwalletbindings_transfer: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number) => number;
  readonly sparkwalletbindings_claim_pending_payments: (a: number) => number;
  readonly sparkwalletbindings_get_balance: (a: number) => number;
  readonly sparkwalletbindings_get_lrc20_balance: (a: number) => number;
  readonly sparkwalletbindings_sync_wallet: (a: number) => number;
  readonly __wbg_depositresult_free: (a: number, b: number) => void;
  readonly depositresult_signed_deposit_tx: (a: number, b: number) => void;
  readonly depositresult_signed_intermediate_tx: (a: number, b: number) => void;
  readonly depositresult_signed_exit_tx: (a: number, b: number) => void;
  readonly __wbg_preimageshard_free: (a: number, b: number) => void;
  readonly __wbg_preimageresult_free: (a: number, b: number) => void;
  readonly preimageresult_new: (a: number, b: number, c: number, d: number, e: number, f: number) => number;
  readonly preimageresult_preimage: (a: number, b: number) => void;
  readonly preimageresult_payment_hash: (a: number, b: number) => void;
  readonly preimageresult_preimage_shard: (a: number, b: number) => void;
  readonly __wbg_noncepair_free: (a: number, b: number) => void;
  readonly noncepair_new: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number) => number;
  readonly noncepair_secret_key1: (a: number, b: number) => void;
  readonly noncepair_secret_key2: (a: number, b: number) => void;
  readonly noncepair_public_key1: (a: number, b: number) => void;
  readonly noncepair_public_key2: (a: number, b: number) => void;
  readonly __wbg_rpcresult_free: (a: number, b: number) => void;
  readonly rpcresult_new: (a: number, b: number, c: number, d: number) => number;
  readonly rpcresult_method: (a: number, b: number) => void;
  readonly rpcresult_params: (a: number, b: number) => void;
  readonly __wbg_operatorinfo_free: (a: number, b: number) => void;
  readonly operatorinfo_new: (a: number, b: number, c: number, d: number, e: number) => number;
  readonly operatorinfo_id: (a: number) => number;
  readonly operatorinfo_url: (a: number, b: number) => void;
  readonly operatorinfo_master_public_key: (a: number, b: number) => void;
  readonly rustsecp256k1_v0_9_2_context_create: (a: number) => number;
  readonly rustsecp256k1_v0_9_2_context_destroy: (a: number) => void;
  readonly rustsecp256k1_v0_9_2_default_illegal_callback_fn: (a: number, b: number) => void;
  readonly rustsecp256k1_v0_9_2_default_error_callback_fn: (a: number, b: number) => void;
  readonly rustsecp256k1_v0_10_0_context_create: (a: number) => number;
  readonly rustsecp256k1_v0_10_0_context_destroy: (a: number) => void;
  readonly rustsecp256k1_v0_10_0_default_illegal_callback_fn: (a: number, b: number) => void;
  readonly rustsecp256k1_v0_10_0_default_error_callback_fn: (a: number, b: number) => void;
  readonly __wbindgen_export_0: (a: number, b: number) => number;
  readonly __wbindgen_export_1: (a: number, b: number, c: number, d: number) => number;
  readonly __wbindgen_export_2: WebAssembly.Table;
  readonly __wbindgen_export_3: (a: number, b: number, c: number) => void;
  readonly __wbindgen_export_4: (a: number, b: number) => void;
  readonly __wbindgen_export_5: (a: number, b: number, c: number) => void;
  readonly __wbindgen_export_6: (a: number, b: number) => void;
  readonly __wbindgen_add_to_stack_pointer: (a: number) => number;
  readonly __wbindgen_export_7: (a: number, b: number, c: number) => void;
  readonly __wbindgen_export_8: (a: number) => void;
  readonly __wbindgen_export_9: (a: number, b: number, c: number, d: number) => void;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;
/**
* Instantiates the given `module`, which can either be bytes or
* a precompiled `WebAssembly.Module`.
*
* @param {{ module: SyncInitInput }} module - Passing `SyncInitInput` directly is deprecated.
*
* @returns {InitOutput}
*/
export function initSync(module: { module: SyncInitInput } | SyncInitInput): InitOutput;

/**
* If `module_or_path` is {RequestInfo} or {URL}, makes a request and
* for everything else, calls `WebAssembly.instantiate` directly.
*
* @param {{ module_or_path: InitInput | Promise<InitInput> }} module_or_path - Passing `InitInput` directly is deprecated.
*
* @returns {Promise<InitOutput>}
*/
export default function __wbg_init (module_or_path?: { module_or_path: InitInput | Promise<InitInput> } | InitInput | Promise<InitInput>): Promise<InitOutput>;
