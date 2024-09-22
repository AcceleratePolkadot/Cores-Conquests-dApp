import type React from "react";

export interface BlocksContextType {
  currentBlock: number;
  currentBlockRef: React.MutableRefObject<number>;
  producingTimelyBlocks: boolean;
  timeSinceLastBlock: number;
}
