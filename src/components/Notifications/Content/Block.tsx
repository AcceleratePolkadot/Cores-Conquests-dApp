import type React from "react";
import { AiOutlineFieldNumber } from "react-icons/ai";
import { PiHashFill } from "react-icons/pi";
import Divider from "./Divider";
import Row from "./Row";

import type { BlockInfo } from "@polkadot-api/observable-client";

interface BlockProps {
  block?: BlockInfo;
}

const Block: React.FC<BlockProps> = ({ block }) => {
  if (!block) return null;

  return (
    <>
      <div className="space-y-1 dark:bg-inherit">
        <Divider label="Block" />
        <Row value={block.hash.toString()} icon={<PiHashFill />} tooltip="Block hash" />
        <Row
          value={block.number.toLocaleString()}
          icon={<AiOutlineFieldNumber />}
          tooltip="Block number"
        />
      </div>
    </>
  );
};

export default Block;
