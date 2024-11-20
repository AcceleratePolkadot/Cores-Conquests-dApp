import { useAccounts } from "@reactive-dot/react";
import { Polkicon } from "@w3ux/react-polkicon";
import clsx from "clsx";
import { Dropdown } from "flowbite-react";
import type React from "react";
import { FaUserSlash } from "react-icons/fa6";

const NavbarAccounts: React.FC = () => {
  const accounts = useAccounts();

  return (
    <Dropdown
      arrowIcon={false}
      inline
      label={
        <span className="rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-700">
          <span className="sr-only">No account selected</span>
          <FaUserSlash className="h-5 w-5 text-gray-500 dark:text-gray-400 " />
        </span>
      }
    >
      {accounts.length > 0 ? (
        accounts.map((account, index) => (
          <Dropdown.Item
            key={account.address}
            className={clsx({
              "rounded-b-lg": index === accounts.length - 1,
              "rounded-t-lg": index === 0,
            })}
          >
            <div className="flex min-w-0 gap-x-4">
              <span className="flex-none">
                <Polkicon address={account.address} />
              </span>

              <div className="min-w-0 flex-auto">
                <div className="flex items-center space-x-2">
                  <div className="flex flex-none">{account.name}</div>
                </div>
                <p className="truncate text-gray-400 text-xs">{account.address}</p>
              </div>
            </div>
          </Dropdown.Item>
        ))
      ) : (
        <Dropdown.Item>No accounts found</Dropdown.Item>
      )}
    </Dropdown>
  );
};

export default NavbarAccounts;
