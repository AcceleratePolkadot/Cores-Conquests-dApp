import type { Wallet } from "@reactive-dot/core/wallets.js";

export interface NavbarWalletsItemProps {
  wallet: Wallet;
  index: number;
  allWallets: Wallet[];
}
