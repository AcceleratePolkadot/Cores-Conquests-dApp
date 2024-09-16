import type { AccountId } from "@/contexts/Accounts/types";
import type { BigNumber } from "bignumber.js";
import type { Subscription } from "rxjs";

export type BalanceSubscriptions = Record<AccountId, Subscription>;

export interface Balance {
  free: BigNumber;
  reserved: BigNumber;
  frozen: BigNumber;
}

export type Balances = Record<AccountId, Balance>;

export interface BalancesContextType {
  activeAccountBalance: Balance | undefined;
  balances: Balances;
  getBalance: (address: AccountId) => Promise<Balance>;
  getBalances: (addresses: AccountId[]) => Promise<Balances>;
  watchBalance: (address: AccountId) => Promise<void>;
  watchBalances: (addresses: AccountId[]) => Promise<void>;
  unwatchBalance: (address: AccountId) => void;
  unwatchBalances: (addresses: AccountId[]) => void;
  unwatchAllBalances: () => void;
}
