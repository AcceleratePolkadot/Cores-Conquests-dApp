import type React from "react";
import { PiHashFill } from "react-icons/pi";
import Divider from "./Divider";
import Row from "./Row";

interface TransactionProps {
  txHash?: string;
}

const Transaction: React.FC<TransactionProps> = ({ txHash }) => {
  if (!txHash) return null;

  return (
    <>
      <div className="space-y-1 dark:bg-inherit">
        <Divider label="Transaction" />
        <Row value={txHash} icon={<PiHashFill />} tooltip="Transaction hash" />
      </div>
    </>
  );
};

export default Transaction;
