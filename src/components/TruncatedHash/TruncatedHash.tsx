import type React from "react";
import { useEffect, useState } from "react";

import { ellipsisFn, removeHexPrefix } from "@w3ux/utils";
import clsx from "clsx";

interface TruncatedHashProps {
  hash: string;
  chars?: number;
  copy?: boolean;
  className?: string;
}

const TruncatedHash: React.FC<TruncatedHashProps> = ({
  hash,
  chars = 6,
  copy = true,
  className,
}) => {
  const [copySuccess, setCopySuccess] = useState(false);

  const truncatedHash = ellipsisFn(removeHexPrefix(hash), chars, "center");

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
    setCopySuccess(true);
  };

  if (copy) {
    return (
      <button
        type="button"
        onClick={handleCopy}
        className={clsx(copySuccess ? "cursor-none" : "cursor-copy")}
      >
        <span className={className}>{truncatedHash}</span>
      </button>
    );
  }

  return <span className={className}>{truncatedHash}</span>;
};

export default TruncatedHash;
