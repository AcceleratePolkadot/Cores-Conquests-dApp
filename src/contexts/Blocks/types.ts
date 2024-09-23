import type React from "react";

export type BlockNumber = number;

export interface BlocksContextType {
  currentBlock: BlockNumber;
  currentBlockRef: React.MutableRefObject<BlockNumber>;
  producingTimelyBlocks: boolean;
  timeSinceLastBlock: number;
}
