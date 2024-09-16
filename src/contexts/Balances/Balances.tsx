import { useAccounts } from "@/contexts/Accounts";
import type { AccountId, SystemAccount } from "@/contexts/Accounts/types";
import { useBlocApiClient } from "@/contexts/BlocApiClient";
import { stringToBigNumber } from "@w3ux/utils";
import type React from "react";
import { type ReactNode, createContext, useContext, useEffect, useRef, useState } from "react";
import type { Subscription } from "rxjs";
import type { Balance, Balances, BalancesContextType } from "./types";

const BalancesContext = createContext<BalancesContextType | undefined>(undefined);

export const useBalances = () => {
  const context = useContext(BalancesContext);
  if (!context) {
    throw new Error("useBalances must be used within a BalancesProvider");
  }
  return context;
};

export const BalancesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { blocApi } = useBlocApiClient();
  const { activeAccount } = useAccounts();
  const [activeAccountBalance, setActiveAccountBalance] = useState<Balance | undefined>(undefined);
  const activeAccountBalanceSubscription = useRef<Subscription | undefined>(undefined);
  const [balancesSubscriptions, setBalancesSubscriptions] = useState<
    Record<AccountId, Subscription>
  >({});
  const [balances, setBalances] = useState<Balances>({});

  useEffect(() => {
    const createActiveAccountBalanceSubscription = async () => {
      if (activeAccount) {
        // If there is an active subscription, unsubscribe from it first
        if (activeAccountBalanceSubscription.current) {
          activeAccountBalanceSubscription.current.unsubscribe();
        }

        // Create a new subscription for the active account.
        activeAccountBalanceSubscription.current = blocApi.query.System.Account.watchValue(
          activeAccount.address,
        ).subscribe((systemAccount: SystemAccount) => {
          setActiveAccountBalance({
            free: stringToBigNumber(systemAccount.data.free.toString()),
            reserved: stringToBigNumber(systemAccount.data.reserved.toString()),
            frozen: stringToBigNumber(systemAccount.data.frozen.toString()),
          });
        });
      }
    };
    createActiveAccountBalanceSubscription();
  }, [activeAccount, blocApi.query.System.Account.watchValue]);

  const watchBalance = async (accountId: AccountId) => {
    if (balancesSubscriptions[accountId]) return; // Subscription already exists

    const subscription = blocApi.query.System.Account.watchValue(accountId).subscribe(
      (systemAccount: SystemAccount) => {
        setBalances((prevBalances) => ({
          ...prevBalances,
          [accountId]: {
            free: stringToBigNumber(systemAccount.data.free.toString()),
            reserved: stringToBigNumber(systemAccount.data.reserved.toString()),
            frozen: stringToBigNumber(systemAccount.data.frozen.toString()),
          },
        }));
      },
    );

    setBalancesSubscriptions((prevSubscriptions) => ({
      ...prevSubscriptions,
      [accountId]: subscription,
    }));
  };

  const unwatchBalance = (accountId: AccountId) => {
    if (balancesSubscriptions[accountId]) {
      balancesSubscriptions[accountId].unsubscribe();
      setBalancesSubscriptions((prevSubscriptions) => ({
        ...prevSubscriptions,
        [accountId]: undefined,
      }));
      setBalances((prevBalances) => ({
        ...prevBalances,
        [accountId]: undefined,
      }));
    }
  };

  const watchBalances = async (accountIds: AccountId[]) => {
    for (const accountId of accountIds) {
      await watchBalance(accountId);
    }
  };

  const unwatchBalances = (accountIds: AccountId[]) => {
    accountIds.forEach(unwatchBalance);
  };

  const unwatchAllBalances = () => {
    Object.keys(balancesSubscriptions).forEach(unwatchBalance);
  };

  const getBalance = async (accountId: AccountId): Promise<Balance> => {
    const systemAccount: SystemAccount = await blocApi.query.System.Account.getValue(accountId);
    const free = systemAccount.data.free.toString();
    const reserved = systemAccount.data.reserved.toString();
    const frozen = systemAccount.data.frozen.toString();

    return {
      free: stringToBigNumber(free),
      reserved: stringToBigNumber(reserved),
      frozen: stringToBigNumber(frozen),
    };
  };

  const getBalances = async (accountIds: AccountId[]): Promise<Balances> => {
    const balances: Balances = {};
    for (const accountId of accountIds) {
      balances[accountId] = await getBalance(accountId);
    }
    return balances;
  };

  return (
    <BalancesContext.Provider
      value={{
        activeAccountBalance,
        balances, // values of the watched balances
        getBalance,
        getBalances,
        watchBalance,
        watchBalances,
        unwatchBalance,
        unwatchBalances,
        unwatchAllBalances,
      }}
    >
      {children}
    </BalancesContext.Provider>
  );
};
