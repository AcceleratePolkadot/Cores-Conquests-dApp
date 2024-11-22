import type { WalletAccount } from "@reactive-dot/core/wallets.js";
import { useAccounts } from "@reactive-dot/react";
import type { ReactNode } from "react";
import { createContext, useContext, useEffect, useState } from "react";
import { defaultActiveAccountContext } from "./defaults";

import type { ActiveAccountContextInterface } from "./types";

export const ActiveAccountContext = createContext<ActiveAccountContextInterface>(
  defaultActiveAccountContext,
);

export const useActiveAccount = () => useContext(ActiveAccountContext);

export const ActiveAccountProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const accounts = useAccounts();
  const [activeAccount, setActiveAccount] = useState<WalletAccount | undefined>(undefined);

  useEffect(() => {
    // When accounts updates ensure the active account is still in the list
    if (activeAccount && !accounts.some((a) => a.address === activeAccount.address)) {
      setActiveAccount(undefined);
    }
  }, [activeAccount, accounts]);

  return (
    <ActiveAccountContext.Provider
      value={{
        activeAccount,
        setActiveAccount,
      }}
    >
      {children}
    </ActiveAccountContext.Provider>
  );
};
