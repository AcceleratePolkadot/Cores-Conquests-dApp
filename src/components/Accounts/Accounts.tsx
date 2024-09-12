import { useAccounts } from "@/contexts/Accounts";
import type { ImportedAccount } from "@w3ux/react-connect-kit/types";
import { Polkicon } from "@w3ux/react-polkicon";
import { Dropdown } from "flowbite-react";
import type React from "react";
import { useEffect } from "react";

const Accounts: React.FC = () => {
  const { getAccounts, activeAccount, setActiveAccount } = useAccounts();
  const accounts = getAccounts();

  useEffect(() => {
    if (activeAccount) {
      console.log(activeAccount);
    }
  }, [activeAccount]);

  const handleAccountChange = (account: ImportedAccount) => {
    setActiveAccount(account);
  };

  return (
    <Dropdown label="Accounts Dropdown" dismissOnClick={true}>
      {accounts.map((account) => (
        <Dropdown.Item key={account.address} onClick={() => handleAccountChange(account)}>
          <div className="flex min-w-0 gap-x-4">
            <span className="flex-none">
              <Polkicon address={account.address} size={50} copy={false} />
            </span>

            <div className="min-w-0 flex-auto">
              <div className="flex items-center space-x-3">
                <h3 className="font-semibold text-gray-900 text-sm leading-6">{account.name}</h3>
              </div>
              <p className="mt-1 truncate text-gray-500 text-xs leading-5">{account.address}</p>
            </div>
          </div>
        </Dropdown.Item>
      ))}
    </Dropdown>
  );
};

export default Accounts;
