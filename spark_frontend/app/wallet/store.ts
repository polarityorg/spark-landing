import { create } from "zustand";
import { persist } from "zustand/middleware";
import { walletSDK } from "./sdk";

export interface Transaction {
  id: string;
  type: "received" | "sent" | "withdraw" | "deposit";
  amount: number;
  currency: string; // Added currency field
  date: Date;
}

interface WalletState {
  mnemonic: string | null;
  btcBalance: number;
  stablecoinBalance: number;
  btcPrice: number;
  activity: Transaction[];
  phoneNumber: string | null;
  pubkey: string | null;
  previousBtcBalance: number | null; // Added previousBtcBalance
  previousStablecoinBalance: number | null; // Added previousStablecoinBalance
  setMnemonic: (mnemonic: string) => void;
  clearMnemonic: () => void;
  setBtcBalance: (btcBalance: number) => void;
  setStablecoinBalance: (stablecoinBalance: number) => void;
  setBtcPrice: (btcPrice: number) => void;
  setActivity: (activity: Transaction[]) => void;
  setPhoneNumber: (phoneNumber: string) => void;
  setPubkey: (pubkey: string) => void;
  createSparkClient: (mnemonic: string) => Promise<void>;
  importWallet: (mnemonic: string, phoneNumber: string) => Promise<{ isValid: boolean; pubkey: string | null }>;
  fetchBalance: () => Promise<[number, number]>;
  transferBtc: (amount: number, to: string) => Promise<void>;
  transferStablecoins: (amount: number, to: string, luma: string, chroma: string) => Promise<void>;
  createLightningInvoice: (amount: number, threshold: number, participants: number) => Promise<string | null>;
  payLightningInvoice: (invoice: string) => Promise<void>;
}

