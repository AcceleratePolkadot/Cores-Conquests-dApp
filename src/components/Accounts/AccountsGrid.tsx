import { Polkicon } from "@/components/identicons";
import { useAccounts } from "@/contexts/Accounts";
import type { Account } from "@/contexts/Accounts/types";
import type React from "react";

const AccountsGrid: React.FC = () => {
  const { accounts, setActiveAccount } = useAccounts();

  const handleSelectAccount = (account: Account) => {
    setActiveAccount(account);
  };

  return (
    <ul className="mx-auto mt-20 grid max-w-2xl grid-cols-1 gap-6 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-3 lg:gap-8">
      {accounts.map((account) => (
        <li
          key={account.address}
          className="rounded-2xl bg-gray-50 px-8 py-10 text-center text-gray-900 shadow dark:bg-gray-800 dark:text-white"
        >
          <button
            type="button"
            onClick={() => handleSelectAccount(account)}
            className="w-full space-y-2"
          >
            <span className="mx-auto h-48 w-48 rounded-full md:h-56 md:w-56">
              <Polkicon address={account.address} size={100} copy={false} />
            </span>
            <div className="flex items-center justify-center space-x-2">
              <div className="flex flex-none">{account.name}</div>
              <div className="flex flex-none">
                <span className="h-5 w-5">
                  <account.extension.icon />
                </span>
              </div>
            </div>

            <p className="truncate text-gray-400 text-xs leading-6 dark:text-gray-600">
              {account.address}
            </p>
          </button>
        </li>
      ))}
    </ul>
  );
};

export default AccountsGrid;
