import { create } from "zustand";
import { persist } from "zustand/middleware";
import { walletSDK } from "./sdk";
export interface Transaction {
  id: string;
  type: "received" | "sent" | "withdraw" | "deposit";
  amount: number;
  from?: string;
  to?: string;
  date: Date;
}

interface WalletState {
  mnemonic: string | null;
  balance: number;
  btcPrice: number;
  activity: Transaction[];
  phoneNumber: string | null;
  pubkey: string | null;
  setMnemonic: (mnemonic: string) => void;
  clearMnemonic: () => void;
  setBalance: (balance: number) => void;
  setBtcPrice: (btcPrice: number) => void;
  setActivity: (activity: Transaction[]) => void;
  setPhoneNumber: (phoneNumber: string) => void;
  setPubkey: (pubkey: string) => void;
  createSparkClient: (mnemonic: string) => Promise<void>;
  importWallet: (mnemonic: string, phoneNumber: string) => Promise<{ isValid: boolean; pubkey: string | null }>;
  fetchBalance: () => Promise<number>;
  transfer: (amount: number, to: string) => Promise<void>;
  createLightningInvoice: (amount: number, threshold: number, participants: number) => Promise<string | null>;
  payLightningInvoice: (invoice: string) => Promise<void>;
}

export const useWalletStore = create<WalletState>()(
  persist(
    (set, get) => ({
      mnemonic: null,
      balance: 0,
      btcPrice: 0,
      activity: [],
      phoneNumber: null,
      pubkey: null,
      setMnemonic: (mnemonic: string) => set({ mnemonic }),
      clearMnemonic: () => set({ mnemonic: null, balance: 0, activity: [], phoneNumber: null, pubkey: null }),
      setBalance: (balance: number) => set({ balance }),
      setBtcPrice: (btcPrice: number) => set({ btcPrice }),
      setActivity: (activity: Transaction[]) => set({ activity }),
      setPhoneNumber: (phoneNumber: string) => set({ phoneNumber }),
      setPubkey: (pubkey: string) => set({ pubkey }),
      createSparkClient: async (mnemonic: string) => {
        await walletSDK.createSparkClient(mnemonic);
      },
      importWallet: async (mnemonic: string, phoneNumber: string) => {
        const { isValid, pubkey } = await walletSDK.importWallet(mnemonic, phoneNumber);
        if (isValid) {
          set({ mnemonic, pubkey: pubkey || null });
        }
        return { isValid, pubkey: pubkey || null };
      },
      fetchBalance: async () => {
        if (get().mnemonic) {
          try {

            const balance = await walletSDK.getBalance();
            set({ balance: Number(balance) });
            return Number(balance);
          } catch (error) {
            console.error("Failed to fetch balance:", error);
          }
        }
        return 0;
      },
      transfer: async (amount: number, to: string) => {
        if (get().mnemonic) {
          try {
            await walletSDK.getBalance();
            await walletSDK.transfer(BigInt(amount), to);
            await get().fetchBalance();
          } catch (error) {
            console.error("Failed to transfer:", error);
          }
        }
      },
      createLightningInvoice: async (amount: number, threshold: number, participants: number) => {
        if (get().mnemonic) {
          try {
            return await walletSDK.createLightningInvoice(BigInt(amount), threshold, participants);
          } catch (error) {
            console.error("Failed to create Lightning invoice:", error);
          }
        }
        return null;
      },
      payLightningInvoice: async (invoice: string) => {
        if (get().mnemonic) {
          try {
            await walletSDK.getBalance();
            await walletSDK.payLightningInvoice(invoice);
          } catch (error) {
            console.error("Failed to pay Lightning invoice:", error);
          }
        }
      },
    }),
    {
      name: "wallet-storage", // name of the item in the storage
    }
  )
);
