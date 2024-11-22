import { useActiveAccount } from "@/contexts/ActiveAccount";
import type { WalletAccount } from "@reactive-dot/core/wallets.js";
import { useAccounts } from "@reactive-dot/react";
import { getExtensionIcon } from "@w3ux/extension-assets/util";
import { Polkicon } from "@w3ux/react-polkicon";
import clsx from "clsx";
import { Dropdown } from "flowbite-react";
import type React from "react";
import { FaUserSlash } from "react-icons/fa6";

const NavbarAccounts: React.FC = () => {
  const accounts = useAccounts();
  const { activeAccount, setActiveAccount } = useActiveAccount();

  const handleAccountChange = (account: WalletAccount) => {
    setActiveAccount(account);
  };

  const handleDeselectAccount = () => {
    setActiveAccount(undefined);
  };

  return (
    <Dropdown
      arrowIcon={false}
      inline
      label={
        activeAccount ? (
          <span className="rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-700">
            <span className="sr-only">{activeAccount.name}</span>
            <Polkicon address={activeAccount.address} />
          </span>
        ) : (
          <span className="rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-700">
            <span className="sr-only">No account selected</span>
            <FaUserSlash className="h-5 w-5 text-gray-500 dark:text-gray-400 " />
          </span>
        )
      }
    >
      {activeAccount && (
        <Dropdown.Header>
          <div className="flex min-w-0 gap-x-4">
            <span className="flex-none">
              <Polkicon address={activeAccount.address} />
            </span>

            <div className="min-w-0 flex-auto">
              <div className="flex items-center space-x-3">
                <h3 className="font-semibold text-sm">{activeAccount.name}</h3>
              </div>
              <p className="mt-1 truncate text-gray-400 text-xs">{activeAccount.address}</p>
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
            <div className="flex min-w-0 gap-x-4">
              <span className="flex-none">
                <Polkicon address={account.address} />
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
          <Dropdown.Item onClick={handleDeselectAccount} className="justify-center rounded-b-lg">
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

export default NavbarAccounts;
