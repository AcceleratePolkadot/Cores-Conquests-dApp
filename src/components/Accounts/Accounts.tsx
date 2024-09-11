import { useAccounts } from "@/contexts/Accounts";
import type React from "react";

const Accounts: React.FC = () => {
  const { getAccounts } = useAccounts();
  const accounts = getAccounts();

  return <div>{accounts.length}</div>;
};

export default Accounts;