export const useWalletStore = create<WalletState>()(
  persist(
    (set, get) => {
      // Initialize a shared promise that resolves immediately
      let walletOperationPromise = Promise.resolve();

      // Function to enqueue operations
      function enqueueOperation<T>(operation: () => Promise<T>): Promise<T> {
        const result = walletOperationPromise.then(operation);
        walletOperationPromise = result.then(() => {}).catch(() => {});
        return result;
      }

      return {
        // Existing state properties
        mnemonic: null,
        btcBalance: 0,
        stablecoinBalance: 0,
        btcPrice: 0,
        activity: [],
        phoneNumber: null,
        pubkey: null,
        previousBtcBalance: null, // Initialize previousBtcBalance
        previousStablecoinBalance: null, // Initialize previousStablecoinBalance

        // Existing setters
        setMnemonic: (mnemonic: string) => set({ mnemonic }),
        clearMnemonic: () => set({ mnemonic: null, btcBalance: 0, stablecoinBalance: 0, activity: [], phoneNumber: null, pubkey: null }),
        setBtcBalance: (btcBalance: number) => set({ btcBalance }),
        setStablecoinBalance: (stablecoinBalance: number) => set({ stablecoinBalance }),
        setBtcPrice: (btcPrice: number) => set({ btcPrice }),
        setActivity: (activity: Transaction[]) => set({ activity }),
        setPhoneNumber: (phoneNumber: string) => set({ phoneNumber }),
        setPubkey: (pubkey: string) => set({ pubkey }),

        // Updated methods with enqueueOperation
        createSparkClient: async (mnemonic: string) => {
          await enqueueOperation(async () => {
            await walletSDK.createSparkClient(mnemonic);
          });
        },

        importWallet: async (mnemonic: string, phoneNumber: string) => {
          return await enqueueOperation(async () => {
            const { isValid, pubkey } = await walletSDK.importWallet(mnemonic, phoneNumber);
            if (isValid) {
              set({ mnemonic, pubkey: pubkey || null });
            }
            return { isValid, pubkey: pubkey || null };
          });
        },

        fetchBalance: async () => {
          if (get().mnemonic) {
            try {
              return await enqueueOperation(async () => {
                const btcBalance = await walletSDK.getBtcBalance();
                const stablecoinBalance = await walletSDK.getStablecoinBalance();

                const state = get();

                // Detect BTC balance increase
                if (state.previousBtcBalance === null) {
                  set({ previousBtcBalance: Number(btcBalance) });
                } else if (Number(btcBalance) > state.previousBtcBalance) {
                  const amountReceived = Number(btcBalance) - state.previousBtcBalance;

                  const newTransaction: Transaction = {
                    id: Date.now().toString(),
                    type: "received",
                    amount: amountReceived,
                    currency: "BTC",
                    date: new Date(),
                  };

                  set({
                    activity: [newTransaction, ...state.activity],
                    previousBtcBalance: Number(btcBalance),
                  });
                } else {
                  set({ previousBtcBalance: Number(btcBalance) });
                }

                // Detect stablecoin balance increase
                if (state.previousStablecoinBalance === null) {
                  set({ previousStablecoinBalance: Number(stablecoinBalance) });
                } else if (Number(stablecoinBalance) > state.previousStablecoinBalance) {
                  const amountReceived = Number(stablecoinBalance) - state.previousStablecoinBalance;

                  const newTransaction: Transaction = {
                    id: Date.now().toString(),
                    type: "received",
                    amount: amountReceived,
                    currency: "USDT", // Assuming USDT as the stablecoin
                    date: new Date(),
                  };

                  set({
                    activity: [newTransaction, ...state.activity],
                    previousStablecoinBalance: Number(stablecoinBalance),
                  });
                } else {
                  set({ previousStablecoinBalance: Number(stablecoinBalance) });
                }

                // Update balances
                set({
                  btcBalance: Number(btcBalance),
                  stablecoinBalance: Number(stablecoinBalance),
                });

                return [Number(btcBalance), Number(stablecoinBalance)];
              });
            } catch (error) {
              console.error("Failed to fetch balance:", error);
              return [0, 0];
            }
          }
          return [0, 0];
        },

        transferBtc: async (amount: number, to: string) => {
          if (get().mnemonic) {
            try {
              await enqueueOperation(async () => {
                await walletSDK.transfer(BigInt(amount), to);

                const state = get();

                const newTransaction: Transaction = {
                  id: Date.now().toString(),
                  type: "sent",
                  amount: amount,
                  currency: "BTC",
                  date: new Date(),
                };

                set({
                  activity: [newTransaction, ...state.activity],
                  btcBalance: state.btcBalance - amount,
                });
              });
            } catch (error) {
              console.error("Failed to transfer BTC:", error);
            }
          }
        },
        transferStablecoins: async (amount: number, to: string, luma: string, chroma: string) => {
          if (get().mnemonic) {
            try {
              await enqueueOperation(async () => {
                await walletSDK.transfer(BigInt(amount), to, luma, chroma);

                const state = get();

                const newTransaction: Transaction = {
                  id: Date.now().toString(),
                  type: "sent",
                  amount: amount,
                  currency: "Stablecoin",
                  date: new Date(),
                };

                set({
                  activity: [newTransaction, ...state.activity],
                  stablecoinBalance: state.stablecoinBalance - amount,
                });
              });
            } catch (error) {
              console.error("Failed to transfer stablecoins:", error);
            }
          }
        },
        createLightningInvoice: async (amount: number, threshold: number, participants: number) => {
          if (get().mnemonic) {
            try {
              return await enqueueOperation(async () => {
                return await walletSDK.createLightningInvoice(BigInt(amount), threshold, participants);
              });
            } catch (error) {
              console.error("Failed to create Lightning invoice:", error);
            }
          }
          return null;
        },

        payLightningInvoice: async (invoice: string) => {
          if (get().mnemonic) {
            try {
              await enqueueOperation(async () => {
                const amount = await walletSDK.payLightningInvoice(invoice);

                const state = get();

                const newTransaction: Transaction = {
                  id: Date.now().toString(),
                  type: "sent",
                  amount: Number(amount),
                  currency: "BTC",
                  date: new Date(),
                };

                set({
                  activity: [newTransaction, ...state.activity],
                  btcBalance: state.btcBalance - Number(amount),
                });
              });
            } catch (error) {
              console.error("Failed to pay Lightning invoice:", error);
            }
          }
        },
      };
    },
    {
      name: "wallet-storage", // Name of the item in storage
    }
  )
);
