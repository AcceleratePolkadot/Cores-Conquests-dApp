import {
  useConnectedWallets,
  useWalletConnector,
  useWalletDisconnector,
  useWallets,
} from "@reactive-dot/react";
import { Dropdown, Tooltip } from "flowbite-react";
import type React from "react";
import { FaCircleMinus, FaCirclePlus } from "react-icons/fa6";
import { HiViewGrid } from "react-icons/hi";
import { HiMiniWallet } from "react-icons/hi2";

import { extensions } from "@w3ux/extension-assets";
import { ExtensionIcons } from "@w3ux/extension-assets/util";
import clsx from "clsx";

import type { NavbarWalletsItemProps } from "./types";

const NavbarWallets: React.FC = () => {
  const wallets = useWallets();

  return (
    <Dropdown
      arrowIcon={false}
      dismissOnClick={false}
      inline
      label={
        <span className="rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-700">
          <span className="sr-only">Wallets</span>
          <HiViewGrid className="text-2xl text-gray-500 dark:text-gray-400" />
        </span>
      }
    >
      <Dropdown.Header className="text-center">
        <span className="inline-flex items-baseline">
          <HiMiniWallet className="mx-2 h-5 w-5 self-center rounded-full" />
          <span className="font-semibold text-lg">Wallets</span>
        </span>
      </Dropdown.Header>

      {wallets.map((wallet, index, allWallets) => (
        <NavbarWalletsItem key={wallet.id} wallet={wallet} index={index} allWallets={allWallets} />
      ))}
    </Dropdown>
  );
};

export const WalletStatusIcon = ({ connected }: { connected: boolean }) => {
  return connected ? (
    <Tooltip content="Connected" placement="right" animation="duration-500">
      <span className="text-green-500">
        <FaCirclePlus />
      </span>
    </Tooltip>
  ) : (
    <Tooltip content="Disconnected" placement="right" animation="duration-500">
      <span className="text-red-700">
        <FaCircleMinus />
      </span>
    </Tooltip>
  );
};

export const NavbarWalletsItem = ({ wallet, index, allWallets }: NavbarWalletsItemProps) => {
  const connectedWallets = useConnectedWallets();

  const [_, connectWallet] = useWalletConnector();
  const [__, disconnectWallet] = useWalletDisconnector();

  const walletMeta = extensions[wallet.name as keyof typeof extensions];
  const Icon = ExtensionIcons[wallet.name];
  const title = walletMeta.title;
  const website =
    typeof walletMeta.website === "string" ? walletMeta.website : walletMeta.website.text;
  const url = typeof walletMeta.website === "string" ? walletMeta.website : walletMeta.website.url;

  return (
    <Dropdown.Item
      key={wallet.id}
      onClick={() => {
        if (connectedWallets.includes(wallet)) {
          disconnectWallet(wallet);
        } else {
          connectWallet(wallet);
        }
      }}
      className={clsx({
        "rounded-b-lg": index === allWallets.length - 1,
      })}
    >
      <div className="flex w-full items-center space-x-4">
        <div className="h-12 w-12 flex-none">{Icon && <Icon />}</div>

        <div className="flex-auto content-left">
          <div className="flex items-center space-x-3">
            <p className="font-semibold text-sm leading-6">{title}</p>
            <WalletStatusIcon connected={connectedWallets.includes(wallet)} />
          </div>

          <p className="mt-1 text-left text-xs">
            <a href={`https://${url}`} target="_blank" rel="noreferrer">
              {website}
            </a>
          </p>
        </div>
      </div>
    </Dropdown.Item>
  );
};

export default NavbarWallets;
