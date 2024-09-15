import type { ImportedAccount } from "@w3ux/react-connect-kit/types";
import type { SS58String } from "polkadot-api";

export type AccountId = SS58String;

export interface AccountsContextInterface {
  activeAccount: ImportedAccount | undefined;
  setActiveAccount: (account: ImportedAccount | undefined) => void;
  getAccounts: () => ImportedAccount[];
  getAccount: (address: string) => ImportedAccount | undefined;
  accountHasSigner: (address: string) => boolean;
}
