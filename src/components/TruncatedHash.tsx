import { useNotifications } from "@/contexts/Notifications";
import clsx from "clsx";
import type React from "react";
import { useEffect, useState } from "react";

interface TruncatedHashProps {
  hash: string;
  leadingChars?: number;
  endingChars?: number;
  copy?: boolean;
}

const TruncatedHash: React.FC<TruncatedHashProps> = ({
  hash,
  leadingChars = 6,
  endingChars = 4,
  copy = true,
}) => {
  const [copySuccess, setCopySuccess] = useState(false);
  const { showNotification } = useNotifications();

  const truncatedHash = `${hash.slice(0, leadingChars)}...${hash.slice(-endingChars)}`;

  useEffect(() => {
    if (copySuccess) {
      const timer = setTimeout(() => {
        setCopySuccess(false);
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [copySuccess]);

  const handleCopy = () => {
    navigator.clipboard.writeText(hash);
    showNotification({
      message: "Copied to clipboard",
      options: {
        variant: "success",
      },
    });
    setCopySuccess(true);
  };

  if (copy) {
    return (
      <button
        type="button"
        onClick={handleCopy}
        className={clsx(copySuccess ? "cursor-none" : "cursor-copy")}
      >
        {truncatedHash}
      </button>
    );
  }

  return <>{truncatedHash}</>;
};

export default TruncatedHash;
