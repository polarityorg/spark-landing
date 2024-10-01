import { create } from "zustand";
import { persist } from "zustand/middleware";

interface Transaction {
  id: string;
  type: "received" | "sent";
  amount: number;
  from: string;
  date: Date;
}

interface WalletState {
  mnemonic: string | null;
  balance: number;
  activity: Transaction[];
  phoneNumber: string | null;
  pubkey: string | null;
  setMnemonic: (mnemonic: string) => void;
  clearMnemonic: () => void;
  setBalance: (balance: number) => void;
  setActivity: (activity: Transaction[]) => void;
  setPhoneNumber: (phoneNumber: string) => void;
  setPubkey: (pubkey: string) => void;
}

export const useWalletStore = create<WalletState>()(
  persist(
    (set) => ({
      mnemonic: null,
      balance: 0,
      activity: [],
      phoneNumber: null,
      pubkey: null,
      setMnemonic: (mnemonic: string) => set({ mnemonic }),
      clearMnemonic: () => set({ mnemonic: null, balance: 0, activity: [], phoneNumber: null, pubkey: null }),
      setBalance: (balance: number) => set({ balance }),
      setActivity: (activity: Transaction[]) => set({ activity }),
      setPhoneNumber: (phoneNumber: string) => set({ phoneNumber }),
      setPubkey: (pubkey: string) => set({ pubkey }),
    }),
    {
      name: "wallet-storage", // name of the item in the storage
    }
  )
);