import type { WalletAccount } from "@reactive-dot/core/wallets.js";
import type { TxFinalized } from "polkadot-api";

import type { BlockInfo, SystemEvent } from "@polkadot-api/observable-client";

export type InfoWithIcon = {
  icon: JSX.Element;
  value: string;
  tooltip?: string;
};

export type InfoWithLabel = {
  label: string;
  value: string;
  tooltip?: string;
};

export type InfoValueOnly = {
  value: string;
  tooltip?: string;
};

export type NotificationAdditionalInformationRow = InfoWithIcon | InfoWithLabel | InfoValueOnly;

export type NotificationAdditionalInformationGroup = {
  label: string;
  rows: NotificationAdditionalInformationRow[];
};

type NotificationCustomProps = {
  txHash?: string;
  isValid?: boolean;
  found?: boolean;
  ok?: boolean;
  events?: SystemEvent["event"][];
  block?: BlockInfo;
  icon?: JSX.Element;
  account?: WalletAccount;
  additional?: NotificationAdditionalInformationGroup[];
  error?: {
    message?: string;
    stack?: string;
  };
  dispatchError?: TxFinalized["dispatchError"];
};

export type NotificationContentProps = NotificationCustomProps;
