import type React from "react";

import { PiHashFill, PiSignatureFill } from "react-icons/pi";

import { Tooltip } from "flowbite-react";

import Divider from "./Divider";

import type { WalletAccountProps } from "./types";

const WalletAccount: React.FC<WalletAccountProps> = ({ account }) => {
  if (!account) return null;

  return (
    <>
      <div className="space-y-1 dark:bg-inherit">
        <Divider label="Account" />

        <div className="flex items-center gap-2">
          <Tooltip content="Account Name" placement="left">
            <PiSignatureFill />
          </Tooltip>
          <span className="truncate">{account.name}</span>
        </div>

        <div className="flex items-center gap-2">
          <Tooltip content="Account Address" placement="left">
            <PiHashFill />
          </Tooltip>
          <span className="truncate">{account.address}</span>
        </div>
      </div>
    </>
  );
};

export default WalletAccount;
