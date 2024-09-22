import { useBlocApiClient } from "@/contexts/BlocApiClient";
import type React from "react";
import { type ReactNode, createContext, useContext, useEffect, useRef, useState } from "react";
import type { BlocksContextType } from "./types";

const BlocksContext = createContext<BlocksContextType | undefined>(undefined);

export const useBlocks = () => {
  const context = useContext(BlocksContext);
  if (!context) {
    throw new Error("useBlocks must be used within a BlocksProvider");
  }
  return context;
};

export const BlocksProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { blocApi } = useBlocApiClient();
  const currentBlockRef = useRef<number>(0);
  const lastChangedAt = useRef<number>(Date.now());
  const [producingTimelyBlocks, setProducingTimelyBlocks] = useState<boolean>(true);
  const [currentBlock, setCurrentBlock] = useState<number>(0);
  const timeSinceLastBlock = useRef<number>(0);

  useEffect(() => {
    const blockHeightSubscription = blocApi.query.System.Number.watchValue().subscribe((value) => {
      const currentTimestamp = Date.now();
      if (value !== currentBlockRef.current) {
        setProducingTimelyBlocks(currentTimestamp < lastChangedAt.current + 9000);
        lastChangedAt.current = currentTimestamp;
        currentBlockRef.current = value;
        setCurrentBlock(value);
      }

      timeSinceLastBlock.current = Date.now() - lastChangedAt.current;
    });

    return () => {
      blockHeightSubscription.unsubscribe();
    };
  }, [blocApi.query.System.Number.watchValue]);

  return (
    <BlocksContext.Provider
      value={{
        currentBlock,
        currentBlockRef,
        producingTimelyBlocks,
        timeSinceLastBlock: timeSinceLastBlock.current,
      }}
    >
      {children}
    </BlocksContext.Provider>
  );
};
