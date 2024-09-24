import { useBlocApiClient } from "@/contexts/BlocApiClient";
import type { BlocConstants } from "@polkadot-api/descriptors";
import type React from "react";
import { type ReactNode, createContext, useContext, useEffect, useState } from "react";
import type { PalletsConstants, PalletsConstantsContextType, PalletsConstantsList } from "./types";

const PalletsConstantsContext = createContext<PalletsConstantsContextType | undefined>(undefined);

export const usePalletsConstants = () => {
  const context = useContext(PalletsConstantsContext);
  if (!context) {
    throw new Error("usePalletsConstants must be used within a PalletsConstantsProvider");
  }
  return context;
};

export const PalletsConstantsProvider: React.FC<{
  children: ReactNode;
  palletConstantsList: PalletsConstantsList;
}> = ({ children, palletConstantsList }) => {
  const { blocApi } = useBlocApiClient();
  const [palletsConstants, setPalletsConstants] = useState<PalletsConstants>({});

  useEffect(() => {
    syncPalletsConstants();
  }, []);

  const syncPalletsConstants = async () => {
    const constantValues: PalletsConstants = {};

    for (const [pallet, constants] of Object.entries(palletConstantsList)) {
      console.log("Pallet:", pallet);
      console.log("Constants:", constants);
      const p = pallet as keyof BlocConstants;
      constantValues[p] = {};
      for (const constant of Object.values(constants)) {
        const c = constant as keyof BlocConstants[typeof p];
        //@ts-expect-error
        const value = await blocApi.constants[p][c]();
        //@ts-expect-error
        constantValues[p][c] = value;
      }
    }
    setPalletsConstants(constantValues);
  };

  const constants = (pallet: keyof BlocConstants) => {
    return palletsConstants[pallet] ?? {};
  };

  return (
    <PalletsConstantsContext.Provider
      value={{
        palletsConstants,
        constants,
      }}
    >
      {children}
    </PalletsConstantsContext.Provider>
  );
};
