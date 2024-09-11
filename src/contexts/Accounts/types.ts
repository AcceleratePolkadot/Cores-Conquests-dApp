import type { ImportedAccount } from "@w3ux/react-connect-kit/types";

export interface AccountsContextInterface {
  getAccounts: () => ImportedAccount[];
  getAccount: (address: string) => ImportedAccount | undefined;
  accountHasSigner: (address: string) => boolean;
}
