import type { ImportedAccount } from "@w3ux/react-connect-kit/types";

export interface AccountsContextInterface {
  activeAccount: ImportedAccount | undefined;
  setActiveAccount: (account: ImportedAccount | undefined) => void;
  getAccounts: () => ImportedAccount[];
  getAccount: (address: string) => ImportedAccount | undefined;
  accountHasSigner: (address: string) => boolean;
}
