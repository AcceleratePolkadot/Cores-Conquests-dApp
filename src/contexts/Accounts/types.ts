import type { ExtensionIcon } from "@w3ux/extension-assets/util";
import type { SS58String } from "polkadot-api";
import type { InjectedPolkadotAccount } from "polkadot-api/pjs-signer";
import type { ExtensionName } from "../InjectedExtensions/types";

export type Account = InjectedPolkadotAccount & {
  extension: {
    name: ExtensionName;
    icon: ExtensionIcon;
  };
};
export type AccountId = SS58String;

export type SystemAccount = {
  nonce: number;
  consumers: number;
  providers: number;
  sufficients: number;
  data: {
    free: bigint;
    reserved: bigint;
    frozen: bigint;
    flags: bigint;
  };
};

export interface AccountsContextInterface {
  activeAccount: Account | undefined;
  setActiveAccount: (account: Account | undefined) => void;
  accounts: Account[];
  getAccount: (address: string) => Account | undefined;
}
