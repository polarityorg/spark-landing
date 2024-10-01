import * as bip39 from 'bip39';
import { HDKey } from '@scure/bip32';

export const walletSDK = {

    generateMnemonic: (): string => {
        return bip39.generateMnemonic();
    },

  createWallet: (): { mnemonic: string; pubkey: string } => {
    const mnemonic = bip39.generateMnemonic();
    const seed = bip39.mnemonicToSeedSync(mnemonic);
    const hdKey = HDKey.fromMasterSeed(seed);
    const childKey = hdKey.derive("m/44'/0'/0'/0/0");
    const pubkey = childKey.publicKey ? Buffer.from(childKey.publicKey).toString('hex') : '';
    return { mnemonic, pubkey };
  },
  
  importWallet: (mnemonic: string): { isValid: boolean; pubkey?: string } => {
    const isValid = bip39.validateMnemonic(mnemonic);
    if (isValid) {
      const seed = bip39.mnemonicToSeedSync(mnemonic);
      const hdKey = HDKey.fromMasterSeed(seed);
      const childKey = hdKey.derive("m/44'/0'/0'/0/0");
      const pubkey = childKey.publicKey ? Buffer.from(childKey.publicKey).toString('hex') : '';
      return { isValid, pubkey };
    }
    return { isValid };
  },

  // Add other methods as needed
};