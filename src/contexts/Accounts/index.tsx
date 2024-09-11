import { useExtensionAccounts } from "@w3ux/react-connect-kit";
import type { ReactNode } from "react";
import { createContext, useContext } from "react";
import { defaultAccountsContext } from "./defaults";
import type { AccountsContextInterface } from "./types";

export const AccountsContext = createContext<AccountsContextInterface>(defaultAccountsContext);

export const useAccounts = () => useContext(AccountsContext);

export const AccountsProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const { getExtensionAccounts } = useExtensionAccounts();

  const getAccounts = () => getExtensionAccounts(42);

  const getAccount = (address: string) => getAccounts().find((a) => a.address === address);

  const accountHasSigner = (address: string) => getAccount(address)?.source !== "external";

  return (
    <AccountsContext.Provider
      value={{
        getAccounts,
        getAccount,
        accountHasSigner,
      }}
    >
      {children}
    </AccountsContext.Provider>
  );
};
