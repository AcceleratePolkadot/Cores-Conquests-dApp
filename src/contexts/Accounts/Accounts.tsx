import { useInjectedExtensions } from "@/contexts/InjectedExtensions";
import { ExtensionIcons } from "@w3ux/extension-assets/util";
import type { ReactNode } from "react";
import { createContext, useContext, useEffect, useState } from "react";
import { defaultAccountsContext } from "./defaults";
import type { Account, AccountsContextInterface } from "./types";

export const AccountsContext = createContext<AccountsContextInterface>(defaultAccountsContext);

export const useAccounts = () => useContext(AccountsContext);

export const AccountsProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const { connectedExtensions } = useInjectedExtensions();
  const [activeAccount, setActiveAccount] = useState<Account | undefined>(undefined);
  const [accounts, setAccounts] = useState<Account[]>([]);

  const getAccount = (address: string) => accounts.find((a) => a.address === address);

  useEffect(() => {
    let connectedExtensionsAccounts: Account[] = [];
    for (const extension of Object.values(connectedExtensions)) {
      connectedExtensionsAccounts = connectedExtensionsAccounts.concat(
        extension.getAccounts().map((a) => ({
          ...a,
          extension: { name: extension.name, icon: ExtensionIcons[extension.name] },
        })),
      );
    }
    setAccounts(connectedExtensionsAccounts);
  }, [connectedExtensions]);

  useEffect(() => {
    // When accounts updates ensure the active account is still in the list
    if (activeAccount && !accounts.some((a) => a.address === activeAccount.address)) {
      setActiveAccount(undefined);
    }
  }, [activeAccount, accounts]);

  return (
    <AccountsContext.Provider
      value={{
        activeAccount,
        setActiveAccount,
        accounts,
        getAccount,
      }}
    >
      {children}
    </AccountsContext.Provider>
  );
};
