import type { WalletAccount } from "@reactive-dot/core/wallets.js";

export type Address = WalletAccount["address"];

export interface ActiveAccountContextInterface {
  activeAccount: WalletAccount | undefined;
  setActiveAccount: (account: WalletAccount | undefined) => void;
}
