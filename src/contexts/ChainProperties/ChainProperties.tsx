import { useBlocApiClient } from "@/contexts/BlocApiClient";
import type React from "react";
import { type ReactNode, createContext, useContext, useEffect, useState } from "react";
import type { ChainProperties, ChainPropertiesContextType } from "./types";

const ChainPropertiesContext = createContext<ChainPropertiesContextType | undefined>(undefined);

export const useChainProperties = () => {
  const context = useContext(ChainPropertiesContext);
  if (!context) {
    throw new Error("useChainProperties must be used within a ChainPropertiesProvider");
  }
  return context;
};

export const ChainPropertiesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { blocClient } = useBlocApiClient();
  const [chainProperties, setChainProperties] = useState<ChainProperties | undefined>(undefined);

  useEffect(() => {
    syncChainProperties();
  }, []);

  const syncChainProperties = async (fn?: (properties: ChainProperties) => void) => {
    const callback = fn || setChainProperties;
    if (chainProperties) {
      callback(chainProperties);
      return;
    }
    const properties = await blocClient._request<ChainProperties>("system_properties", []);
    callback(properties);
  };

  return (
    <ChainPropertiesContext.Provider
      value={{
        chainProperties,
        syncChainProperties,
      }}
    >
      {children}
    </ChainPropertiesContext.Provider>
  );
};
