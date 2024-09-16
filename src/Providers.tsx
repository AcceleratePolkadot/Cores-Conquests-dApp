import { AccountsProvider } from "@/contexts/Accounts";
import { BalancesProvider } from "@/contexts/Balances";
import { BlocApiClientProvider } from "@/contexts/BlocApiClient";
import { ChainPropertiesProvider } from "@/contexts/ChainProperties";
import { NominationsProvider } from "@/contexts/Nominations";
import { NotificationsProvider } from "@/contexts/Notifications";
import { RostersProvider } from "@/contexts/Rosters";
import { WebExtensionsProvider } from "@/contexts/WebExtensions";
import { ExtensionAccountsProvider, ExtensionsProvider } from "@w3ux/react-connect-kit";
import { SnackbarProvider } from "notistack";
import type React from "react";

interface ProvidersProps {
  children: React.ReactNode;
}

const Providers: React.FC<ProvidersProps> = ({ children }) => {
  return (
    <SnackbarProvider>
      <NotificationsProvider>
        <ExtensionsProvider>
          <ExtensionAccountsProvider network="bloc" dappName="Cores and Conquests">
            <WebExtensionsProvider>
              <AccountsProvider>
                <BlocApiClientProvider>
                  <ChainPropertiesProvider>
                    <BalancesProvider>
                      <RostersProvider>
                        <NominationsProvider>{children}</NominationsProvider>
                      </RostersProvider>
                    </BalancesProvider>
                  </ChainPropertiesProvider>
                </BlocApiClientProvider>
              </AccountsProvider>
            </WebExtensionsProvider>
          </ExtensionAccountsProvider>
        </ExtensionsProvider>
      </NotificationsProvider>
    </SnackbarProvider>
  );
};

export default Providers;
