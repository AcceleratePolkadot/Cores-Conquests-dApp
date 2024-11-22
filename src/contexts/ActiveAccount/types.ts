import type { WalletAccount } from "@reactive-dot/core/wallets.js";

export interface ActiveAccountContextInterface {
  activeAccount: WalletAccount | undefined;
  setActiveAccount: (account: WalletAccount | undefined) => void;
}
