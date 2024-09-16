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
  const activeAccountAddress = useRef<AccountId | undefined>(activeAccount?.address);
  const [activeAccountBalance, setActiveAccountBalance] = useState<Balance | undefined>(undefined);
  const [balancesSubscriptions, setBalancesSubscriptions] = useState<
    Record<AccountId, Subscription>
  >({});
  const [balances, setBalances] = useState<Balances>({});

  useEffect(() => {
    if (activeAccount) {
      watchBalance(activeAccount.address);
      activeAccountAddress.current = activeAccount.address;
    } else if (activeAccountAddress.current) {
      const accountId = activeAccountAddress.current;
      activeAccountAddress.current = undefined;
      unwatchBalance(accountId);
    }
  }, [activeAccount]);

  useEffect(() => {
    if (activeAccount && balances[activeAccount.address]) {
      setActiveAccountBalance(balances[activeAccount.address]);
    }
  }, [activeAccount, balances]);

  const watchBalance = (accountId: AccountId) => {
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
    // Don't unwatch the current active account
    if (activeAccountAddress.current === accountId) {
      return;
    }

    if (balancesSubscriptions[accountId]) {
      balancesSubscriptions[accountId].unsubscribe();
      setBalancesSubscriptions((prevSubscriptions) => {
        const newSubscriptions = { ...prevSubscriptions };
        delete newSubscriptions[accountId];
        return newSubscriptions;
      });
      setBalances((prevBalances) => {
        const newBalances = { ...prevBalances };
        delete newBalances[accountId];
        return newBalances;
      });
    }
  };

  const watchBalances = (accountIds: AccountId[]) => {
    accountIds.forEach(watchBalance);
  };

  const unwatchBalances = (accountIds: AccountId[]) => {
    accountIds.forEach(unwatchBalance);
  };

  const unwatchAllBalances = () => {
    Object.keys(balancesSubscriptions).forEach(unwatchBalance);
  };

  return (
    <BalancesContext.Provider
      value={{
        activeAccountBalance,
        balances, // values of the watched balances
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
