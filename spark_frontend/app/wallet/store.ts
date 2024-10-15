import { create } from "zustand";
import { persist } from "zustand/middleware";
import { walletSDK } from "./sdk"; // Import the walletSDK

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
  fetchBalance: () => Promise<void>;
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
      fetchBalance: async () => {
        if (get().mnemonic) {
          try {
            const balance = await walletSDK.getBalance();
            set({ balance: Number(balance) });
          } catch (error) {
            console.error("Failed to fetch balance:", error);
          }
        }
      },
    }),
    {
      name: "wallet-storage", // name of the item in the storage
    }
  )
);
