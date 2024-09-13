import { Polkicon } from "@/components/Polkicon";
import { useAccounts } from "@/contexts/Accounts";
import type { ImportedAccount } from "@w3ux/react-connect-kit/types";
import type React from "react";

const AccountsGrid: React.FC = () => {
  const { getAccounts, setActiveAccount } = useAccounts();
  const accounts = getAccounts();

  const handleSelectAccount = (account: ImportedAccount) => {
    setActiveAccount(account);
  };

  return (
    <ul className="mx-auto mt-20 grid max-w-2xl grid-cols-1 gap-6 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-3 lg:gap-8">
      {accounts.map((account) => (
        <li
          key={account.address}
          className="rounded-2xl bg-gray-50 px-8 py-10 text-center text-gray-900 shadow dark:bg-gray-800 dark:text-white"
        >
          <button type="button" onClick={() => handleSelectAccount(account)} className="w-full">
            <span className="mx-auto h-48 w-48 rounded-full md:h-56 md:w-56">
              <Polkicon address={account.address} size={100} copy={false} />
            </span>
            <h3 className="mt-6 truncate font-semibold text-lg leading-7 tracking-tight">
              {account.name}
            </h3>
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
