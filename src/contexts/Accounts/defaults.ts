import type { AccountsContextInterface } from "./types";

export const defaultAccountsContext: AccountsContextInterface = {
  getAccounts: () => [],
  getAccount: (address) => undefined,
  accountHasSigner: (address) => false,
};
