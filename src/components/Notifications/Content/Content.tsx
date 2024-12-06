import type React from "react";

import Additional from "./Additional";
import Block from "./Block";
import ErrorDetails from "./ErrorDetails";
import Events from "./Events";
import Transaction from "./Transaction";
import WalletAccount from "./WalletAccount";

import type { NotificationContentProps } from "./types";

const Content: React.FC<NotificationContentProps> = (props) => {
  const { account, txHash, block, error, dispatchError, events, additional } = props;

  return (
    <>
      <WalletAccount account={account} />
      <Transaction txHash={txHash} />
      <Block block={block} />
      <ErrorDetails error={error} dispatchError={dispatchError} />
      <Events events={events} />
      <Additional additional={additional} />
    </>
  );
};

export default Content;
