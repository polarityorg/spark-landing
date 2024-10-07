import * as bip39 from 'bip39';
import { HDKey } from '@scure/bip32';

export const walletSDK = {

    /**
     * Generates a new 12-word mnemonic phrase.
     * @returns {string} A 12-word mnemonic phrase.
     */
    generateMnemonic: (): string => {
        return bip39.generateMnemonic();
    },

    /**
     * Creates a new wallet and derives the public key.
     * @returns {{ mnemonic: string; pubkey: string }} An object containing the mnemonic and public key.
     */
    createWallet: (): { mnemonic: string; pubkey: string } => {
        const mnemonic = bip39.generateMnemonic();
        const pubkey = derivePubKeyFromMnemonic(mnemonic);
        return { mnemonic, pubkey };
    },

    /**
     * Imports a wallet using a mnemonic phrase.
     * @param {string} mnemonic - The mnemonic phrase to import.
     * @returns {{ isValid: boolean; pubkey?: string }} An object indicating the validity and the public key if valid.
     */
    importWallet: (mnemonic: string): { isValid: boolean; pubkey?: string } => {
        const isValid = bip39.validateMnemonic(mnemonic);
        if (isValid) {
            const pubkey = derivePubKeyFromMnemonic(mnemonic);
            return { isValid, pubkey };
        }
        return { isValid };
    },
};

/**
 * Derives the public key from a given mnemonic.
 * @param {string} mnemonic - The mnemonic phrase.
 * @returns {string} The derived public key in hexadecimal format.
 */
function derivePubKeyFromMnemonic(mnemonic: string): string {
    const seed = bip39.mnemonicToSeedSync(mnemonic);
    const hdKey = HDKey.fromMasterSeed(seed);
    const childKey = hdKey.derive("m/44'/0'/0'/0/0");
    return childKey.publicKey ? Buffer.from(childKey.publicKey).toString('hex') : '';
}