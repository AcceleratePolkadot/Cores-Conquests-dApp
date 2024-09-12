import type { AccountsContextInterface } from "./types";

export const defaultAccountsContext: AccountsContextInterface = {
  activeAccount: undefined,
  setActiveAccount: () => {},
  getAccounts: () => [],
  getAccount: (address) => undefined,
  accountHasSigner: (address) => false,
};
