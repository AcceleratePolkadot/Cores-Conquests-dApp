import { AccountsProvider } from "@/contexts/Accounts";
import { BlocApiClientProvider } from "@/contexts/BlocApiClient";
import { RostersProvider } from "@/contexts/Rosters";
import { ExtensionAccountsProvider, ExtensionsProvider } from "@w3ux/react-connect-kit";
import type React from "react";
interface ProvidersProps {
  children: React.ReactNode;
}

const Providers: React.FC<ProvidersProps> = ({ children }) => {
  return (
    <ExtensionsProvider>
      <ExtensionAccountsProvider network="bloc" dappName="Cores and Conquests">
        <AccountsProvider>
          <BlocApiClientProvider>
            <RostersProvider>{children}</RostersProvider>
          </BlocApiClientProvider>
        </AccountsProvider>
      </ExtensionAccountsProvider>
    </ExtensionsProvider>
  );
};

export default Providers;
