import { bloc } from "@polkadot-api/descriptors";
import { createClient } from "polkadot-api";
import { getWsProvider } from "polkadot-api/ws-provider/web";
import type { ReactNode } from "react";
import { createContext, useContext } from "react";
import type { BlocApiClientContextInterface } from "./types";

const blocClient = createClient(getWsProvider(import.meta.env.VITE_CHAIN_WS));
const blocApi = blocClient.getTypedApi(bloc);

export const BlocApiClientContext = createContext<BlocApiClientContextInterface>({
  blocClient,
  blocApi,
});

export const useBlocApiClient = () => useContext(BlocApiClientContext);

export const BlocApiClientProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  return (
    <BlocApiClientContext.Provider
      value={{
        blocClient,
        blocApi,
      }}
    >
      {children}
    </BlocApiClientContext.Provider>
  );
};
