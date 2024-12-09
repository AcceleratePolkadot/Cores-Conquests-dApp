import type React from "react";

import type { WalletAccount } from "@reactive-dot/core/wallets.js";
import { useAccounts } from "@reactive-dot/react";
import { getExtensionIcon } from "@w3ux/extension-assets/util";
import { Polkicon } from "@w3ux/react-polkicon";
import clsx from "clsx";
import { Dropdown } from "flowbite-react";

import { FaUserSlash } from "react-icons/fa6";

import { useActiveAccount } from "@/contexts/ActiveAccount";

import { dropdownTheme } from "./theme";

const AccountsDropdown: React.FC = () => {
  const accounts = useAccounts();
  const { activeAccount, setActiveAccount } = useActiveAccount();

  const handleAccountChange = (account: WalletAccount) => {
    setActiveAccount(account);
  };

  const handleDeselectAccount = () => {
    setActiveAccount(undefined);
  };

  return (
    <Dropdown arrowIcon={false} inline label={<ActiveAccountLabel />} theme={dropdownTheme}>
      {activeAccount && (
        <Dropdown.Header>
          <div className="flex min-w-0 gap-x-5">
            <span className="flex-none content-center">
              <Polkicon address={activeAccount.address} background="none" transform="grow-10" />
            </span>

            <div className="min-w-0 flex-auto">
              <div className="flex items-center space-x-3">
                <h3>{activeAccount.name}</h3>
              </div>
              <p className="mt-1 truncate text-gray-700 text-xs dark:text-slate-300">
                {activeAccount.address}
              </p>
            </div>
          </div>
        </Dropdown.Header>
      )}

      {accounts.length > 0 ? (
        accounts.map((account, index) => (
          <Dropdown.Item
            key={account.address}
            onClick={() => handleAccountChange(account)}
            className={clsx({
              "rounded-b-lg": !activeAccount && index === accounts.length - 1,
              "rounded-t-lg": !activeAccount && index === 0,
            })}
          >
            <div className="flex gap-x-4">
              <span className="flex-none content-center">
                <Polkicon address={account.address} background="none" transform="grow-10" />
              </span>

              <div className="min-w-0 flex-auto">
                <div className="flex items-center space-x-2">
                  <div className="flex flex-none">{account.name}</div>
                  <NavbarAccountIcon account={account} />
                </div>
                <p className="truncate text-gray-400 text-xs">{account.address}</p>
              </div>
            </div>
          </Dropdown.Item>
        ))
      ) : (
        <Dropdown.Item>No accounts found</Dropdown.Item>
      )}
      {activeAccount && (
        <>
          <Dropdown.Divider />
          <Dropdown.Item
            onClick={handleDeselectAccount}
            className="justify-center rounded-b-lg text-xs uppercase"
          >
            Deselect account
          </Dropdown.Item>
        </>
      )}
    </Dropdown>
  );
};

const NavbarAccountIcon: React.FC<{ account: WalletAccount }> = ({ account }) => {
  const Icon = getExtensionIcon(account.wallet.name);
  return Icon ? (
    <div className="flex flex-none">
      <span className="h-3 w-3">
        <Icon />
      </span>
    </div>
  ) : undefined;
};

const ActiveAccountLabel: React.FC = () => {
  const { activeAccount } = useActiveAccount();

  return (
    <div className="items-center rounded-lg p-2 hover:bg-slate-200 dark:hover:bg-gray-700">
      {activeAccount ? (
        <div className="flex space-x-4">
          <div className="flex-none items-center">
            <Polkicon address={activeAccount.address} background="none" transform="grow-3" />
          </div>
          <div className="font-semibold text-base">{activeAccount.name}</div>
        </div>
      ) : (
        <FaUserSlash className="h-5 w-5 text-gray-500 dark:text-gray-400" />
      )}
    </div>
  );
};

export default AccountsDropdown;
